// @flow

export function detectCorsAvail(): boolean {
  const validProto = [
    "http:",
    "data:",
    "chrome:",
    "chrome-extension:",
    "https:"
  ];
  return (
    typeof location !== "undefined" &&
    location !== "null" &&
    validProto.indexOf(location.protocol) !== -1
  );
}
