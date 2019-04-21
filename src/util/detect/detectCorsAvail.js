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
    validProto.indexOf(location.protocol) !== -1
  );
}
