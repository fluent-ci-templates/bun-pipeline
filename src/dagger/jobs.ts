import Client from "@dagger.io/dagger";
import { withDevbox } from "https://deno.land/x/nix_installer_pipeline@v0.3.6/src/dagger/steps.ts";

export enum Job {
  test = "test",
  run = "run",
}

const BUN_VERSION = Deno.env.get("BUN_VERISON") || "0.7.0";
const NODE_VERSION = Deno.env.get("NODE_VERSION") || "18.16.1";

export const test = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const ctr = withDevbox(
    client
      .pipeline(Job.test)
      .container()
      .from("alpine:latest")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "curl", "bash"])
      .withMountedCache("/nix", client.cacheVolume("nix"))
      .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
  )
    .withMountedCache(
      "/root/.local/share/devbox/global",
      client.cacheVolume("devbox-global")
    )
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
    .withDirectory("/app", context, {
      exclude: [".git", ".devbox", "node_modules", ".fluentci"],
    })
    .withWorkdir("/app")
    .withExec(["sh", "-c", 'eval "$(devbox global shellenv)" && bun install'])
    .withExec(["sh", "-c", 'eval "$(devbox global shellenv)" && bun test']);

  const result = await ctr.stdout();

  console.log(result);
};

export const run = async (client: Client, command: string, src = ".") => {
  const context = client.host().directory(src);
  const ctr = withDevbox(
    client
      .pipeline(Job.test)
      .container()
      .from("alpine:latest")
      .withExec(["apk", "update"])
      .withExec(["apk", "add", "curl", "bash"])
      .withMountedCache("/nix", client.cacheVolume("nix"))
      .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
  )
    .withMountedCache(
      "/root/.local/share/devbox/global",
      client.cacheVolume("devbox-global")
    )
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
    .withMountedCache("/app/build", client.cacheVolume("bun-build-dir"))
    .withMountedCache("/app/dist", client.cacheVolume("bun-dist-dir"))
    .withMountedCache("/app/node_modules", client.cacheVolume("node_modules"))
    .withEnvVariable("NIX_INSTALLER_NO_CHANNEL_ADD", "1")
    .withDirectory("/app", context, {
      exclude: [".git", ".devbox", "node_modules", ".fluentci"],
    })
    .withWorkdir("/app")
    .withExec(["sh", "-c", 'eval "$(devbox global shellenv)" && bun install'])
    .withExec([
      "sh",
      "-c",
      `eval "$(devbox global shellenv)" && bun run ${command}`,
    ]);

  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec =
  | ((client: Client, src?: string) => Promise<void>)
  | ((client: Client, command: string, src?: string) => Promise<void>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.run]: run,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run tests",
  [Job.run]: "Run a command",
};
