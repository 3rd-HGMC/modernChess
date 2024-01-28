import Settings from "./data/settings.json";

export const getXY = (i) => [
    i % Settings.board.width,
    Math.floor(i / Settings.board.width),
];
export const fromXY = (x, y) => y * Settings.board.width + x;

export const range = (n) => [...Array(n).keys()];
