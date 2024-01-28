import React, { useState } from "react";

import * as tutorialImages from '../assets/tutorial/images';
import * as tutorialButtons from '../assets/tutorial/buttons';

const Help = () => {

    const [image, setImage] = useState(0);

    goBackward = () => image > 0 ? setImage({image} - 1) : 0;

    return (
        <div className="text-center">
            <div className="top">
                <Link to="../">
                    <button type="button" className="btn back">
                        <img src = {tutorialButtons["x.png"]} />
                    </button>
                </Link>
                <h1>Tutorial</h1>
            </div>
            <div className="image">
                <img src = {tutorialImages[`${image}.png`]} />
            </div>
            <div className="bottom">
                <button
                    type="button"
                    className="backward"
                    onClick = {
                        () => ({image} > 0) ? setImage({image} - 1) : 0
                    }
                >
                    <img src = {tutorialButtons[`00.png`]} />
                </button>
                <button
                    type="button"
                    className="forward"
                    onClick = {
                        () => ({image} < Object.keys(tutorialButtons).length - 1) ? setImage({image} + 1) : 0
                    }
                >
                    <img src = {tutorialButtons[`10.png`]} />
                </button>
            </div>
        </div>
    );
};

export default Help;
