# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [2.0.0-alpha.1] - 2026-10-08

### Changed

- Package renamed to `@noflo/strings`; the version resets to the 2.x generation (2.0.0-alpha.1) for the fresh package name. Component addressing is unchanged — library IDs derive identically from the scoped name, so component and graph names stay the same. The old `noflo-strings` will be deprecated with a pointer once 2.x reaches stable
- Migrated to NoFlo 2.x: components now depend on `@noflo/noflo` ^2.0.0 instead of the unscoped `noflo` 1.x package
- Package is now plain ESM with no build step; supported runtime is Node.js >= 22 (components also run under Deno and Bun)
- Removed all runtime dependencies except `@noflo/noflo`: `underscore` replaced with native methods and an inline ERB-style template engine in `StringTemplate` (semantics preserved; templates get a small built-in helper subset instead of the full `_`), `btoa` replaced with the Web-standard global, `sift-string` replaced with an inlined Sift3 implementation in `Sift3Distance`
- `Replace` and `Filter` route invalid regular expressions to new `error` outports; `Replace` no longer drops empty strings (dead-branch removal); `SplitStr` sends fan-out packets with backpressure-aware awaited sends
- `SubStr` uses `String.slice` instead of the deprecated `substr`
- `Splice` and `TemplateReplace` use the 2.x `InPort.getBuffer(scope)` API instead of 1.x `scopedBuffer` internals; `TemplateReplace` checks all preconditions with `has` before reading any values, per the Process API contract
- Test suite now runs with `@noflo/fbp-spec-runner` and `node:test` instead of Mocha/Chai; every component has an fbp-spec suite
