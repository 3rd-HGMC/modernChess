import React, { useState } from "react";

import { fromXY, range } from "../utils.js";

import "../styles/GamePlay.css";
import Panel from "../assets/panel.png";
import Black from "../assets/black.png";
import Red from "../assets/red.png";
import Blue from "../assets/blue.png";
import UnitsIcon from "../assets/units.png";
import EventIcon from "../assets/event.png";
import BuildingsIcon from "../assets/buildings.png";
import OppBuildingsIcon from "../assets/oppbuildings.png";
import BackIcon from "../assets/back.png";

const GamePlay = () => {
    const [board, setBoard] = useState(Array.from({ length: 80 }, () => 0));

    const [turn, setTurn] = useState(1);
    const [hp, setHP] = useState(10);
    const [money, setMoney] = useState(10);

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
            <div className="panel" style={{ backgroundImage: `url(${Panel})` }}>
                <div className="info">
                    <div className="infoDetail">턴 : {turn}</div>
                    <div className="infoDetail">체력 : {hp}</div>
                    <div className="infoDetail">돈 : {money}</div>
                </div>
                <div className="gamePlay"></div>
                <div className="select">
                    <button type="button" className="btn oppbuildingsBtn">
                        <img src={OppBuildingsIcon} />
                    </button>
                    <button type="button" className="btn eventBtn">
                        <img src={EventIcon} />
                    </button>
                    <button type="button" className="btn unitsBtn">
                        <img src={UnitsIcon} />
                    </button>
                    <button type="button" className="btn buildingsBtn">
                        <img src={BuildingsIcon} />
                    </button>
                    <button type="button" className="btn backBtn">
                        <img src={BackIcon} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GamePlay;
