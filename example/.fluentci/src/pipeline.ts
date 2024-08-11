import * as jobs from "./jobs.ts";

const { test, runnableJobs } = jobs;

export default async function pipeline(src = ".", args: string[] = []) {
  if (args.length > 0) {
    await runSpecificJobs(args);
    return;
  }

  await test(src);
}

async function runSpecificJobs(args: string[]) {
  if (args[0] === "run" && args.length > 1) {
    const job = runnableJobs["run"];
    for (const name of args.slice(1)) {
      await job(name);
    }
    return;
  }
  for (const name of args) {
    const job = runnableJobs[name as jobs.Job];
    if (!job) {
      await runnableJobs.run(name);
    }
    await job(".");
  }
}
