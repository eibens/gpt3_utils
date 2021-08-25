import { join } from "https://deno.land/std@0.106.0/path/mod.ts";

export type LogOptions = Readonly<{
  data: string;
  path: string;
  time: number;
  mkdir: typeof Deno.mkdir;
  writeTextFile: typeof Deno.writeTextFile;
  lstat: typeof Deno.lstat;
}>;

export async function log(options: LogOptions): Promise<void> {
  const fileName = await getFileName(options.lstat, options.time);
  const file = join(options.path, fileName);
  await options.mkdir(options.path, { recursive: true });
  await options.writeTextFile(file, options.data);
}

async function getFileName(lstat: typeof Deno.lstat, time: number) {
  let i = 0;
  while (true) {
    const file = buildFileName(time, i++);
    if (!await exists(lstat, file)) return file;
  }
}

function buildFileName(time: number, index = 0) {
  const t = new Date(time);
  const year = t.getFullYear();
  const [month, day, hour, minute, second] = [
    t.getMonth(),
    t.getDate(),
    t.getHours(),
    t.getMinutes(),
    t.getSeconds(),
  ].map(String).map((x) => x.padStart(2, "0"));

  return [
    [year, month, day].join("-"),
    [hour, minute, second].join("-"),
    ...(index > 0 ? [index] : []),
    "json",
  ].join(".");
}

async function exists(
  lstat: typeof Deno.lstat,
  file: string,
): Promise<boolean> {
  try {
    await lstat(file);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) return false;
    throw error;
  }
}
