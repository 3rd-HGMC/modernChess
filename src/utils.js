import Settings from "./data/settings.json";

export const getXY = (i, buildings = false) => [
    i % Settings.board.width,
    Math.floor(
        i / (buildings ? Settings.buildingBoard.width : Settings.board.width)
    ),
];
export const fromXY = (x, y, buildings = false) =>
    y * (buildings ? Settings.buildingBoard.width : Settings.board.width) + x;

export const range = (n) => [...Array(n).keys()];

export const randomSelection = (arr, n) => {
    let res = [];
    for (let i = 0; i < n; i++) {
        let nw = arr[Math.floor(Math.random() * arr.length)];
        while (res.includes(nw)) {
            nw = arr[Math.floor(Math.random() * arr.length)];
        }
        res.push(nw);
    }
    return res;
};
