---
layout: ContentLayout.vue
title: Rust宏学习笔记
tag: 笔记

---

[[toc]]

# Rust宏学习笔记

前面的部分基本是 Rust 语言手册翻译。

Rust 中的宏相较C++更为强大。C++ 中的宏在预处理阶段可以展开为文本，Rust 的宏则是对语法的扩展，是在构建语法树时，才展开的宏。

## Rust中宏的分类

Rust 中宏可以分为很多类，包括通过 macro_rules 定义的**声明式宏**和三种**过程式宏**

- custom derive 可推导宏，借助 `#[derive]` 属性标签，它可以用在 struct 和 enum 上
- attribute-like 本身就是一个标签，可以作用于任何地方
- function-like 看上去像函数，但是作用在 token 上，即把token作为函数参数

所以为什么需要宏？

为了偷懒、为了让代码更简洁。使用宏可以快速生成大量代码，避免重复劳动。Rust 宏扩展了语法，你是不会想要每次都老老实实地写繁复的代码的，所以学一点魔法！

为什么不用函数或者模板？

- Rust 的函数必须限定好参数类型和参数个数，而且他并没有提供变长模板参数，所以嘛，哈哈。事实上有不少库为了应对未知个数参数的情况，手写了不同个数参数的函数，而且很蛋疼的是 Rust 也不允许同名函数的重载 :) 当然我还是最喜欢Rust了。
- 宏在编译期展开，所以可以用来给 struct 添加 trait，这必须在运行前完成，而函数需要等到运行时才会执行。

但是坏处（如果算的话）就是宏更难书写、理解和维护；同时函数可以定义、引入在文件里的任何地方，而在使用宏之前必须确保他被定义、引入到上方的代码中了。

下面开始记录宏的写法！

## 声明式宏

在Rust中，应用最广泛的一种宏就是声明式宏，类似于模式匹配的写法，将传入的 Rust 代码与预先指定的模式进行比较，在不同模式下生成不同的代码。

使用`macro_rules!`来定义一个声明式宏。

最基础的例子是很常见的`vec!`：

```rust
let v: Vec<u32> = vec![1, 2, 3];
```

简化版的定义是（实际的版本有其他分支，而且该分支下要预先分配内存防止在push时候再动态分划）

```rust
#[macro_export]
macro_rules! vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}
```

`#[macro_export]`标签是用来声明：只要 use 了这个crate，就可以使用该宏。

按照官方文档的说法，`macro_rules!`目前有一些设计上的问题，日后将推出新的机制来取代他。但是他依然是一个很有效的语法扩展方法。

## 过程式宏

第二类是过程式的宏，它更像函数，他接受一些代码作为参数输入，然后对他们进行加工，生成新的代码，他不是在做声明式宏那样的模式匹配。三种过程式宏都是这种思路。

不能在原始的crate中直接写过程式宏，需要把过程式宏放到一个单独的crate中（以后可能会消除这种约定）。定义过程式宏的方法如下：

```rust
use proc_macro;

#[some_attribute]
pub fn some_name(input: TokenStream) -> TokenStream {
}
```

需要引入`proc_macro` 这个 crate，然后标签是用来声明它是哪种过程式宏的，接着就是一个函数定义，函数接受 `TokenStream`，返回 `TokenStream`。`TokenStream` 类型就定义在 `proc_macro` 包中，表示 token 序列。除了标准库中的这个包，还可以使用`proc_macro2` 包，使用 `proc_macro2::TokenStream::from()` 和 `proc_macro::TokenStream::from()` 可以很便捷地在两个包的类型间进行转换。使用 `proc_macro2` 的好处是可以在过程宏外部使用 `proc_macro2` 的类型，相反 `proc_macro` 中的类型只可以在过程宏的上下文中使用。且 `proc_macro2` 写出的宏更容易编写测试代码。

下面详细说明如何定义三类过程宏。

### Custom Derive 宏

在本节中，我们的目的是实现下面的代码，使用编译器为我们生成名为 `HelloMacro` 的 `Trait`

```rust
use hello_macro::HelloMacro;
use hello_macro_derive::HelloMacro;

#[derive(HelloMacro)]
struct Pancakes;

fn main() {
    Pancakes::hello_macro();
}
```

该 `Trait` 的定义如下，目的是打印实现该宏的类型名

```rust
pub trait HelloMacro {
    fn hello_macro();
}
```

由于过程宏不能在原 crate 中实现，我们需要如下在 `hello_crate` 的目录下新建一个 `hello_macro_derive` crate

```bash
cargo new hello_macro_derive --lib
```

在新的 crate 内，我们需要修改 `Cargo.toml` 配置文件，

```toml
[lib]
proc-macro = true

[dependencies]
syn = "1.0"
quote = "1.0"
```

在 `src/lib.rs` 中可以着手实现该宏，其中 `syn` 是用来解析 rust 代码的，而quote则可以用已有的变量生成代码的 `TokenStream`，可以认为 `quote!` 宏内的就是我们想要生成的代码

```rust
extern crate proc_macro;

use proc_macro::TokenStream;
use quote::quote;
use syn;

#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    // Construct a representation of Rust code as a syntax tree
    // that we can manipulate
    let ast = syn::parse(input).unwrap();

    // Build the trait implementation
    impl_hello_macro(&ast)
}

fn impl_hello_macro(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    let gen = quote! {
        impl HelloMacro for #name {
            fn hello_macro() {
                println!("Hello, Macro! My name is {}!", stringify!(#name));
            }
        }
    };
    gen.into()
}
```

### Attribute-Like 宏 

attribute-like 宏和 custom derive 宏很相似，只是标签可以自定义，更加灵活，甚至可以使用在函数上。他的使用方法如下，比如假设有一个宏为 `route` 的宏

```rust
#[route(GET, "/")] 
fn index() { ... }
```

按下面的语法定义 `route` 宏

```rust
#[proc_maco_attribute]
pub fn route(attr: TokenStream, item: TokenStream) -> TokenStream { ... }
```

其中 `attr` 参数是上面的 `Get`，`"/"` ；`item` 参数是 `fn index(){}` 。

### Function-Like 宏

这种宏看上去和 `macro_rules!` 比较类似，但是在声明式宏只能用 `match` 去做模式匹配，但是在这里可以有更复杂的解析方式，所以可以写出来

```rust
let sql = sql!(SELECT * FROM posts WHERE id=1);
```

上面这个 `sql` 宏的定义方法如下

```rust
#[proc_macro]
pub fn sql(input: TokenStream) -> TokenStream { ... }
```

## References

[Macros - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/book/ch19-06-macros.html)

[Macros - The Rust Reference (rust-lang.org)](https://doc.rust-lang.org/reference/macros.html)

[The Little Book of Rust Macros (danielkeep.github.io)](https://danielkeep.github.io/tlborm/book/index.html)

[如何编写一个过程宏(proc-macro)](https://dengjianping.github.io/2019/02/28/%E5%A6%82%E4%BD%95%E7%BC%96%E5%86%99%E4%B8%80%E4%B8%AA%E8%BF%87%E7%A8%8B%E5%AE%8F(proc-macro).html)