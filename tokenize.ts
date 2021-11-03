export { encode as tokenize } from "https://deno.land/x/gpt_2_3_tokenizer@v0.0.1/mod.js";
import { encode as tokenize } from "https://deno.land/x/gpt_2_3_tokenizer@v0.0.1/mod.js";

/**
 * Counts the tokens in a text.
 *
 * @param text is the text that should be measured.
 * @returns the number of tokens.
 */
export function countTokens(text: string) {
  return tokenize(text).length;
}

/**
 * Counts the maximum number of tokens consumed by the completion.
 *
 * This is the formula:
 *
 *     total = countTokens(prompt) + max(bestOf, n) * maxTokens
 *
 * @param options is the completion parameters that should be measured.
 * @returns the number of tokens.
 */
export function countTokensInCompletion(options: {
  prompt?: string | string[];
  maxTokens?: number;
  bestOf?: number;
  n?: number;
}): number {
  const maxTokens = options.maxTokens || 0;
  const bestOf = options.bestOf || 1;
  const n = options.n || 1;
  const prompt = typeof options.prompt === "string"
    ? options.prompt
    : (options.prompt || []).join(" ");
  return countTokens(prompt) + Math.max(bestOf, n) * maxTokens;
}
