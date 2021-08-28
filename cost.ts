import { Engine } from "./engine.ts";

// Cost per thousand tokens in dollars.
const costs: Record<Engine, number> = {
  ada: 0.0008,
  babbage: 0.0012,
  curie: 0.0060,
  davinci: 0.06,
};

/**
 * Defines a function that converts text into tokens.
 *
 * The implementation is quite large, so it will be injected.
 */
export type Tokenizer = (text: string) => string[];

/**
 * Counts the tokens in a text.
 *
 * @param text is the text that should be measured.
 * @returns the number of tokens in the text.
 */
export function countTokens(text: string, options: {
  tokenize: Tokenizer;
}) {
  return options.tokenize(text).length;
}

/**
 * Calculates the cost of the specified number of tokens.
 *
 * @param tokens is the amount of tokens.
 * @returns the estimated cost for the tokens.
 */
export function costFromCount(tokens: number, options: {
  engine: Engine;
}) {
  return costs[options.engine] * tokens / 1_000;
}

/**
 * Calculates the cost of the tokens in the specified text.
 *
 * @param text is the text that should be tokenized.
 * @returns the estimated cost in dollars.
 */
export function costFromText(text: string, options: {
  engine: Engine;
  tokenize: Tokenizer;
}) {
  return costFromCount(countTokens(text, options), options);
}

/**
 * Calculates the total cost of the prompt tokens and max_tokens.
 *
 * @returns the estimated cost in dollars.
 */
export function costFromQuery(options: {
  prompt: string | string[];
  max_tokens: number;
  engine: Engine;
  tokenize: Tokenizer;
}): number {
  const text = typeof options.prompt === "string"
    ? options.prompt
    : options.prompt.join(" ");
  return costFromCount(
    countTokens(text, options) + options.max_tokens,
    options,
  );
}
