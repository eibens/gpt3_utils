# gpt3_utils

[gpt3_utils] is a set of tools for working with OpenAI's GPT3 API. It is
implemented in TypeScript for Deno.

[![License][license-shield]](LICENSE) [![Github
tag][github-shield]][github]
[![Build][build-shield]][build] [![Code
coverage][coverage-shield]][coverage]

# Getting Started

Set an environment variable called `GPT3_API_KEY` with your API key. Then run
the example with `deno run -A example.ts`. **Warning: Running the example will
use some of your API resources.** See [example.ts](example.ts) and
[gpt3.ts](gpt3.ts) for details on the TypeScript API. Import [gpt3_utils] from
GitHub, where `ref` is a Git ref name such as `main` or a version tag:

```ts
import { gpt3 } from "https://raw.githubusercontent.com/eibens/{ref}/gpt3_utils/mod.ts";
```

# Note on [tokenize.ts](tokenize.ts)

The [mod.ts](mod.ts) module exports all other modules, except for
[tokenize.ts](tokenize.ts). The reason is that the dependencies of the latter
are quite large (~1.5 MB).

<!-- references -->

[gpt3_utils]: #
[deno third party]: https://deno.land/x/
[deno standard]: https://deno.land/std/

<!-- badges -->

[github]: https://github.com/eibens/gpt3_utils
[github-shield]: https://img.shields.io/github/v/tag/eibens/gpt3_utils?label&logo=github
[coverage-shield]: https://img.shields.io/codecov/c/github/eibens/gpt3_utils?logo=codecov&label
[license-shield]: https://img.shields.io/github/license/eibens/gpt3_utils?color=informational
[coverage]: https://codecov.io/gh/eibens/gpt3_utils
[build]: https://github.com/eibens/gpt3_utils/actions/workflows/ci.yml
[build-shield]: https://img.shields.io/github/workflow/status/eibens/gpt3_utils/ci?logo=github&label
[deno-land]: https://deno.land/x/gpt3_utils
[deno-land-shield]: https://img.shields.io/badge/x/module__url-informational?logo=deno&label
