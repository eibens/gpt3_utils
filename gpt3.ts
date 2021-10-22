import { authEnv } from "./auth.ts";
import { log } from "./log.ts";
import { logQuery } from "./log_query.ts";
import { query, QueryData } from "./query.ts";

export type Gpt3Options = {
  data: QueryData;
  logPath?: string;
  auth?: string;
  clock?: () => number;
  lstat?: typeof Deno.lstat;
  mkdir?: typeof Deno.mkdir;
  writeTextFile?: typeof Deno.writeTextFile;
  fetch?: typeof globalThis.fetch;
};

/**
 * Queries GPT3 using default options.
 *
 * @param options is the configuration.
 * @returns a query response.
 */
export function gpt3(options: Gpt3Options) {
  const clock = options.clock || Date.now;
  return logQuery({
    data: options.data,
    clock,
    log: (time, data) =>
      log({
        time,
        data,
        path: options.logPath || ".log",
        lstat: options.lstat || Deno.lstat,
        mkdir: options.mkdir || Deno.mkdir,
        writeTextFile: options.writeTextFile || Deno.writeTextFile,
      }),
    query: async (data) =>
      query({
        data,
        fetch: options.fetch || globalThis.fetch,
        auth: options.auth || (await authEnv({
          env: (key) => Promise.resolve(Deno.env.get(key)),
          key: "GPT3_API_KEY",
        })),
      }),
  });
}
