import React, { useState } from "react";

import { fromXY, range } from "../utils.js";

import "../styles/GamePlay.css";
import Panel from "../assets/panel.png";
import Black from "../assets/black.png";
import Red from "../assets/red.png";
import Blue from "../assets/blue.png";

const GamePlay = () => {
    const [board, setBoard] = useState(Array.from({ length: 80 }, () => 0));

    return (
        <div className="grid">
            <div className="boardContainer">
                <table className="board">
                    <tbody>
                        {range(10).map((x) => (
                            <tr key={`boardline${x}`} className="boardLine">
                                {range(8).map((y) => (
                                    <th
                                        key={`board${x}${y}`}
                                        className="boardBlank"
                                        style={{
                                            backgroundImage: `url(${
                                                x === 0
                                                    ? Blue
                                                    : x === 9
                                                    ? Red
                                                    : Black
                                            })`,
                                        }}
                                    ></th>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div
                className="panel"
                style={{ backgroundImage: `url(${Panel})` }}
            ></div>
        </div>
    );
};

export default GamePlay;
