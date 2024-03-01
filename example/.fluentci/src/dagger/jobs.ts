import { Directory } from "../../deps.ts";
import { dag } from "../../sdk/client.gen.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  test = "test",
  run = "run",
}

const NODE_VERSION = Deno.env.get("NODE_VERSION") || "18.16.1";

export const exclude = [".git", ".devbox", "node_modules", ".fluentci"];

/**
 * @function
 * @description Run tests
 * @param {string | Directory | undefined} src
 * @param {string} bunVersion
 * @returns {string}
 */
export async function test(
  src: string | Directory | undefined = ".",
  bunVersion = "latest"
): Promise<string> {
  const BUN_VERSION = Deno.env.get("BUN_VERSION") || bunVersion;
  const context = await getDirectory(src);
  const ctr = dag
    .pipeline(Job.test)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec(["pkgx", "install", `node@${NODE_VERSION}`, `bun@${BUN_VERSION}`])
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["bun", "install"])
    .withExec(["bun", "test"]);

  return ctr.stdout();
}

/**
 * @function
 * @description Run commands
 * @param {string} command
 * @param {string | Directory | undefined} src
 * @param {string} bunVersion
 * @returns {string}
 */
export async function run(
  command: string,
  src: string | Directory | undefined = ".",
  bunVersion = "latest"
): Promise<string> {
  const BUN_VERSION = Deno.env.get("BUN_VERSION") || bunVersion;
  const context = await getDirectory(src);
  let ctr = dag
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

  return ctr.stdout();
}

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
