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
import NextIcon from "../assets/next.png";
import EventOption from "../assets/eventoption.png";

const GamePlay = () => {
    const [board, setBoard] = useState(Array.from({ length: 80 }, () => 0));

    const [turn, setTurn] = useState(1);
    const [hp, setHP] = useState(10);
    const [money, setMoney] = useState(10);

    const [type, setType] = useState(0); // 0: event 1: units 2: buildings
    const [events, setEvents] = useState([0, 1, 2]);

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
                    <div className="infoDetail detail">턴 : {turn}</div>
                    <div className="infoDetail detail">체력 : {hp}</div>
                    <div className="infoDetail detail">돈 : {money}</div>
                </div>
                <div className="gamePlay">
                    {type === 0 ? (
                        <div className="events">
                            <div className="eventDetail detail">
                                {"<"}이벤트 발생문구{">"}
                            </div>
                            {events.map((event) => (
                                <button
                                    key={`eventbtn${event}`}
                                    type="button"
                                    className="eventButton btn"
                                    onClick={() => 0}
                                    style={{
                                        backgroundImage: `url(${EventOption})`,
                                    }}
                                >
                                    Event #01
                                </button>
                            ))}
                        </div>
                    ) : type === 1 ? (
                        <h1>1</h1>
                    ) : (
                        <h1>2</h1>
                    )}
                </div>
                <div className="select">
                    <button
                        type="button"
                        className="btn eventBtn"
                        onClick={() => setType(0)}
                    >
                        <img src={EventIcon} />
                    </button>
                    <button
                        type="button"
                        className="btn unitsBtn"
                        onClick={() => setType(1)}
                    >
                        <img src={UnitsIcon} />
                    </button>
                    <button
                        type="button"
                        className="btn buildingsBtn"
                        onClick={() => setType(2)}
                    >
                        <img src={BuildingsIcon} />
                    </button>
                    <button type="button" className="btn nextBtn">
                        <img src={NextIcon} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GamePlay;
