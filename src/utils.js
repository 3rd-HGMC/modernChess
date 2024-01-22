export const getXY = (i) => [Math.floor(i / 10), i % 10];
export const fromXY = (x, y) => 10 * x + y;

export const range = (n) => [...Array(n).keys()];
