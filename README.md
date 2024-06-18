# Bun Pipeline

[![fluentci pipeline](https://shield.fluentci.io/x/bun_pipeline)](https://pkg.fluentci.io/bun_pipeline)
[![deno module](https://shield.deno.dev/x/bun_pipeline)](https://deno.land/x/bun_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.41)
[![dagger-min-version](https://shield.fluentci.io/dagger/v0.11.7)](https://dagger.io)
[![](https://jsr.io/badges/@fluentci/bun)](https://jsr.io/@fluentci/bun)
[![codecov](https://img.shields.io/codecov/c/gh/fluent-ci-templates/bun-pipeline)](https://codecov.io/gh/fluent-ci-templates/bun-pipeline)
[![ci](https://github.com/fluent-ci-templates/bun-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/fluent-ci-templates/bun-pipeline/actions/workflows/ci.yml)

A ready-to-use CI/CD Pipeline for your [Bun](https://bun.sh) projects.

![Made with VHS](https://vhs.charm.sh/vhs-2vYAlYsrKSytuEyoxMfYdg.gif)

## 🚀 Usage

Run the following command:

```bash
fluentci run bun_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t bun
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
```

Or simply:

```bash
fluentci
```

## 🧩 Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger install github.com/fluent-ci-templates/bun-pipeline@main
```

Call a function from the module:

```bash
dagger call build --src . \
  --compile \
  --outfile example \
  --entrypoints index.ts

dagger call test --src .

dagger call run --command build --src .
```

## 🛠️ Environment variables

| Variable     | Description                                      |
| ------------ | ------------------------------------------------ |
| NODE_VERSION | The Node.js version to use. Defaults to `18.16.1`|
| BUN_VERSION  | The Bun version to use. Defaults to `latest`      |

## ✨ Jobs

| Job    | Description                            |
| ------ | -------------------------------------- |
| build  | Transpile and bundle one or more files |
| run    | Run a command                          |
| test   | Run the tests                          |

```typescript
build(
  src: string | Directory | undefined = ".",
  entrypoints: string[] = ["index.ts"],
  outfile?: string,
  bunVersion: string = "latest",
  target?: string,
  compile: boolean = false,
  outdir?: string,
  sourcemap?: string,
  minify: boolean = false,
  minifySyntax: boolean = false,
  minifyWhitespace: boolean = false,
  minifyIdentifiers: boolean = false,
  splitting: boolean = false
): Promise<Directory | string>

run(
  command: string,
  src: string | Directory | undefined = ".",
  bunVersion: string = "latest"
): Promise<string>

test(
  src: string | Directory | undefined = ".",
  bunVersion: string = "latest"
): Promise<string>

```

## 👨‍💻 Programmatic usage

You can also use this pipeline programmatically:

```ts
import { test } from "jsr:@fluentci/bun";

await test();
```
