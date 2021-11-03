import { assertEquals } from "https://deno.land/std@0.113.0/testing/asserts.ts";
import { countTokens, countTokensInCompletion } from "./tokenize.ts";

Deno.test("countTokens is zero for empty string", () => {
  assertEquals(countTokens(""), 0);
});

Deno.test("countTokens counts tokens in text", () => {
  assertEquals(countTokens("Hello world"), 2);
});

Deno.test("countTokensInCompletion works without params", () => {
  assertEquals(countTokensInCompletion({}), 0);
});

Deno.test("countTokensInCompletion works with simple completion", () => {
  assertEquals(
    countTokensInCompletion({
      prompt: "Hello world",
      maxTokens: 1,
      bestOf: 1,
      n: 1,
    }),
    3,
  );
});

Deno.test("countTokensInCompletion takes max of n and bestOf", () => {
  assertEquals(
    countTokensInCompletion({
      prompt: "",
      maxTokens: 10,
      bestOf: 4,
      n: 3,
    }),
    40,
  );
});
