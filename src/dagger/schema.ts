import {
  queryType,
  makeSchema,
  dirname,
  join,
  resolve,
  stringArg,
  nonNull,
} from "../../deps.ts";

import { test, run } from "./jobs.ts";

const Query = queryType({
  definition(t) {
    t.string("test", {
      args: {
        src: stringArg(),
        bunVersion: stringArg(),
      },
      resolve: async (_root, args, _ctx) =>
        await test(args.src || undefined, args.bunVersion || undefined),
    });
    t.string("run", {
      args: {
        command: nonNull(stringArg()),
        src: stringArg(),
        bunVersion: stringArg(),
      },
      resolve: async (_root, args, _ctx) =>
        await run(
          args.command,
          args.src || undefined,
          args.bunVersion || undefined
        ),
    });
  },
});

const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: resolve(join(dirname(".."), dirname(".."), "schema.graphql")),
    typegen: resolve(join(dirname(".."), dirname(".."), "gen", "nexus.ts")),
  },
});

schema.description = JSON.stringify({
  "test.src": "directory",
  "run.src": "directory",
});

export { schema };
