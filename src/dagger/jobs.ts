/**
 * @module bun
 * @description Provides a set of functions for Bun projects
 */

import { Directory, dag, env } from "../../deps.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  test = "test",
  build = "build",
  run = "run",
}

const NODE_VERSION = env.get("NODE_VERSION") || "18.16.1";

export const exclude = [".git", ".devbox", "node_modules", ".fluentci"];

/**
 * Run tests
 *
 * @function
 * @description Run tests
 * @param {string | Directory | undefined} src
 * @param {string} bunVersion
 * @returns {string}
 */
export async function test(
  src: string | Directory | undefined = ".",
  bunVersion: string = "latest"
): Promise<string> {
  const BUN_VERSION = env.get("BUN_VERSION") || bunVersion;
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

  const stdout = await ctr.stdout();
  const stderr = await ctr.stderr();
  return stdout + "\n" + stderr;
}

/**
 *  Run commands
 *
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
  bunVersion: string = "latest"
): Promise<string> {
  const BUN_VERSION = env.get("BUN_VERSION") || bunVersion;
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

  const stdout = await ctr.stdout();
  const stderr = await ctr.stderr();
  return stdout + "\n" + stderr;
}

/**
 * Transpile and bundle one or more files
 *
 * @function
 * @description Transpile and bundle one or more files
 */
export async function build(
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
): Promise<Directory | string> {
  const args: string[] = [];
  if (compile) {
    args.push("--compile");
  }
  if (target) {
    args.push("--target", target);
  }
  if (outdir) {
    args.push("--outdir", outdir);
  }
  if (outfile) {
    args.push("--outfile", outfile);
  }
  if (sourcemap) {
    args.push("--sourcemap", sourcemap);
  }
  if (minify) {
    args.push("--minify");
  }
  if (minifySyntax) {
    args.push("--minify-syntax");
  }
  if (minifyWhitespace) {
    args.push("--minify-whitespace");
  }
  if (minifyIdentifiers) {
    args.push("--minify-identifiers");
  }
  if (splitting) {
    args.push("--splitting");
  }

  const BUN_VERSION = env.get("BUN_VERSION") || bunVersion;
  const context = await getDirectory(src);
  const ctr = dag
    .pipeline(Job.build)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec(["pkgx", "install", `node@${NODE_VERSION}`, `bun@${BUN_VERSION}`])
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["bun", "install"])
    .withExec(["bun", "build", ...entrypoints, ...args])
    .withExec(["mkdir", "-p", "/app/dist"])
    .withExec([
      "sh",
      "-c",
      `[ -f ${outfile} ] && cp ${outfile} /app/dist ; exit 0`,
    ]);

  await ctr.stdout();

  await ctr
    .directory(`/app/${outdir || "dist"}`)
    .export(`./${outdir || "dist"}`);
  return ctr.directory(`/app/${outdir || "dist"}`).id();
}

export type JobExec =
  | ((src?: string, bunVersion?: string) => Promise<string>)
  | ((command: string, src?: string, bunVersion?: string) => Promise<string>)
  | ((
      src: string | Directory | undefined,
      entrypoints: string[],
      outfile?: string,
      bunVersion?: string,
      target?: string,
      compile?: boolean,
      outdir?: string,
      sourcemap?: string,
      minify?: boolean,
      minifySyntax?: boolean,
      minifyWhitespace?: boolean,
      minifyIdentifiers?: boolean,
      splitting?: boolean
    ) => Promise<Directory | string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.build]: build,
  [Job.run]: run,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run tests",
  [Job.build]: "Transpile and bundle one or more files",
  [Job.run]: "Run a command",
};
