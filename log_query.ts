import { QueryData, QueryResult } from "./query.ts";

export type LogQueryOptions = {
  clock: () => number;
  log: (time: number, data: string) => Promise<void>;
  query: (options: QueryData) => Promise<QueryResult>;
  data: QueryData;
};

export type LogQueryEntry = {
  time: Date;
  latency: number;
  data: QueryData;
  result: QueryResult;
};

export async function logQuery(options: LogQueryOptions) {
  const startTime = options.clock();
  const result = await options.query(options.data);
  const endTime = options.clock();

  const entry: LogQueryEntry = {
    time: new Date(startTime),
    latency: endTime - startTime,
    data: options.data,
    result,
  };

  const json = JSON.stringify(entry, null, 2);
  await options.log(startTime, json);
  return result;
}
