---
layout: ContentLayout.vue
title: Mimic Generic Specialization in Rust 
tag: 笔记
---

[[toc]]



# Mimic Generic Specialization in Rust  

Last weekend I tried to write the [sentinel](https://github.com/sentinel-group/sentinel-rust/) middleware for [tonic](https://github.com/hyperium/tonic/) and [volo](https://github.com/cloudwego/volo/), and struggled fighting against rustc again.

## Background

The tonic supports two ways to implement middleware. 

- [tower service](https://docs.rs/tower/latest/tower/trait.Service.html)
- [tonic interceptor](https://docs.rs/tonic/latest/tonic/service/interceptor/index.html)

Different from tonic, volo utilizes [motore](https://docs.rs/motore/latest/motore/service/trait.Service.html) as the service abstraction. 

## How the problem arose?

I first implement the `tonic::Servie` .  Intuitively, I wrote

```rust
 impl<S, B> Service<http::Request<B>> for SentinelService<S, http::Request<B>, B>
    where
        S: Service<http::Request<B>>,
    {}

impl<S, R> Service<R> for SentinelService<S, R>
    where
        S: Service<R>,
    {}
```

So what I expected is that: For tonic, whose request is in fact `http::Request<http_body::combinators::UnsyncBoxBody<bytes::Bytes, tonic::Status>>` , will be substituted in the first generic, instead of the second. In the first case, we can call methods on `http::Request` to provide a default resource extractor for [sentinel](https://github.com/sentinel-group/sentinel-rust/), while in the second one, the custom resource extractor is necessary.

I thought that there is a similar feature in rust as **SFINAE** in C++. The best specialization of the generic would be chosen. 

However, rustc reminded me that two implementation of trait `Service` was contradicted with each other. I realized that there was no `SFINAE` in rust! 

## Mimic the SFINAE!

From [Pick preferred implementation on conflicting trait implementation (using negative bounds) - Stack Overflow](https://stackoverflow.com/questions/65131776/pick-preferred-implementation-on-conflicting-trait-implementation-using-negativ), I learnt that we could use the unstable [negative_impls](https://doc.rust-lang.org/beta/unstable-book/language-features/negative-impls.html) and [auto_traits](https://doc.rust-lang.org/nightly/unstable-book/language-features/auto-traits.html) feature, to do this magic

```rust
#![cfg_attr(feature = "nightly", feature(auto_traits, negative_impls))]
trait WithoutDefaultExtractor {}
impl<B> !WithoutDefaultExtractor for http::Request<B> {}

impl<S, B> Service<http::Request<B>> for SentinelService<S, http::Request<B>, B>
    where
        S: Service<R>,
    {}

impl<S, R> Service<R> for SentinelService<S, R>
    where
        S: Service<R>,
        R: WithoutDefaultExtractor,
    {}
```

<center>ELEGANT! VERY ELEGANT!</center>

<img src="./Anya.jpg" style="zoom:20%;" />

## Is it perfect?

If the generic is the same, say, if we have the following code,

```rust
impl<S, R> Service<R> for SentinelService<S, R>
    where
        S: Service<R>,
    {}

impl<S, R> Service<R> for SentinelService<S, R>
    where
        S: Service<R>,
        R: AnotherTrait,
    {}
```

the above method does not work anymore. Or we can use a Higher-Rank Trait Bounds (HRTBs) and apply the similar method? I didn't try.

## Fine, I give up ...

Finally, I choose to add some feature items in my `Cargo.toml`, so that I can use the `#[cfg(feature="http")]` attribute to control the specialization by hand :(

Then the code becomes

```rust
#[cfg(feature = "http")]
impl<S, B> Service<http::Request<B>> for SentinelService<S, http::Request<B>, B>
    where
        S: Service<http::Request<B>>,
    {}
    
#[cfg(not(feature = "http"))]
impl<S, R> Service<R> for SentinelService<S, R>
    where
        S: Service<R>,
    {}
```

## Related questions

[Generics partial specialization in Rust - Stack Overflow](https://stackoverflow.com/questions/66832882/generics-partial-specialization-in-rust)

[Equivalent of specific template usage in C++ for Rust - Stack Overflow](https://stackoverflow.com/questions/47675493/equivalent-of-specific-template-usage-in-c-for-rust)

## Appendix

The Service trait in motore is different from that in tower. In tower, the type of the message is erased in `tonic::service::interceptor::Interceptor` by the following magical code. In the motore, the metadata and extension is moved to the context argument passed along the call chain, and the request is kept by another argument.

```rust
// tonic/tonic/src/service/interceptor.rs
impl<S, F, ReqBody, ResBody> Service<http::Request<ReqBody>> for InterceptedService<S, F>
{
    fn call(&mut self, req: http::Request<ReqBody>) -> Self::Future {
        // It is bad practice to modify the body (i.e. Message) of the request via an interceptor.
        // To avoid exposing the body of the request to the interceptor function, we first remove it
        // here, allow the interceptor to modify the metadata and extensions, and then recreate the
        // HTTP request with the body. Tonic requests do not preserve the URI, HTTP version, and
        // HTTP method of the HTTP request, so we extract them here and then add them back in below.
        let uri = req.uri().clone();
        let method = req.method().clone();
        let version = req.version();
        let req = crate::Request::from_http(req);
        let (metadata, extensions, msg) = req.into_parts();
		// Here the `msg` is erased from the `Request`:) 
        match self
            .f
            .call(crate::Request::from_parts(metadata, extensions, ()))
        {
            Ok(req) => {
                let (metadata, extensions, _) = req.into_parts();
                let req = crate::Request::from_parts(metadata, extensions, msg);
                let req = req.into_http(uri, method, version, SanitizeHeaders::No);
                ResponseFuture::future(self.inner.call(req))
            }
            Err(status) => ResponseFuture::status(status),
        }
    }
}
```

