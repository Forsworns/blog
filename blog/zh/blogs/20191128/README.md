---
layout: ContentLayout.vue
title: Rust的一些特性
tag: 笔记

---

[[toc]]



### Borrow Check



### 引用

Rust的引用和C++相似却又不同。

Rust的&取出的也是地址，但是可以当作指针来使用，向函数直接传递一个变量会消耗



### 生命周期

对于想要一起销毁的变量可以用'a

### Trait对象

Rust中不像其他面对对象语言，没有继承的概念。

单独看trait本身像是Java中的interface。

使用trait对象可以将不同类型的变量放入同一个数据结构。

trait是用`dyn`关键字定义的，如下定义一个具有trait xxx的对象的指针的列表，任何一个具有该trait的对象的指针都可以放入这个列表。

和普通的泛型不同，rust的编译器无法对它做静态优化，不能根据代码提前生成对应类型的代码。





### Rust的Option

和Haskell中用参数化类型来定义Maybe很像，Rust中用自定义的枚举类型代替Null

```rust
// Rust
enum Option{
    
}
```

```haskell
-- Haskell
data Maybe a = Just a
			 | Nothing
```

