import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Clubs from "./components/Clubs/Clubs";
import NavBar from "./components/NavBar/NavBar";

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/clubs" element={<Clubs />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
