import React from "react";
import { Link } from "react-router-dom";

import "../styles/Main.css";
import Icon from "../assets/icon.png";
import PlayIcon from "../assets/play.png";
import HelpIcon from "../assets/help.png";

const Main = () => (
    <div className="container">
        <div className="menu">
            <img className="icon" src={Icon} />
            <div className="menu">
                <Link to="/play">
                    <button type="button" className="btn playBtn">
                        <img src={PlayIcon} />
                    </button>
                </Link>
                <Link to="/help">
                    <button type="button" className="btn helpBtn">
                        <img src={HelpIcon} />
                    </button>
                </Link>
            </div>
        </div>
    </div>
);

export default Main;
