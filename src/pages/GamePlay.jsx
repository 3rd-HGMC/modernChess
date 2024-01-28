import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { fromXY, getXY, range, randomSelection, shuffle } from "../utils.js";

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

import BuildingData from "../data/building.json";
import EventData from "../data/event.json";
import UnitData from "../data/unit.json";
import Settings from "../data/settings.json";

const width = Settings.board.width,
    height = Settings.board.height,
    defaultHP = Settings.defaultHP,
    defaultMoney = Settings.defaultMoney,
    defaultUnits = Settings.defaultUnits,
    defaultEvents = Settings.defaultEvents,
    buildingWidth = Settings.buildingBoard.width,
    buildingHeight = Settings.buildingBoard.height,
    enemyTiming = Settings.enemyTiming,
    moneyByTurn = Settings.moneyByTurn;

const GamePlay = () => {
    const navigate = useNavigate();

    const [board, setBoard] = useState(
        Array.from({ length: width * height }, () => {
            return { team: "", type: "", power: 0 };
        })
    );

    const [turn, setTurn] = useState(1);
    const [hp, setHP] = useState(defaultHP);
    const [botHP, setBotHP] = useState(defaultHP);
    const [money, setMoney] = useState(defaultMoney);

    const [variable, setVariable] = useState({
        tankBuff: 0,
        bomberBuff: 0,
        schoolMoney: 0,
        labBuff: 0,
        labMoney: 0,
        nextTurnDiscount: 0,
    });

    const [type, setType] = useState(0); // 0: event 1: units 2: buildings

    const [eventDeck, setEventDeck] = useState([shuffle(defaultEvents), []]);
    const [eventResult, setEventResult] = useState("");

    const [buildingBoard, setBuildingBoard] = useState(
        Array.from({ length: buildingWidth * buildingHeight }, () => {
            return {
                type: "",
                point: {
                    default: 0,
                    military: 0,
                    economy: 0,
                },
            };
        })
    );
    const [saleBuildings, setSaleBuildings] = useState([]);

    const [turnStarted, setTurnStarted] = useState(true);

    const [selectedUnit, setSelectedUnit] = useState("none");
    const [selectedBuilding, setSelectedBuilding] = useState("none");

    const [currentUnits, setCurrentUnits] = useState(defaultUnits);

    const checkBuilding = (building) => {
        let res = false;
        for (let i = 0; i < buildingWidth * buildingHeight; i++) {
            res ||= buildingBoard[i].type === building;
        }
        return res;
    };

    const getPoint = (building) => {
        let res = 0;
        if (BuildingData[building.type].type === "military")
            res += building.point.military;
        if (BuildingData[building.type].type === "economy")
            res += building.point.economy;
        return (res = 0);
    };

    const getBuildingPoint = (building) => {
        let res = [0, 0];
        for (let i = 0; i < buildingWidth * buildingHeight; i++) {
            if (buildingBoard[i].type === building) {
                res[0]++;
                res[1] += getPoint(buildingBoard[i]);
            }
        }
        return res;
    };

    const startTurn = () => {
        if (turnStarted) return;
        setTurnStarted(true);

        setSaleBuildings(randomSelection(Object.keys(BuildingData), 4));

        if (!eventDeck[0].length) {
            setEventDeck([shuffle(eventDeck[1]), []]);
        }

        if (variable.tankBuff && !currentUnits.includes("tank"))
            setCurrentUnits([...currentUnits, "tank"]);
        if (variable.bomberBuff && !currentUnits.includes("bomber"))
            setCurrentUnits([...currentUnits, "bomber"]);

        let addmoney = moneyByTurn;

        Object.keys(BuildingData).forEach((x) => {
            if (BuildingData[x].type === "economy") {
                let k = getBuildingPoint(x);
                addmoney +=
                    k[0] * BuildingData[x].updateByTurn.money +
                    k[1] * BuildingData[x].updateByTurn.buff.money;
            }
        });

        let i = 0,
            bd,
            newbd,
            unitInfo,
            living,
            newBoard = [...board],
            gameResult = 0;

        const newUnits = enemyTiming[turn % enemyTiming.length];
        for (let x of randomSelection(range(width), newUnits.length)) {
            newBoard[fromXY(x, 0)] = {
                team: "blue",
                type: newUnits[i],
                power: UnitData[newUnits[i]].power,
            };
            console.log(newBoard[fromXY(x, 0)]);
            i++;
        }

        const move = (team, dir) => {
            for (
                let y = team === "red" ? 0 : height - 1;
                team === "red" ? y < height : y >= 0;
                team === "red" ? y++ : y--
            ) {
                for (let x = 0; x < width; x++) {
                    bd = newBoard[fromXY(x, y)];
                    living = true;

                    if (bd.type === "") continue;
                    if (bd.team !== team) continue;
                    unitInfo = UnitData[bd.type];

                    let moved = true;

                    if (unitInfo.range > 0) {
                        for (i = 1; i <= unitInfo.range; i++) {
                            if (y + dir * i === 0) break;

                            newbd = newBoard[fromXY(x, y + dir * i)];
                            if (newbd.type === "") continue;

                            if (newbd.power <= unitInfo.rangedAttack) {
                                newBoard[fromXY(x, y + dir * i)] = {
                                    team: "",
                                    type: "",
                                    power: 0,
                                };

                                if (team === "red") {
                                    for (let x of Object.keys(BuildingData)) {
                                        if (
                                            BuildingData[x].type === "military"
                                        ) {
                                            let k = getBuildingPoint(x);
                                            addmoney +=
                                                k[0] *
                                                    BuildingData[x].update
                                                        .killMoney +
                                                k[1] *
                                                    BuildingData[x].update.buff
                                                        .killMoney;
                                        }
                                    }
                                }
                            } else {
                                newBoard[fromXY(x, y + dir * i)].power -=
                                    unitInfo.rangedAttack;
                            }
                            moved = false;
                            break;
                        }
                    }

                    if (moved) {
                        newBoard[fromXY(x, y)] = {
                            team: "",
                            type: "",
                            power: 0,
                        };

                        for (i = 1; i <= unitInfo.speed; i++) {
                            if (team === "red") {
                                if (y + dir * i === 0) {
                                    if (botHP <= bd.power) gameResult = 1;
                                    setBotHP(botHP - bd.power);
                                    living = false;
                                    break;
                                }
                            } else {
                                if (y + dir * i === height - 1) {
                                    if (hp <= bd.power) gameResult = -1;
                                    setHP(hp - bd.power);
                                    living = false;
                                    break;
                                }
                            }

                            newbd = newBoard[fromXY(x, y + dir * i)];
                            if (newbd.type === "") continue;
                            else if (newbd.team === team) {
                                i--;
                                break;
                            } else {
                                if (newbd.power > bd.power) {
                                    living = false;
                                    newBoard[fromXY(x, y + dir * i)].power -=
                                        bd.power;
                                } else if (newbd.power === bd.power)
                                    living = false;
                                else {
                                    bd.power -= newbd.power;
                                    if (team === "red") {
                                        for (let x of Object.keys(
                                            BuildingData
                                        )) {
                                            if (
                                                BuildingData[x].type ===
                                                "military"
                                            ) {
                                                let k = getBuildingPoint(x);
                                                addmoney +=
                                                    k[0] *
                                                        BuildingData[x].update
                                                            .killMoney +
                                                    k[1] *
                                                        BuildingData[x].update
                                                            .buff.killMoney;
                                            }
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }

                    if (living) {
                        i = Math.min(unitInfo.speed, i);
                        newBoard[fromXY(x, y + dir * i)] = bd;
                    }
                }
            }
        };

        move("red", -1);
        move("blue", 1);
        console.log(
            newBoard[fromXY(0, 0)],
            newBoard[fromXY(1, 0)],
            newBoard[fromXY(2, 0)],
            newBoard[fromXY(3, 0)],
            newBoard[fromXY(4, 0)],
            newBoard
        );

        setBoard(newBoard);
        setMoney(money + addmoney);
        setTurn(turn + 1);

        if (gameResult !== 0) {
            alert(gameResult === 1 ? "승리했습니다" : "패배했습니다");
            navigate("../");
        }
    };

    const doEvent = (option) => {
        setEventResult(option.description);
        option = option.effect;
        if (option.money) setMoney(money + option.money);
        if (option.moneyByVariable)
            setMoney(money + variable[option.moneyByVariable]);
        if (option.refreshStore)
            setSaleBuildings(randomSelection(Object.keys(BuildingData), 4));
        if (option.randomBuilding) {
            let boardCopy = [...buildingBoard];
            let buildingList = [];
            for (let i = 0; i < buildingWidth * buildingHeight; i++) {
                if (buildingBoard[i].type !== "") buildingList.push(i);
            }

            if (option.randomBuilding.point && buildingList.length) {
                boardCopy[randomSelection(buildingList, 1)].point.default +=
                    option.randomBuilding.point;
            } else if (option.randomBuilding.delete) {
                randomSelection(
                    buildingList,
                    option.randomBuilding.delete
                ).forEach((x) => {
                    boardCopy[x].type = "";
                });
            }

            setBuildingBoard(boardCopy);
        }
        if (option.newBuilding) {
            let boardCopy = [...buildingBoard];
            let buildingList = [];
            for (let i = 0; i < buildingWidth * buildingHeight; i++) {
                if (buildingBoard[i].type === "") buildingList.push(i);
            }

            let i = 0;
            randomSelection(buildingList, option.newBuilding.length).forEach(
                (x) => {
                    boardCopy[x].type = option.newBuilding[i++];
                }
            );

            setBuildingBoard(boardCopy);
        }
        if (option.deleteSoldier) {
            let newBoard = [...board];
            let unitList = [];

            for (let i = 0; i < width * height; i++) {
                if (board[i].type !== "" && board[i].team === "red")
                    unitList.push(i);
            }

            randomSelection(unitList, option.deleteSoldier).forEach((x) => {
                newBoard[x] = {
                    team: "",
                    type: "",
                    power: 0,
                };
            });

            setBoard(newBoard);
        }
        if (option.variable) {
            let copyVariable = { ...variable };
            if (option.variable.labBuff) {
                for (let i = 0; i < buildingWidth * buildingHeight; i++) {
                    if (buildingBoard[i].type === "lab") {
                        let boardCopy = [...buildingBoard],
                            x = getXY(i, true);
                        BuildingData.lab.buffRange.forEach((k) => {
                            let i = k[0] + x[0],
                                j = k[1] + x[1];

                            if (
                                i < 0 ||
                                j < 0 ||
                                i >= buildingWidth ||
                                j >= buildingHeight
                            )
                                return;

                            boardCopy[fromXY(i, j, true)].point.default +=
                                option.variable.labBuff;
                        });
                    }
                }
            }
            Object.keys(option.variable).forEach((x) => {
                if (x === "nextTurnDiscount")
                    copyVariable[x] = option.variable[x];
                else copyVariable[x] += option.variable[x];
            });
            setVariable(copyVariable);
        }

        let unusedEventDeck = option.newCard
            ? [...eventDeck[0], ...option.newCard]
            : [...eventDeck[0]];
        let first = unusedEventDeck.shift();

        if (!option.deleteThisCard)
            setEventDeck([unusedEventDeck, eventDeck[1].concat(first)]);
        else {
            setEventDeck([unusedEventDeck, eventDeck[1]]);
        }

        setTurnStarted(false);
    };

    useEffect(() => {
        startTurn();
    }, []);

    useEffect(() => {
        // Test
    });

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
                                                    : y === height - 1
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
                    <div className="infoDetail detail">
                        {hp} | {botHP}
                    </div>
                    <div className="infoDetail detail">돈 : {money}</div>
                </div>
                <div className="gamePlay">
                    {type === 0 ? (
                        <div className="events">
                            {turnStarted ? (
                                <div>
                                    <div className="eventDetail detail">
                                        {`<${EventData[eventDeck[0][0]].name}>`}
                                    </div>
                                    {EventData[eventDeck[0][0]].options.map(
                                        (event) => (
                                            <button
                                                key={`eventbtn${event.name}`}
                                                type="button"
                                                className="eventButton btn bigBtn"
                                                onClick={() => doEvent(event)}
                                                style={{
                                                    backgroundImage: `url(${EventOption})`,
                                                }}
                                            >
                                                {event.name}
                                            </button>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="eventDetail detail">
                                    {eventResult}
                                </div>
                            )}
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
                                                    let left = width;
                                                    for (
                                                        let i = 0;
                                                        i < width;
                                                        i++
                                                    ) {
                                                        if (
                                                            board[
                                                                fromXY(
                                                                    i,
                                                                    height - 1
                                                                )
                                                            ].type !== ""
                                                        )
                                                            left--;
                                                    }
                                                    if (
                                                        money <
                                                        UnitData[selectedUnit]
                                                            .cost
                                                    )
                                                        alert(
                                                            "돈이 부족합니다"
                                                        );
                                                    else if (!left)
                                                        alert(
                                                            "남은 칸이 없습니다"
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
                                                                    height - 1
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
                                                                height - 1
                                                            )
                                                        ] = {
                                                            team: "red",
                                                            type: selectedUnit,
                                                            power:
                                                                UnitData[
                                                                    selectedUnit
                                                                ].power +
                                                                (selectedUnit ===
                                                                "tank"
                                                                    ? (variable.tankBuff -
                                                                          1) *
                                                                      2
                                                                    : selectedUnit ===
                                                                      "bomber"
                                                                    ? (variable.bomberBuff -
                                                                          1) *
                                                                      4
                                                                    : 0),
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
                                {saleBuildings.map((building) => (
                                    <button
                                        key={`building${building}`}
                                        type="button"
                                        className="btn smallBtn buildingBtn"
                                        onClick={() =>
                                            setSelectedBuilding(building)
                                        }
                                        style={{
                                            backgroundImage: `url(/modernChess/images/buildings/types/${BuildingData[building].type}.png)`,
                                        }}
                                    >
                                        <img
                                            src={`/modernChess/images/buildings/${building}.png`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <div className="buildBoardContainer">
                                <table className="buildingBoard board">
                                    <tbody>
                                        {range(buildingHeight).map((y) => (
                                            <tr
                                                key={`boardline${y}`}
                                                className="boardLine"
                                            >
                                                {range(buildingWidth).map(
                                                    (x) => (
                                                        <th
                                                            key={`board${x}${y}`}
                                                            className="boardBlank"
                                                            style={{
                                                                backgroundImage: `url(${
                                                                    buildingBoard[
                                                                        fromXY(
                                                                            x,
                                                                            y,
                                                                            true
                                                                        )
                                                                    ].type !==
                                                                    ""
                                                                        ? `/modernChess/images/buildings/${
                                                                              buildingBoard[
                                                                                  fromXY(
                                                                                      x,
                                                                                      y,
                                                                                      true
                                                                                  )
                                                                              ]
                                                                                  .type
                                                                          }.png`
                                                                        : Black
                                                                })`,
                                                            }}
                                                            onClick={() => {
                                                                const info =
                                                                    buildingBoard[
                                                                        fromXY(
                                                                            x,
                                                                            y,
                                                                            true
                                                                        )
                                                                    ];
                                                                if (
                                                                    info.type ===
                                                                    ""
                                                                )
                                                                    return;

                                                                if (
                                                                    !confirm(
                                                                        "정말로 이 건물을 제거하겠습니까?"
                                                                    )
                                                                )
                                                                    return;

                                                                if (
                                                                    money <
                                                                    BuildingData[
                                                                        info
                                                                            .type
                                                                    ].cost
                                                                )
                                                                    alert(
                                                                        "돈이 부족합니다"
                                                                    );
                                                                else {
                                                                    setMoney(
                                                                        money -
                                                                            BuildingData[
                                                                                info
                                                                                    .type
                                                                            ]
                                                                                .cost
                                                                    );

                                                                    let boardCopy =
                                                                        [
                                                                            ...buildingBoard,
                                                                        ];

                                                                    BuildingData[
                                                                        info
                                                                            .type
                                                                    ].buffRange.forEach(
                                                                        (k) => {
                                                                            let i =
                                                                                    k[0] +
                                                                                    x,
                                                                                j =
                                                                                    k[1] +
                                                                                    y;

                                                                            if (
                                                                                i <
                                                                                    0 ||
                                                                                j <
                                                                                    0 ||
                                                                                i >=
                                                                                    buildingWidth ||
                                                                                j >=
                                                                                    buildingHeight
                                                                            )
                                                                                return;

                                                                            if (
                                                                                BuildingData[
                                                                                    info
                                                                                        .type
                                                                                ]
                                                                                    .pointTarget ===
                                                                                "everything"
                                                                            )
                                                                                boardCopy[
                                                                                    fromXY(
                                                                                        i,
                                                                                        j,
                                                                                        true
                                                                                    )
                                                                                ].point.default -=
                                                                                    1 +
                                                                                    (info.type ===
                                                                                    "lab"
                                                                                        ? variable.labBuff
                                                                                        : 0);
                                                                            else
                                                                                boardCopy[
                                                                                    fromXY(
                                                                                        i,
                                                                                        j,
                                                                                        true
                                                                                    )
                                                                                ]
                                                                                    .point[
                                                                                    BuildingData[
                                                                                        info
                                                                                            .type
                                                                                    ]
                                                                                        .pointTarget
                                                                                ]--;
                                                                        }
                                                                    );
                                                                    boardCopy[
                                                                        fromXY(
                                                                            x,
                                                                            y,
                                                                            true
                                                                        )
                                                                    ].type = "";

                                                                    setBuildingBoard(
                                                                        boardCopy
                                                                    );

                                                                    if (
                                                                        !checkBuilding(
                                                                            info.type
                                                                        )
                                                                    ) {
                                                                        setEventDeck(
                                                                            [
                                                                                eventDeck[0].filter(
                                                                                    (
                                                                                        e
                                                                                    ) =>
                                                                                        !BuildingData[
                                                                                            info
                                                                                                .type
                                                                                        ].start.newCard.includes(
                                                                                            e
                                                                                        )
                                                                                ),
                                                                                eventDeck[1].filter(
                                                                                    (
                                                                                        e
                                                                                    ) =>
                                                                                        !BuildingData[
                                                                                            info
                                                                                                .type
                                                                                        ].start.newCard.includes(
                                                                                            e
                                                                                        )
                                                                                ),
                                                                            ]
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                        ></th>
                                                    )
                                                )}
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
                                {selectedBuilding !== "none" ? (
                                    <div>
                                        <div className="description">
                                            <h2>
                                                {`<${BuildingData[selectedBuilding].name}> ${BuildingData[selectedBuilding].cost}$ \n${BuildingData[selectedBuilding].description}`}
                                            </h2>
                                        </div>
                                        <div className="buyOption">
                                            <button
                                                type="button"
                                                className="btn smallBtn okBtn"
                                                onClick={() => {
                                                    let left = Array.from(
                                                            {
                                                                length: buildingHeight,
                                                            },
                                                            () => buildingWidth
                                                        ),
                                                        sumLeft =
                                                            buildingWidth *
                                                            buildingHeight;

                                                    for (
                                                        let i = 0;
                                                        i < buildingHeight;
                                                        i++
                                                    ) {
                                                        for (
                                                            let j = 0;
                                                            j < buildingWidth;
                                                            j++
                                                        ) {
                                                            if (
                                                                buildingBoard[
                                                                    fromXY(
                                                                        j,
                                                                        i,
                                                                        true
                                                                    )
                                                                ].type !== ""
                                                            ) {
                                                                sumLeft--;
                                                                left[i]--;
                                                            }
                                                        }
                                                    }

                                                    if (
                                                        money <
                                                        BuildingData[
                                                            selectedBuilding
                                                        ].cost -
                                                            variable.nextTurnDiscount
                                                    )
                                                        alert(
                                                            "돈이 부족합니다"
                                                        );
                                                    else if (!sumLeft)
                                                        alert(
                                                            "남은 칸이 없습니다"
                                                        );
                                                    else {
                                                        let Xselection,
                                                            Yselection;

                                                        do {
                                                            Yselection =
                                                                parseInt(
                                                                    prompt(
                                                                        `건물을 건설할 도시 열 (1 ~ ${buildingHeight})을 골라주세요`
                                                                    ),
                                                                    10
                                                                );
                                                        } while (
                                                            isNaN(Yselection) ||
                                                            Yselection >
                                                                buildingHeight ||
                                                            Yselection < 1 ||
                                                            !left[
                                                                Yselection - 1
                                                            ]
                                                        );

                                                        do {
                                                            Xselection =
                                                                parseInt(
                                                                    prompt(
                                                                        `건물을 건설할 도시 행 (1 ~ ${buildingWidth})을 골라주세요`
                                                                    ),
                                                                    10
                                                                );
                                                        } while (
                                                            isNaN(Xselection) ||
                                                            Xselection >
                                                                buildingWidth ||
                                                            Xselection < 1 ||
                                                            buildingBoard[
                                                                fromXY(
                                                                    Xselection -
                                                                        1,
                                                                    Yselection -
                                                                        1,
                                                                    true
                                                                )
                                                            ].type !== ""
                                                        );

                                                        setMoney(
                                                            money -
                                                                BuildingData[
                                                                    selectedBuilding
                                                                ].cost +
                                                                variable.nextTurnDiscount
                                                        );
                                                        setVariable({
                                                            ...variable,
                                                            nextTurnDiscount: 0,
                                                        });
                                                        if (
                                                            !checkBuilding(
                                                                selectedBuilding
                                                            )
                                                        ) {
                                                            setEventDeck([
                                                                eventDeck[0],
                                                                eventDeck[1].concat(
                                                                    BuildingData[
                                                                        selectedBuilding
                                                                    ].start
                                                                        .newCard
                                                                ),
                                                            ]);
                                                        }
                                                        let boardCopy = [
                                                            ...buildingBoard,
                                                        ];
                                                        boardCopy[
                                                            fromXY(
                                                                Xselection - 1,
                                                                Yselection - 1,
                                                                true
                                                            )
                                                        ].type =
                                                            selectedBuilding;
                                                        BuildingData[
                                                            selectedBuilding
                                                        ].buffRange.forEach(
                                                            (x) => {
                                                                let i =
                                                                        x[0] +
                                                                        Xselection -
                                                                        1,
                                                                    j =
                                                                        x[1] +
                                                                        Yselection -
                                                                        1;

                                                                if (
                                                                    i < 0 ||
                                                                    j < 0 ||
                                                                    i >=
                                                                        buildingWidth ||
                                                                    j >=
                                                                        buildingHeight
                                                                )
                                                                    return;

                                                                if (
                                                                    BuildingData[
                                                                        selectedBuilding
                                                                    ]
                                                                        .pointTarget ===
                                                                    "everything"
                                                                )
                                                                    boardCopy[
                                                                        fromXY(
                                                                            i,
                                                                            j,
                                                                            true
                                                                        )
                                                                    ].point.default +=
                                                                        1 +
                                                                        (selectedBuilding ===
                                                                        "lab"
                                                                            ? variable.labBuff
                                                                            : 0);
                                                                else
                                                                    boardCopy[
                                                                        fromXY(
                                                                            i,
                                                                            j,
                                                                            true
                                                                        )
                                                                    ].point[
                                                                        BuildingData[
                                                                            selectedBuilding
                                                                        ]
                                                                            .pointTarget
                                                                    ]++;
                                                            }
                                                        );
                                                        setBuildingBoard(
                                                            boardCopy
                                                        );
                                                    }
                                                    setSelectedBuilding("none");
                                                }}
                                            >
                                                <img src={OkIcon} />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn smallBtn okBtn"
                                                onClick={() =>
                                                    setSelectedBuilding("none")
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
                            startTurn();
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
