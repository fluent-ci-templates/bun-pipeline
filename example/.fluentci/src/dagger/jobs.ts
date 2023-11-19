import Client, { Directory } from "../../deps.ts";
import { connect } from "../../sdk/connect.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  test = "test",
  run = "run",
}

const NODE_VERSION = Deno.env.get("NODE_VERSION") || "18.16.1";

export const exclude = [".git", ".devbox", "node_modules", ".fluentci"];

export const test = async (
  src: string | Directory | undefined = ".",
  bunVersion?: string
) => {
  const BUN_VERSION = Deno.env.get("BUN_VERSION") || bunVersion || "1.0.3";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const ctr = client
      .pipeline(Job.test)
      .container()
      .from("pkgxdev/pkgx:latest")
      .withExec(["apt-get", "update"])
      .withExec(["apt-get", "install", "-y", "ca-certificates"])
      .withExec([
        "pkgx",
        "install",
        `node@${NODE_VERSION}`,
        `bun@${BUN_VERSION}`,
      ])
      .withMountedCache(
        "/root/.bun/install/cache",
        client.cacheVolume("bun-cache")
      )
      .withMountedCache("/app/node_modules", client.cacheVolume("node_modules"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["bun", "install"])
      .withExec(["bun", "test"]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "All tests passed";
};

export const run = async (
  command: string,
  src: string | Directory | undefined = ".",
  bunVersion?: string
) => {
  const BUN_VERSION = Deno.env.get("BUN_VERSION") || bunVersion || "1.0.3";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    let ctr = client
      .pipeline(Job.run)
      .container()
      .from("pkgxdev/pkgx:latest")
      .withExec(["apt-get", "update"])
      .withExec(["apt-get", "install", "-y", "ca-certificates"])
      .withExec([
        "pkgx",
        "install",
        `node@${NODE_VERSION}}`,
        `bun@${BUN_VERSION}`,
      ])
      .withMountedCache(
        "/root/.bun/install/cache",
        client.cacheVolume("bun-cache")
      )
      .withMountedCache("/app/node_modules", client.cacheVolume("node_modules"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["bun", "install"])
      .withExec(["bun", "run", command]);

    if (command === "build") {
      ctr = ctr
        .withExec(["mkdir", "-p", "/app/dist"])
        .withExec(["mkdir", "-p", "/app/build"]);
      await ctr.directory("/app/dist").export("./dist");
      await ctr.directory("/app/build").export("./build");
    }

    const result = await ctr.stdout();

    console.log(result);
  });
  return "Command executed";
};

export type JobExec =
  | ((src?: string, bunVersion?: string) => Promise<string>)
  | ((command: string, src?: string, bunVersion?: string) => Promise<string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.run]: run,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run tests",
  [Job.run]: "Run a command",
};
