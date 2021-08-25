export type Engine =
  | "ada"
  | "babbage"
  | "curie"
  | "davinci";

export type QueryData =
  & {
    prompt: string | string[];
    engine: Engine;
    max_tokens: number;
  }
  & Partial<{
    temperature: number;
    top_p: number;
    n: number;
    stream: boolean;
    logprobs: number;
    echo: boolean;
    stop: string[];
    presence_penalty: number;
    frequency_penalty: number;
    best_of: number;
    logit_bias: Map<string, number>;
  }>;

export type QueryOptions = {
  fetch: typeof fetch;
  auth: () => Promise<string>;
  data: QueryData;
};

export type QueryResult = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    text: string;
    index: number;
    logprobs: unknown;
    finish_reason: string;
  }[];
};

export async function query(options: QueryOptions): Promise<QueryResult> {
  const { engine, ...params } = options.data;
  const url = `https://api.openai.com/v1/engines/${engine}/completions`;
  const body = JSON.stringify(params);
  const apiKey = await options.auth();
  const response = await options.fetch(url, {
    body,
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    }),
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(
      `API responded with error type "${data.error.type}" and message "${data.error.message}"`,
    );
  }
  return data;
}
