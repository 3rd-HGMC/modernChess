import React, { useState, useEffect } from "react";

import { fromXY, range } from "../utils.js";

import "../styles/GamePlay.css";
import Black from "../assets/black.png";
import Red from "../assets/red.png";
import Blue from "../assets/blue.png";

import EventOption from "../assets/eventoption.png";

import Panel from "../assets/panel.png";
import Description from "../assets/description.png";

import NoIcon from "../assets/btn_no.png";
import OkIcon from "../assets/btn_ok.png";
import UnitsIcon from "../assets/units.png";
import EventIcon from "../assets/event.png";
import BuildingsIcon from "../assets/buildings.png";
import NextIcon from "../assets/next.png";
import DisabledNextIcon from "../assets/disabled_next.png";

import BuildingType1 from "../assets/building_type_1.png";
import BuildingType2 from "../assets/building_type_2.png";
import BuildingType3 from "../assets/building_type_3.png";
import BuildingType4 from "../assets/building_type_4.png";

import BuildingData from "../data/building.json";
import EnemyTimingData from "../data/enemyTiming.json";
import StartEventData from "../data/startEvent.json";
import EventData from "../data/event.json";
import UnitData from "../data/unit.json";
import Settings from "../data/settings.json";

const width = Settings.board.width,
    height = Settings.board.height,
    defaultHP = Settings.defaultHP,
    defaultMoney = Settings.defaultMoney,
    defaultUnits = Settings.defaultUnits;

