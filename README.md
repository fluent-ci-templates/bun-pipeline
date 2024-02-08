# Bun Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fbun_pipeline&query=%24.version)](https://pkg.fluentci.io/bun_pipeline)
[![deno module](https://shield.deno.dev/x/bun_pipeline)](https://deno.land/x/bun_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.37)
[![codecov](https://img.shields.io/codecov/c/gh/fluent-ci-templates/bun-pipeline)](https://codecov.io/gh/fluent-ci-templates/bun-pipeline)

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

## Dagger Module

Use as a [Dagger](https://dagger.io) Module:

```bash
dagger mod install github.com/fluent-ci-templates/bun-pipeline@mod
```

## Environment variables

| Variable     | Description                                      |
| ------------ | ------------------------------------------------ |
| NODE_VERSION | The Node.js version to use. Defaults to `18.16.1`|
| BUN_VERSION  | The Bun version to use. Defaults to `latest`      |

## Jobs

| Job    | Description         |
| ------ | ------------------- |
| run    | Run a command       |
| test   | Run the tests       |

```typescript
test(
  src: string | Directory | undefined = ".",
  bunVersion: string = "latest"
): Promise<string>

run(
  command: string,
  src: string | Directory | undefined = ".",
  bunVersion: string = "latest"
): Promise<string>

test(bunVersion: String, src: String): String
```

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { test } from "https://pkg.fluentci.io/bun_pipeline@v0.6.3/mod.ts";

await test();

```
