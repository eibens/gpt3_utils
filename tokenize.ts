export { encode as tokenize } from "https://deno.land/x/gpt_2_3_tokenizer@v0.0.1/mod.js";
import { encode as tokenize } from "https://deno.land/x/gpt_2_3_tokenizer@v0.0.1/mod.js";

/**
 * Counts the tokens in a text.
 *
 * @param text is the text that should be measured.
 * @returns the number of tokens in the text.
 */
export function countTokens(text: string) {
  return tokenize(text).length;
}

/**
 * Counts total number of prompt tokens and max_tokens.
 *
 * @returns the estimated cost in dollars.
 */
export function countTokensInQuery(options: {
  prompt: string | string[];
  max_tokens: number;
  engine: string;
}): number {
  const text = typeof options.prompt === "string"
    ? options.prompt
    : options.prompt.join(" ");
  return countTokens(text) + options.max_tokens;
}
