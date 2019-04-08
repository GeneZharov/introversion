// @flow

export function basename(path: string): string {
  const xs = path.split("/");
  return xs[xs.length - 1];
}
