import { GitlabCI } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";
import { install, test } from "./jobs.ts";

const gitlabci = new GitlabCI()
  .image("oven/bun:latest")
  .cache(["node_modules/"])
  .addJob("install", install)
  .addJob("test", test);

export default gitlabci;
