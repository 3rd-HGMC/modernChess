import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./pages/Main.jsx";
import GamePlay from "./pages/GamePlay.jsx";
import Help from "./pages/Help.jsx";

const App = () => (
    <div>
        <BrowserRouter basename="/modernChess">
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/play" element={<GamePlay />} />
                <Route path="/help" element={<Help />} />
            </Routes>
        </BrowserRouter>
    </div>
);

export default App;
