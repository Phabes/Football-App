import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Clubs from "./components/Clubs/Clubs";
import Map2D from "./components/Map2D/Map2D";
import Matches from "./components/Matches/Matches";
import NavBar from "./components/NavBar/NavBar";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/matches/:matchIndex" element={<Map2D />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