const GamePlay = () => {
    const [board, setBoard] = useState(
        Array.from({ length: width * height }, () => {
            return { team: "", type: "", power: 0 };
        })
    );

    const [turn, setTurn] = useState(0);
    const [hp, setHP] = useState(defaultHP);
    const [botHP, setBotHP] = useState(defaultHP);
    const [money, setMoney] = useState(defaultMoney);

    const [type, setType] = useState(0); // 0: event 1: units 2: buildings

    const [events, setEvents] = useState([0, 1, 2]);
    const [buildings, setBuildings] = useState([1, 2, 3, 4]);

    const [turnStarted, setTurnStarted] = useState(true);

    const [selectedUnit, setSelectedUnit] = useState("none");
    const [selectedBuilding, setSelectedBuilding] = useState(0); // 0: none 나머지는 순서대로

    const [currentUnits, setCurrentUnits] = useState(defaultUnits);

    const [gameResult, setGameResult] = useState(0); // 1: win 0: 진행중 -1: lose

    const startTurn = () => {
        setTurnStarted(true);
        setTurn(turn + 1);

        let i, bd, newbd, unitInfo, living, newBoard;
        newBoard = [...board];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                bd = newBoard[fromXY(x, y)];
                living = true;

                if (bd.type === "") continue;
                if (bd.team === "blue") continue;
                unitInfo = UnitData[bd.type];

                if (unitInfo.range > 0) {
                    for (i = 1; i <= unitInfo.range; i++) {
                        if (y - i === 0) break;

                        newbd = newBoard[fromXY(x, y - i)];
                        if (newbd.type === "") continue;

                        if (newbd.power <= unitInfo.rangedAttack) {
                            newBoard[fromXY(x, y - i)] = {
                                team: "",
                                type: "",
                                power: 0,
                            };
                        } else {
                            newBoard[fromXY(x, y - i)].power -=
                                unitInfo.rangedAttack;
                        }
                        break;
                    }
                } else {
                    newBoard[fromXY(x, y)] = {
                        team: "",
                        type: "",
                        power: 0,
                    };

                    for (i = 1; i <= unitInfo.speed; i++) {
                        if (y - i === 0) {
                            setBotHP(botHP - bd.power);
                            if (botHP <= bd.power) setGameResult(1);
                            living = false;
                            break;
                        }

                        newbd = newBoard[fromXY(x, y - i)];
                        if (newbd.type === "") continue;
                        else if (newbd.team === "red") {
                            i--;
                            break;
                        } else {
                            if (newbd.power > bd.power) {
                                living = false;
                                newBoard[fromXY(x, y - i)].power -= bd.power;
                            } else if (newbd.power === bd.power) living = false;
                            else bd.power -= newbd.power;
                            break;
                        }
                    }
                }

                if (living) {
                    i = Math.min(unitInfo.speed, i);
                    newBoard[fromXY(x, y - i)] = bd;
                }
            }
        }
        setBoard(newBoard);

        if (gameResult === 1) alert("승리했습니다");
    };

    const enemyTurn = () => {
        if (turnStarted) return;
        if (gameResult === -1) alert("패배했습니다");
        startTurn();
    };

    const doEvent = (option) => {
        setTurnStarted(false);
    };

    useEffect(() => {
        startTurn();
    }, []);

    return (
        <div className="grid">
            <div className="boardContainer">
                <table className="board">
                    <tbody>
                        {range(height).map((y) => (
                            <tr key={`boardline${y}`} className="boardLine">
                                {range(width).map((x) => (
                                    <th
                                        key={`board${x}${y}`}
                                        className="boardBlank"
                                        style={{
                                            backgroundImage: `url(${
                                                board[fromXY(x, y)].type !== ""
                                                    ? `/modernChess/images/units/${
                                                          board[fromXY(x, y)]
                                                              .team
                                                      }/${
                                                          board[fromXY(x, y)]
                                                              .type
                                                      }.png`
                                                    : y === 0
                                                    ? Blue
                                                    : y === 9
                                                    ? Red
                                                    : Black
                                            })`,
                                        }}
                                        onClick={() => {
                                            const info = board[fromXY(x, y)];
                                            if (info.type === "") return;
                                            alert(
                                                `<${
                                                    UnitData[info.type].name
                                                }> 남은 전투력 : ${info.power}`
                                            );
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
                            {range(3).map((event) => (
                                <button
                                    key={`eventbtn${event}`}
                                    type="button"
                                    className="eventButton btn bigBtn"
                                    onClick={() => doEvent(event)}
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
                                {currentUnits.map((unit) => (
                                    <button
                                        key={`unit${unit}`}
                                        type="button"
                                        className="btn bigBtn unitBtn"
                                        onClick={() => setSelectedUnit(unit)}
                                    >
                                        <img
                                            src={`/modernChess/images/units/red/${unit}.png`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <div
                                className="unitDetailContainer"
                                style={{
                                    backgroundImage: `url(${Description})`,
                                }}
                            >
                                {selectedUnit !== "none" ? (
                                    <div>
                                        <div className="description">
                                            <h2>
                                                {`<${
                                                    UnitData[selectedUnit].name
                                                }> ${
                                                    UnitData[selectedUnit].cost
                                                }$ ${
                                                    UnitData[selectedUnit].range
                                                        ? `원거리 유닛`
                                                        : "근거리 유닛"
                                                }\n전투력 : ${
                                                    UnitData[selectedUnit].power
                                                } / 스피드 : ${
                                                    UnitData[selectedUnit].speed
                                                }${
                                                    UnitData[selectedUnit].range
                                                        ? `\n원거리 전투력 : ${UnitData[selectedUnit].rangedAttack}\n사거리 : ${UnitData[selectedUnit].range}`
                                                        : ""
                                                }`}
                                            </h2>
                                        </div>
                                        <div className="buyOption">
                                            <button
                                                type="button"
                                                className="btn smallBtn okBtn"
                                                onClick={() => {
                                                    if (
                                                        money <
                                                        UnitData[selectedUnit]
                                                            .cost
                                                    )
                                                        alert(
                                                            "돈이 부족합니다"
                                                        );
                                                    else {
                                                        let selection;
                                                        do {
                                                            selection =
                                                                parseInt(
                                                                    prompt(
                                                                        `유닛을 배치할 나의 진영 칸 (1 ~ ${width})을 입력해주세요`
                                                                    ),
                                                                    10
                                                                );
                                                        } while (
                                                            isNaN(selection) ||
                                                            selection > width ||
                                                            selection < 1 ||
                                                            board[
                                                                fromXY(
                                                                    selection -
                                                                        1,
                                                                    9
                                                                )
                                                            ].type !== ""
                                                        );

                                                        setMoney(
                                                            money -
                                                                UnitData[
                                                                    selectedUnit
                                                                ].cost
                                                        );

                                                        let boardCopy = [
                                                            ...board,
                                                        ];
                                                        boardCopy[
                                                            fromXY(
                                                                selection - 1,
                                                                9
                                                            )
                                                        ] = {
                                                            team: "red",
                                                            type: selectedUnit,
                                                            power: UnitData[
                                                                selectedUnit
                                                            ].power,
                                                        };
                                                        setBoard(boardCopy);
                                                    }
                                                    setSelectedUnit("none");
                                                }}
                                            >
                                                <img src={OkIcon} />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn smallBtn okBtn"
                                                onClick={() =>
                                                    setSelectedUnit("none")
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
                        <div className="buildings">
                            <div className="buildingButtons">
                                {buildings.map((building) => (
                                    <button
                                        key={`building${building}`}
                                        type="button"
                                        className="btn smallBtn buildingBtn"
                                        onClick={() =>
                                            setSelectedBuilding(building)
                                        }
                                        style={{
                                            backgroundImage: BuildingType1,
                                        }}
                                    >
                                        <img
                                            src={`url(/modernChess/images/buildings/bank.png)`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <div className="buildBoardContainer">
                                <table className="buildingBoard board">
                                    <tbody>
                                        {range(2).map((x) => (
                                            <tr
                                                key={`boardline${x}`}
                                                className="boardLine"
                                            >
                                                {range(6).map((y) => (
                                                    <th
                                                        key={`board${x}${y}`}
                                                        className="boardBlank"
                                                        style={{
                                                            backgroundImage: `url(${Black})`,
                                                        }}
                                                    ></th>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div
                                className="buildingDetailContainer"
                                style={{
                                    backgroundImage: `url(${Description})`,
                                }}
                            >
                                {selectedBuilding !== 0 ? (
                                    <div>
                                        <div className="description">
                                            <h2>
                                                무민 : 멋진 기획과 아이콘을
                                                만듭니다
                                                <br />
                                                공격력: 100
                                                <br /> 방어력: 100
                                                <br />
                                                키키를 만나면 강해집니다
                                            </h2>
                                        </div>
                                        <div className="buyOption">
                                            <button
                                                type="button"
                                                className="btn smallBtn okBtn"
                                                onClick={() => {
                                                    setSelectedBuilding(0);
                                                }}
                                            >
                                                <img src={OkIcon} />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn smallBtn okBtn"
                                                onClick={() =>
                                                    setSelectedBuilding(0)
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
                    <button
                        type="button"
                        className="btn bigBtn nextBtn"
                        onClick={() => {
                            if (turnStarted)
                                alert("이벤트를 먼저 선택해주세요!");
                            enemyTurn();
                        }}
                    >
                        <img src={turnStarted ? DisabledNextIcon : NextIcon} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GamePlay;
