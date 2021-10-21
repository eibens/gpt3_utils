import { cli } from "https://deno.land/x/edcb@v0.9.0-alpha.2/cli.ts";

await cli({
  check: {
    ignore: ".log",
  },
});
