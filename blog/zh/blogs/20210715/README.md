---
layout: ContentLayout.vue
title: XDP Tutorial 学习笔记
tag: 笔记

---


# XDP Tutorial 学习笔记

xdp 的相关论文发在 2018 年 CONEXT 上，文章名称是 "The eXpress Data Path: Fast Programmable Packet Processing in the Operating System Kernel"，是 OA 的，可以直接[下载来看](https://dl.acm.org/doi/10.1145/3281411.3281443)。

xdp 没有完全绕过内核，但是可以让包跳过内核的网络栈，直接从用户空间读取。

学习一下 xdp 官方提供的教程，项目地址额为 [xdp-project/xdp-tutorial: XDP tutorial](https://github.com/xdp-project/xdp-tutorial)。该教程依赖的 libbpf 是19年的一版，直接用新版会有问题，需要下项目里的子模块指定的 [libbpf/libbpf at b91f53ec5f1aba2a9d01dc00c4434063abd921e8](https://github.com/libbpf/libbpf/tree/b91f53ec5f1aba2a9d01dc00c4434063abd921e8)。

## 教程的简介

比较基础的章节是 `basic01` 到 `basic04` 目录下的内容。

- basic02：讲解了 libbpf 怎么加载 bpf 代码的。让读者自己实现一个简化的加载过程。用户实现的函数，使用 `_` 前缀与 xdp 团队提供的 api 相区分。相应的 api 是没有 `_` 前缀的，位于 `common` 目录下。例如，`common/common_user_bpf_xdp.c` 下的`load_bpf_and_xdp_attach()` 函数。
- basic03：讲解了 bpf map 的使用。
- basic04：讲解了跨应用共享 bpf map，使用的是 pinning maps 技术。

`tracing01` 到 `tracing04` 是做 tracing 方面的应用。

`packet01` 到 `packet03` 是从包的层面上做了 parsing、rewriting、redirecting。

`advance01` 是 xdp 和 tc 交互的例子。

`advance03` 很有趣，是一个比较完整的例子，展示了如何通过 xdp 在用户空间解析 IPV6 ICMP 报文，并发送回复。是用了一种新型的 socket 地址类型，`AF_XDP`，可以在 kernel 的文档中找到[ AF_XDP 的介绍](https://www.kernel.org/doc/html/latest/networking/af_xdp.html)。

这些教程中的 Assignment 的答案分布：`advance` 和 `tracing` 部分的答案就是在代码里的。`basic` 和 `packet` 部分的是在 `basic-solutions` 和`packet-solutions` 目录下。

## Advance03 笔记

首先简要记录一下 `AF_XDP` 套接字，译自上面提到的 kernel 的文档。

`AF_XDP` socket， 缩写为 XSK，可以通过系统调用 `socket()` 创建。每个 XSK 都有两个环来存储数据，一个 RX ring 和一个 TX ring。套接字能够用 RX ring 接收包，通过 TX ring 发送包。这些环是通过 `setsockopts` 中的选项 `XDP_RX_RING` 和 `XDP_TX_RING` 设置的。每个套接字至少需要其中的一个（以作为单侧的 source/sink node）。RX/TX ring 指向内存中一块叫做 UMEM 的数据。RX 和 TX 能够共享同一块 UMEM 区域，以防在 RX 和 TX 之间频繁地进行数据拷贝。另外，如果由于潜在的重传，一个包需要被保存一段时间，这些指针也能暂时指向别的包，避免拷贝数据。

UMEM 包含了一些大小相同的块，环中的指针会引用它们的地址来引用这些块。这个地址就是在整个 UMEM 区域中的偏移量。用户空间负责为 UMEM 分配内存，分配的方法很灵活，可以用 malloc、mmap、huge pages 等形式。这个内存空间通过 `setsockopt` 中的 `XDP_UMEM_REG` 注册到内核中。

下面去读代码。

打开 `advanced03-AF_XDP/af_xdp_kern.c`，它很精简，只有四十行代码，首先定义了两个 bpf map，一个存储 XSK，一个存储包的数量数据。然后定义了一个 bpf 程序，放在了 `xdp_sock` 段中，用 bpf helper 函数来和定义好的 bpf map 交互。注意其中的代码

```c
/* We pass every other packet */
if ((*pkt_count)++ & 1) 
	return XDP_PASS;
```

是间隔一个地直接返回 `XDP_PASS`，下一个包才会用 `bpf_redirect_map` 去转发。也就是说，过滤掉了一半的包。

在用户空间代码 `advanced03-AF_XDP/af_xdp_user.c` 中。首先是做了 bpf 用户空间程序必要的一些工作，比如 `setrlimit(RLIMIT_MEMLOCK, &rlim)` 去释放内存限制。这也是为什么必须用 sudo 权限运行 bpf 程序。

用 `stats_record` 结构体记录收发数量，在代码最后会单独开一个线程去调用 `stats_poll()` 函数打印实时的收发数据，用信号 `signal(SIGINT, exit_application)` 注册 `exit_application()` 函数，在结束时设置变量，帮助 `stats_poll()` 停止监测。

`xsk_socket_info` 结构体包装 `xsk_socket`，`xsk_umem_info` 结构体包装 `xsk_umem`。这部分代码会反复用到缩写 PROD 代表 producer，也就是发送端 tx；缩写 CONS 代表 consumer，也就是接收端 rx。因为 XSK 默认是 Single-Producer-Single-Consumer 的。

`xsk_configure_socket()` 初始化了 XSK，注意这里初始化发送端和接收端时，是传设置项 `xsk_cfg` 给库函数 `xsk_socket__create()`。`xsk_cfg.rx_size` 和 `xsk_cfg.tx_size` 分别初始化成了 `XSK_RING_CONS__DEFAULT_NUM_DESCS` 和 `XSK_RING_PROD__DEFAULT_NUM_DESCS`，他们会在库函数 `xsk_socket__create()` 中传递给系统调用 `setsockopt()` 去完成 XSK 中的 tx 和 rx 的创建。他们是定义在 `xsk.h` 中的宏，值都是 2048。事实上，只能被初始化成2的幂次。因为在库里的 `xsk.h` 中，获取 `xdp_desc` 的函数是这么定义的

```C
static inline struct xdp_desc *xsk_ring_prod__tx_desc(struct xsk_ring_prod *tx,
						      __u32 idx)
{
	struct xdp_desc *descs = (struct xdp_desc *)tx->ring;

	return &descs[idx & tx->mask];
}

static inline const struct xdp_desc *
xsk_ring_cons__rx_desc(const struct xsk_ring_cons *rx, __u32 idx)
{
	const struct xdp_desc *descs = (const struct xdp_desc *)rx->ring;

	return &descs[idx & rx->mask];
}


/* Rx/Tx descriptor */
struct xdp_desc {
	__u64 addr;
	__u32 len;
	__u32 options;
};
```

注意 `idx & tx->mask` 和  `idx & rx->mask` 是在用按位与运算去防止下标溢出，相当于在取模。这里的 `mask` 是在库里的 `xsk.c` 中的`xsk_socket__create()` 函数中初始化的，都是初始化成 `size-1` 的，也就是 2047，各位都是 1，如果 `size` 不是 2 的幂次，显然就不能这么干了。 

创建好 XSK，就可以监听了，这部分逻辑写在 `rx_and_process()` 中，用 `poll(struct pollfd *__fds, nfds_t __nfds, -1)` 系统调用去监听之前创建好的 XSK，在没有触发事件时阻塞。收到包后，调用 `handle_receive_packets()` 在 XSK 对应的 umem 中读取 rx 端，也就是 consumer 接收到的包。经过最深层的 `process_packet()` 处理，做的就是把包的指针转换成各层的首部，然后读取他们。因为实验中只有 IPV6 ICMP 报文，所以就直接像下面这样写了。处理完后，写入到 umem 中 tx 也就是 producer 管理的内存中。

```c
static bool process_packet(struct xsk_socket_info *xsk, uint64_t addr, uint32_t len)
{
	uint8_t *pkt = xsk_umem__get_data(xsk->umem->buffer, addr);
	// get header one by one
	struct ethhdr *eth = (struct ethhdr *) pkt;
    // pointer adds 1*sizeof(ethhdr) in fact
	struct ipv6hdr *ipv6 = (struct ipv6hdr *) (eth + 1); 
    // pointer adds 1*sizeof(ipv6hdr) in fact
	struct icmp6hdr *icmp = (struct icmp6hdr *) (ipv6 + 1);
		
    // ...
    
	// exchange source and destination
	memcpy(tmp_mac, eth->h_dest, ETH_ALEN);
	memcpy(eth->h_dest, eth->h_source, ETH_ALEN);
	memcpy(eth->h_source, tmp_mac, ETH_ALEN);

    // ...

	icmp->icmp6_type = ICMPV6_ECHO_REPLY;
	// replace icmp checksum in the packet
	csum_replace2(&icmp->icmp6_cksum,
				htons(ICMPV6_ECHO_REQUEST << 8),
				htons(ICMPV6_ECHO_REPLY << 8));
	// check remaining space in the ring 
	ret = xsk_ring_prod__reserve(&xsk->tx, 1, &tx_idx);
	if (ret != 1) {
		/* No more transmit slots, drop the packet */
		return false;
	}
	// write to tx
	xsk_ring_prod__tx_desc(&xsk->tx, tx_idx)->addr = addr;
	xsk_ring_prod__tx_desc(&xsk->tx, tx_idx)->len = len;
	xsk_ring_prod__submit(&xsk->tx, 1);
    
	return true;
}
```

至此该节内容结束。

## 其他可以参考的资料

Linux manual page 上的 [bpf-helpers](https://man7.org/linux/man-pages/man7/bpf-helpers.7.html) 页面。

前几篇 bpf 的相关笔记。