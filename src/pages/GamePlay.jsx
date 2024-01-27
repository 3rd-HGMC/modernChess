import React, { useState } from "react";

import { fromXY, range } from "../utils.js";

import "../styles/GamePlay.css";
import Black from "../assets/black.png";
import Red from "../assets/red.png";
import Blue from "../assets/blue.png";

import EventOption from "../assets/eventoption.png";

import Panel from "../assets/panel.png";
import UnitDescription from "../assets/description.png";

import NoIcon from "../assets/btn_no.png";
import OkIcon from "../assets/btn_ok.png";
import UnitsIcon from "../assets/units.png";
import EventIcon from "../assets/event.png";
import BuildingsIcon from "../assets/buildings.png";
import NextIcon from "../assets/next.png";

import RedBomber from "../assets/unitImages/red/bomber.png";
import RedInfantry from "../assets/unitImages/red/infantry.png";
import RedScout from "../assets/unitImages/red/scout.png";
import RedSniper from "../assets/unitImages/red/sniper.png";
import RedTank from "../assets/unitImages/red/tank.png";

import BlueBomber from "../assets/unitImages/blue/bomber.png";
import BlueInfantry from "../assets/unitImages/blue/infantry.png";
import BlueScout from "../assets/unitImages/blue/scout.png";
import BlueSniper from "../assets/unitImages/blue/sniper.png";
import BlueTank from "../assets/unitImages/blue/tank.png";

const GamePlay = () => {
    const [board, setBoard] = useState(Array.from({ length: 80 }, () => 0));

    const [turn, setTurn] = useState(1);
    const [hp, setHP] = useState(10);
    const [money, setMoney] = useState(10);

    const [type, setType] = useState(0); // 0: event 1: units 2: buildings

    const [events, setEvents] = useState([0, 1, 2]);

    const [selectedUnit, setSelectedUnit] = useState(0); // 0: none 1: bomber 2: infantry 3: scout 4: sniper 5: tank

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
                                    className="eventButton btn bigBtn"
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
                        <div className="units">
                            <div className="buttons">
                                <button
                                    type="button"
                                    className="btn bigBtn unitBtn"
                                    onClick={() => setSelectedUnit(1)}
                                >
                                    <img src={RedBomber} />
                                </button>
                                <button
                                    type="button"
                                    className="btn bigBtn unitBtn"
                                    onClick={() => setSelectedUnit(2)}
                                >
                                    <img src={RedInfantry} />
                                </button>
                                <button
                                    type="button"
                                    className="btn bigBtn unitBtn"
                                    onClick={() => setSelectedUnit(3)}
                                >
                                    <img src={RedScout} />
                                </button>
                                <button
                                    type="button"
                                    className="btn bigBtn unitBtn"
                                    onClick={() => setSelectedUnit(4)}
                                >
                                    <img src={RedSniper} />
                                </button>
                                <button
                                    type="button"
                                    className="btn bigBtn unitBtn"
                                    onClick={() => setSelectedUnit(5)}
                                >
                                    <img src={RedTank} />
                                </button>
                            </div>
                            <div
                                className="unitDetailContainer"
                                style={{
                                    backgroundImage: `url(${UnitDescription})`,
                                }}
                            >
                                {selectedUnit !== 0 ? (
                                    <div>
                                        <div className="description">
                                            <h2>
                                                무민 : 멋진 기획과 아이콘을
                                                만듭니다
                                                <br />
                                                공격력: 100
                                                <br /> 방어력: 100
                                                <br />
                                                하지만 키키를 만나면 약해집니다
                                            </h2>
                                        </div>
                                        <div className="buyOption">
                                            <button
                                                type="button"
                                                className="btn smallBtn okBtn"
                                                onClick={() => {
                                                    setSelectedUnit(0);
                                                }}
                                            >
                                                <img src={OkIcon} />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn smallBtn okBtn"
                                                onClick={() =>
                                                    setSelectedUnit(0)
                                                }
                                            >
                                                <img src={NoIcon} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <h1>2</h1>
                    )}
                </div>
                <div className="select">
                    <button
                        type="button"
                        className="btn bigBtn eventBtn"
                        onClick={() => setType(0)}
                    >
                        <img src={EventIcon} />
                    </button>
                    <button
                        type="button"
                        className="btn bigBtn unitsBtn"
                        onClick={() => setType(1)}
                    >
                        <img src={UnitsIcon} />
                    </button>
                    <button
                        type="button"
                        className="btn bigBtn buildingsBtn"
                        onClick={() => setType(2)}
                    >
                        <img src={BuildingsIcon} />
                    </button>
                    <button type="button" className="btn bigBtn nextBtn">
                        <img src={NextIcon} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GamePlay;
