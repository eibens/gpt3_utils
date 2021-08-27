import { assertEquals } from "https://deno.land/std@0.106.0/testing/asserts.ts";
import {
  costFromCount,
  costFromQuery,
  costFromText,
  countTokens,
} from "./cost.ts";

const text3Tokens = "hello world";
const text2000Tokens = "hello".repeat(1000);

Deno.test("countTokens returns correct number of tokens", () => {
  assertEquals(countTokens(text3Tokens), 3);
});

Deno.test("costFromCount calculates correct cost for each engine", () => {
  assertEquals(costFromCount(1000, "ada"), 0.0008);
  assertEquals(costFromCount(1000, "babbage"), 0.0012);
  assertEquals(costFromCount(1000, "curie"), 0.006);
  assertEquals(costFromCount(1000, "davinci"), 0.06);
});

Deno.test("costFromText calculates correct cost", () => {
  assertEquals(costFromText(text2000Tokens, "davinci"), 0.12);
});

Deno.test("costFromQuery calculates sum", () => {
  assertEquals(
    costFromQuery({
      engine: "davinci",
      max_tokens: 1000,
      prompt: text2000Tokens,
    }),
    0.18,
  );
});
