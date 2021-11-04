import * as fmt from "https://deno.land/std@0.106.0/fmt/colors.ts";
import * as openai from "./mod.ts";

// This generates the input for GPT3.
const makePrompt = (thing: string) =>
  `
This is an object color classifier

snow: white
coal: black
blood: red
a blue flower: blue
ladybug: red, black
easter egg: colorful
${thing}:
`.trim();

// This function maps a thing to its color using GPT3.
async function findColor(thing: string): Promise<string> {
  const result = await openai.completions.create({
    params: {
      prompt: makePrompt(thing),
      maxTokens: 5,
      engine: "curie",
      temperature: 0,
      stop: "\n",
    },
  });
  const text = result.choices[0].text;
  const [line] = text.split("\n");
  return line.trim();
}

// This implements a CLI for the example.
if (import.meta.main) {
  const thing = Deno.args[0];
  if (thing === undefined) {
    console.error(fmt.red(`Please specify the thing that should be colored.`));
  } else {
    console.log(
      fmt.cyan(
        `Thinking about the color of ${fmt.italic(fmt.brightCyan(thing))}.`,
      ),
    );
    try {
      const color = await findColor(thing);
      console.log(
        fmt.green(
          `I think ${fmt.italic(fmt.brightGreen(thing))} is ${
            fmt.brightGreen(fmt.bold(color))
          }.`,
        ),
      );
    } catch (error) {
      console.error(
        fmt.red(
          `I failed with ${fmt.brightRed(fmt.bold(error.name))} because ${
            fmt.brightRed(fmt.italic(error.message))
          }.`,
        ),
      );
      console.error(error);
    }
  }
}
