// This list may become incomplete when OpenAI adds new models.
export type Engine =
  | "ada"
  | "babbage"
  | "curie"
  | "curie-instruct-beta"
  | "davinci"
  | "davinci-instruct-beta"
  | "davinci-codex"
  | "cushman-codex"
  | "content-filter-alpha";

export type CompletionParams =
  & {
    engine: Engine | string;
  }
  & Partial<{
    prompt: string | string[];
    maxTokens: number;
    temperature: number;
    topP: number;
    n: number;
    stream: boolean;
    logprobs: number;
    echo: boolean;
    stop: string | string[];
    presencePenalty: number;
    frequencyPenalty: number;
    bestOf: number;
    logitBias: Map<string, number>;
  }>;

export type CompletionChoice = {
  text: string;
  index: number;
  logprobs: unknown;
  finishReason: string;
};

export type CompletionOptions = {
  fetch?: typeof fetch;
  apiKey?: string;
  params: CompletionParams;
  disableChecks?: boolean;
};

export type CompletionResult = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: CompletionChoice[];
};

export async function create(
  options: CompletionOptions,
): Promise<CompletionResult> {
  const { fetch = globalThis.fetch, params } = options;
  const { engine } = params;

  if (!options.disableChecks) {
    const maxCompletions = 8;
    const maxTokensMax = engine === "davinci-codex" ? 4096 : 2048;
    assertParamBetween(params, "maxTokens", 1, maxTokensMax);
    assertParamBetween(params, "temperature", 0, Infinity);
    assertParamBetween(params, "topP", 0, 1);
    assertParamBetween(params, "n", 1, maxCompletions);
    assertParamBetween(params, "bestOf", params.n || 1, maxCompletions);
    assertParamBetween(params, "frequencyPenalty", -2, 2);
    assertParamBetween(params, "presencePenalty", -2, 2);
  }

  const apiKey = getApiKey(options.apiKey);
  const url = `https://api.openai.com/v1/engines/${engine}/completions`;
  const response = await fetch(url, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    }),
    body: JSON.stringify({
      prompt: params.prompt,
      max_tokens: params.maxTokens,
      temperature: params.temperature,
      top_p: params.topP,
      n: params.n,
      stream: params.stream,
      logprobs: params.logprobs,
      echo: params.echo,
      stop: params.stop,
      presence_penalty: params.presencePenalty,
      frequency_penalty: params.frequencyPenalty,
      best_of: params.bestOf,
      logit_bias: params.logitBias,
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(
      `OpenAI API responded with error type "${data.error.type}" and message "${data.error.message}"`,
    );
  }

  return {
    id: data.id,
    object: data.object,
    created: data.created,
    model: data.model,
    choices: data.choices.map((choice: Record<string, unknown>) => ({
      text: choice.text,
      index: choice.index,
      logprobs: choice.logprobs,
      finishReason: choice.finish_reason,
    })),
  };
}

function getApiKey(apiKey?: string): string {
  if (apiKey) return apiKey;
  apiKey = Deno.env.get("OPENAI_API_KEY");
  if (apiKey) return apiKey;
  throw new Error(
    "no OpenAI API key was provided and the OPENAI_API_KEY environment variable is not set",
  );
}

function assertParamBetween(
  params: CompletionParams,
  param: keyof CompletionParams,
  min: number,
  max: number,
) {
  const value = params[param];
  if (value === undefined) return;
  if (value < min || value > max) {
    throw new Error(`${param} must be between ${min} and ${max}`);
  }
}
