import { client } from "./dagger.ts";

export enum Job {
  test = "test",
  run = "run",
}

const BUN_VERSION = Deno.env.get("BUN_VERSION") || "0.7.0";
const NODE_VERSION = Deno.env.get("NODE_VERSION") || "18.16.1";

export const exclude = [".git", ".devbox", "node_modules", ".fluentci"];

export const test = async (src = ".") => {
  const context = client.host().directory(src);
  const ctr = client
    .pipeline(Job.test)
    .container()
    .from("ghcr.io/fluent-ci-templates/devbox:latest")
    .withExec([
      "devbox",
      "global",
      "add",
      `nodejs@${NODE_VERSION}`,
      `bun@${BUN_VERSION}`,
    ])
    .withMountedCache(
      "/root/.bun/install/cache",
      client.cacheVolume("bun-cache")
    )
    .withMountedCache("/app/node_modules", client.cacheVolume("node_modules"))
    .withEnvVariable("NIX_INSTALLER_NO_CHANNEL_ADD", "1")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["sh", "-c", 'eval "$(devbox global shellenv)" && bun install'])
    .withExec(["sh", "-c", 'eval "$(devbox global shellenv)" && bun test']);

  const result = await ctr.stdout();

  console.log(result);

  return "All tests passed";
};

export const run = async (command: string, src = ".") => {
  const context = client.host().directory(src);
  let ctr = client
    .pipeline(Job.run)
    .container()
    .from("ghcr.io/fluent-ci-templates/devbox:latest")
    .withExec([
      "devbox",
      "global",
      "add",
      `nodejs@${NODE_VERSION}`,
      `bun@${BUN_VERSION}`,
    ])
    .withMountedCache(
      "/root/.bun/install/cache",
      client.cacheVolume("bun-cache")
    )
    .withMountedCache("/app/node_modules", client.cacheVolume("node_modules"))
    .withEnvVariable("NIX_INSTALLER_NO_CHANNEL_ADD", "1")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["sh", "-c", 'eval "$(devbox global shellenv)" && bun install'])
    .withExec([
      "sh",
      "-c",
      `eval "$(devbox global shellenv)" && bun run ${command}`,
    ]);

  if (command === "build") {
    ctr = ctr
      .withExec(["mkdir", "-p", "/app/dist"])
      .withExec(["mkdir", "-p", "/app/build"]);
    await ctr.directory("/app/dist").export("./dist");
    await ctr.directory("/app/build").export("./build");
  }

  const result = await ctr.stdout();

  console.log(result);

  return "Command executed";
};

export type JobExec =
  | ((src?: string) => Promise<string>)
  | ((command: string, src?: string) => Promise<string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.run]: run,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run tests",
  [Job.run]: "Run a command",
};
