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
        src: nonNull(stringArg()),
        bunVersion: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) =>
        await test(args.src, args.bunVersion),
    });
    t.string("run", {
      args: {
        command: nonNull(stringArg()),
        src: nonNull(stringArg()),
        bunVersion: nonNull(stringArg()),
      },
      resolve: async (_root, args, _ctx) =>
        await run(args.command, args.src, args.bunVersion),
    });
  },
});

export const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: resolve(join(dirname(".."), dirname(".."), "schema.graphql")),
    typegen: resolve(join(dirname(".."), dirname(".."), "gen", "nexus.ts")),
  },
});
