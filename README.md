# Bun Pipeline

[![deno module](https://shield.deno.dev/x/bun_pipeline)](https://deno.land/x/bun_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![codecov](https://img.shields.io/codecov/c/gh/fluent-ci-templates/bun-pipeline)](https://codecov.io/gh/fluent-ci-templates/bun-pipeline)

A ready-to-use CI/CD Pipeline for your [Bun](https://bun.sh) projects.

## 🚀 Usage

Run the following command:

```bash
dagger run fluentci bun_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t bun
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
dagger run fluentci .
```

Or simply:

```bash
fluentci
```

## Jobs

| Job    | Description         |
| ------ | ------------------- |
| test   | Run the tests       |

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { Client, connect } from "https://esm.sh/@dagger.io/dagger@0.8.1";
import { Dagger } from "https://deno.land/x/bun_pipeline/mod.ts";

const { test } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await test(client, src);
  });
}

pipeline();
```
