// @flow

export function notCallableLastArg() {
  return new Error("The last argument is not a function");
}

export function invalidTimeID() {
  return new Error("Time id must be a string");
}

export function requiredIdOption() {
  return new Error('Missing "id" option');
}

export function repeatNotAllowed() {
  return new Error('"repeat" option is not compatible with the console timer');
}

export function extraArgsNotAllowed(id: string, args: mixed[]) {
  return new Error(
    [
      "Extra arguments are not acceptable with the console timer.",
      'Remove extra arguments or turn on the "format" option.',
      `Arguments: ${args.toString()}`,
      `Timer ID: ${id}`
    ].join("\n")
  );
}
