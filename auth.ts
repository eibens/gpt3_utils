export type AuthEnvOptions = {
  key: string;
  env: (key: string) => Promise<string | undefined>;
};

export async function authEnv(options: AuthEnvOptions): Promise<string> {
  const apiKey = await options.env(options.key);
  if (!apiKey) {
    throw new Error(`environment variable '${options.key}' is empty`);
  }
  return apiKey;
}

export type AuthFileOptions = {
  file: string;
  readTextFile: (path: string) => Promise<string>;
};

export async function authFile(options: AuthFileOptions): Promise<string> {
  const apiKey: string = await options.readTextFile(options.file);
  if (!apiKey) throw new Error(`file is empty`);
  return apiKey;
}
