import { Job } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";

export const test = new Job().script("bun test");

export const install = new Job().script("bun install");
