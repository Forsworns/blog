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

`#[macro_export]`标签是用来声明：只要 use 了这个crate，就可以使用该宏。同时包含被 export 出的宏的模块，在声明时必须放在前面，否则靠前的模块里找不到这些宏。

按照官方文档的说法，`macro_rules!`目前有一些设计上的问题，日后将推出新的机制来取代他。但是他依然是一个很有效的语法扩展方法。

这里一个注意点是：如果想要创建临时变量，那么必须要像上面这个例子这样，放在某个块级作用域内，以便自动清理掉，否则会认为是不安全的行为。

:::声明宏中支持的语法树元变量类型

出自 [Macros By Example - The Rust Reference](https://doc.rust-lang.org/reference/macros-by-example.html#metavariables)。

回顾编译原理 :) 

- `item`: 随便一个什么 [东西](https://doc.rust-lang.org/reference/items.html)，准确定义参考上述手册中
- `block`: 一个 [块表达式](https://doc.rust-lang.org/reference/expressions/block-expr.html)
- `stmt`: 一个 [语句](https://doc.rust-lang.org/reference/statements.html)，但是不包含结尾的分号，除了必须有分号的 item statements 
- `pat_param`: 一个 [匹配模式](https://doc.rust-lang.org/reference/patterns.html)
- `pat`: 等价于 `pat_param`
- `expr`: 一个 [表达式](https://doc.rust-lang.org/reference/expressions.html)
- `ty`: 一种 [类型](https://doc.rust-lang.org/reference/types.html#type-expressions)
- `ident`: 一个 [标识符或关键字](https://doc.rust-lang.org/reference/identifiers.html)
- `path`: 一条 [TypePath](https://doc.rust-lang.org/reference/paths.html#paths-in-types) 形式的路径
- `tt`: [Token 树](https://doc.rust-lang.org/reference/macros.html#macro-invocation) （一个独立的 [token](https://doc.rust-lang.org/reference/tokens.html) 或一系列在匹配完整的定界符 `()`、`[]` 或 `{}` 中的 token）
- `meta`:  [标签](https://doc.rust-lang.org/reference/attributes.html) 中的内容
- `lifetime`:  一个 [生命周期标识](https://doc.rust-lang.org/reference/tokens.html#lifetimes-and-loop-labels)
- `vis`: 可能不存在的 [可见性标记](https://doc.rust-lang.org/reference/visibility-and-privacy.html)（并不是所有函数、类型都会使用 `pub` 进行标记，所以可能是不存在的）
- `literal`: 匹配 [文本表达式](https://doc.rust-lang.org/reference/expressions/literal-expr.html)

:::

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

另外，**Custom Derive 宏可以携带Attributes，称为 Derive macro helper attributes**，具体编写方法可以参考 [Reference](https://doc.rust-lang.org/reference/procedural-macros.html#derive-macro-helper-attributes)（Rust 中共有[四类 Attributes](https://doc.rust-lang.org/reference/attributes.html)）。关于 Derive macro helper attributes 这里有一个坑就是在使用 `cfg_attr` 时，需要把 Attributes 放在宏之前。举个栗子：

使用 kube-rs 可以很方便地定义 CRD（Custom Resource Definition）：

```rust
#[derive(CustomResource, Clone, Debug, Deserialize, Serialize, JsonSchema)]
#[kube(group = "clux.dev", version = "v1", kind = "Foo", namespaced)]
struct FooSpec {
    info: String,
}
```

我第一反应是 #[kube] 在这里是下面提到的 Attribute-Like 宏，但是 kubers 文档才发现是 `CustomResource` Custom Derive 宏的 Attribute。这里我们想用 `cfg_attr` 来控制是否去做 derive，一开始就想当然地这么写了：

```rust
#[cfg_attr(feature="use_kube_rs",
    derive(CustomResource, Clone, Debug, Deserialize, Serialize, JsonSchema),
    kube(group = "clux.dev", version = "v1", kind = "Foo", namespaced)
)]
struct FooSpec {
    info: String,
}
```

然而这是错误的打开方式，需要写成：

```rust
#[cfg_attr(feature="use_kube_rs",
    kube(group = "clux.dev", version = "v1", kind = "Foo", namespaced),
    derive(CustomResource, Clone, Debug, Deserialize, Serialize, JsonSchema)
)]
struct FooSpec {
    info: String,
}
```

Attributes 需要写在宏的 derive 前面。

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

## 好用的库

[proc_macro](https://doc.rust-lang.org/proc_macro/index.html)：默认 token 流库，只能在过程宏中使用，编译器要用它，将它作为过程宏的返回值，大多数情况我们不需要，只需要在宏返回结果的时候把 `proc_macro2::TokenSteam` 的流 `into()` 到 `proc_macro::TokenSteam` 就行了。

[proc_macro2](https://crates.io/crates/proc_macro2)：我们真正在使用的过程宏库，可以在过程宏外使用。

[syn](https://crates.io/crates/syn)：过程宏左护法，可以将 `TokenStream` 解析成语法树，注意两个 `proc_macro` 和 `proc_macro` 都支持，需要看文档搞清楚库函数到底是在解析哪个库中的 `TokenStream`。

[quote](https://crates.io/crates/quote)：过程宏右护法，将语法树解析成 `TokenStream`。只要一个 `quote!{}` 就够了！`quote!{}` 宏内都是字面量，即纯纯的代码，要替换进去的变量是用的 `#` 符号标注，为了和声明宏中使用的 `$` 相区分（也就意味着用 `quote` 写过程宏的时候，可以和声明宏结合 🤤 ）。模式匹配时用到的表示重复的符号和声明宏中一样，是使用 `*`。 

 [darling](https://crates.io/crates/darling) 好用到跺 jio jio 的标签宏解析库，让人直呼 Darling！

## 收录有趣的宏样例

本章收录到的宏尽可能短小、独立、有趣。

### 你这写的啥啊

记录一下自己写的一些有趣的宏，以防下次碰到这种情况忘记咋写。

- 这里的实际需求是处理标签宏参数，用了 [darling](https://crates.io/crates/darling) 库做解析，然后处理一些 `Option` 类型的可选参数，如果标签宏参数中没有它（即 `darling` 解析出 `None`），就不理会它，在后续构造中使用默认值。感觉有意思的地方在于过程宏和声明宏的混合使用，在写出来之前我没想到这么写真能跑 = = 

    ```rust
    macro_rules! expand_attribute {
        ($($attr:expr),*) => {
            {
                let mut token = TokenStream2::new();
                $(if let Some(val) = $attr {
                    token.extend(quote!{$attr: #val,});
                })*
                token
            }
        };
    }
    ```
    
    使用时是这么用的
    
    ```rust
    use darling::FromMeta;
    
    #[derive(Debug, FromMeta)]
    struct Attrs{
        #[darling(default)]
        pub param1: Option<f64>,
        #[darling(default)]
        pub param2: Option<f64>,
        #[darling(default)]
        pub param3: Option<f64>,
    }
    
    #[derive(Debug, Default)]
    struct Struct{
        pub param1: f64,
        pub param2: f64,
        pub neccessary: String, // cannot be empty or any default value
    }
    
    #[proc_macro_attribute]
    pub fn an_attribute(attr: TokenStream, item: TokenStream) -> TokenStream {
        let Attrs {
            param1, 
            param2, 
            ... // Attrs::param3 is not useful in Struct
        } =  match Attrs::from_list(&attr) {
            Ok(v) => v,
            Err(e) => {
                return TokenStream::from(e.write_errors());
            }
        };
        let optional_params = expand_attribute!(param1, param2);
        let build_a_struct = quote! {
            Struct {
                neccessary: "0817", 
                #optional_params
                ..Default::default()
            }
        };
        // TL;DR
    }
    ```
    
    看得出来还是比较繁琐的，
    
- 这里的实际需求是用标签宏修改原函数返回值为 Result，是在 [sentinel-group/sentinel-rust](https://github.com/sentinel-group/sentinel-rust) 的实现中，用来快速给一个函数或方法创建 sentinel 的。当时的想法是用 Result 来表达某个流是否被阻碍，同时可以传递 Sentinel 的告警给用户，实现出来的很垃圾，可以说是只支持使用一个规则。没有试过多个这样的标签宏嵌套，但是估计是回调地狱重现世间 :sweat_smile: （或许可以用 `std::Result::flatten()` 来避免，但是它目前还是 nightly 的 API）。

    这里的实现也有点蠢，是用的 quote 和 syn 自动解析的修改后的函数签名，尝试过手动构造，但是太恶心了构造不来。
    
    ```rust
    pub(crate) fn process_func(mut func: ItemFn) -> ItemFn {
        let output = func.sig.output;
        // Currently, use quote/syn to automatically generate it,
        // don't know if there is a better way.
        // Seems hard to parse new ReturnType only or construct ReturnType by hand.
        let dummy_func = match output {
            ReturnType::Default => {
                quote! {
                    fn dummy() -> Result<(), String> {}
                }
            }
            ReturnType::Type(_, return_type) => {
                quote! {
                    fn dummy() -> Result<#return_type, String> {}
                }
            }
        };
        let dummy_func: ItemFn = syn::parse2(dummy_func).unwrap();
        // replace the old ReturnType to the dummy function ReturnType
        func.sig.output = dummy_func.sig.output;
        func
    }
    ```


### 还得学习一个

本章节抄录一些别人写的黑魔法宏。

## References

[Macros - The Rust Programming Language (rust-lang.org)](https://doc.rust-lang.org/book/ch19-06-macros.html)

[Macros - The Rust Reference (rust-lang.org)](https://doc.rust-lang.org/reference/macros.html)

[The Little Book of Rust Macros (danielkeep.github.io)](https://danielkeep.github.io/tlborm/book/index.html)

[如何编写一个过程宏(proc-macro)](https://dengjianping.github.io/2019/02/28/%E5%A6%82%E4%BD%95%E7%BC%96%E5%86%99%E4%B8%80%E4%B8%AA%E8%BF%87%E7%A8%8B%E5%AE%8F(proc-macro).html)
