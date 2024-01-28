import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/Help.css";
import XBtn from "../assets/tutorial/x.png";
import BackwardBtn from "../assets/tutorial/backward.png";
import BackwardDisabledBtn from "../assets/tutorial/backward_disabled.png";
import ForwardBtn from "../assets/tutorial/forward.png";
import ForwardDisabledBtn from "../assets/tutorial/forward_disabled.png";

const Help = () => {
    const [image, setImage] = useState(0);
    const maxTutorial = 25;

    return (
        <div className="helpContainer">
            <div className="interaction">
                <div className="image">
                    <img src={`/modernChess/images/tutorial/${image}.png`} />
                </div>
                <div className="bottom">
                    {
                        <button
                            type="button"
                            className={`backward btn ${
                                image > 0 ? "" : "disabled"
                            }`}
                            onClick={() =>
                                image > 0 ? setImage(image - 1) : 0
                            }
                        >
                            <img
                                src={
                                    image > 0
                                        ? BackwardBtn
                                        : BackwardDisabledBtn
                                }
                            />
                        </button>
                    }
                    <button
                        type="button"
                        className={`forward btn ${
                            image < maxTutorial ? "" : "disabled"
                        }`}
                        onClick={() =>
                            image < maxTutorial ? setImage(image + 1) : 0
                        }
                    >
                        <img
                            src={
                                image < maxTutorial
                                    ? ForwardBtn
                                    : ForwardDisabledBtn
                            }
                        />
                    </button>
                    <Link to="../">
                        <button type="button" className="btn">
                            <img src={XBtn} />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Help;
