// @flow

export function round(places: number, num: number): number {
  places = places >= 0 ? Math.min(places, 292) : Math.max(places, -292);
  if (places) {
    // Shift with exponential notation to avoid floating-point issues.
    // See [MDN](https://mdn.io/round#Examples) for more details.
    let pair = `${num}e`.split("e");
    const value = Math.round(Number(`${pair[0]}e${Number(pair[1]) + places}`));
    pair = `${value}e`.split("e");
    return Number(`${pair[0]}e${Number(pair[1]) - places}`);
  }
  return Math.round(num);
}
