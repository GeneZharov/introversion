// @flow

// Access to the object's content by path.
export function prop(path: string[], obj: Object): mixed {
  const val = obj[path.shift()];
  if (path.length) {
    if (val === null || typeof val !== "object") {
      throw new Error("Not existing path: " + path.join("."));
    } else {
      return prop(path, val);
    }
  } else {
    return val;
  }
}
