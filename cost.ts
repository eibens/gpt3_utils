import { Engine } from "./engine.ts";
import { encode } from "https://deno.land/x/gpt_2_3_tokenizer@v0.0.1/mod.js";

// Cost per thousand tokens in dollars.
const costs: Record<Engine, number> = {
  ada: 0.0008,
  babbage: 0.0012,
  curie: 0.0060,
  davinci: 0.06,
};

/**
 * Counts the tokens in a text.
 *
 * @param text is the text that should be tokenized.
 * @returns the number of tokens in the text.
 */
export function countTokens(text: string) {
  return encode(text).length;
}

/**
 * Calculates the cost of the specified number of tokens.
 *
 * @param tokens is the amount of tokens.
 * @param engine is the GPT3 engine.
 * @returns the estimated cost for the tokens.
 */
export function costFromCount(tokens: number, engine: Engine) {
  return costs[engine] * tokens / 1_000;
}

/**
 * Calculates the cost of the tokens in the specified text.
 *
 * @param text is the text that should be tokenized.
 * @param engine is the GPT3 engine.
 * @returns the estimated cost in dollars.
 */
export function costFromText(text: string, engine: Engine) {
  return costFromCount(countTokens(text), engine);
}

/**
 * Calculates the total cost of the prompt tokens and max_tokens.
 *
 * @param options define the relevant parameters.
 * @returns the estimated cost in dollars.
 */
export function costFromQuery(options: {
  prompt: string;
  max_tokens: number;
  engine: Engine;
}): number {
  return costFromCount(
    countTokens(options.prompt) + options.max_tokens,
    options.engine,
  );
}
