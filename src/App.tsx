import "inter-ui/inter.css";

import React from "react";
import { HashRouter } from "react-router-dom";

import { globalStyles } from "./globalStyles";
import { Routes } from "./routes";

export const App: React.FC = () => {
  return (
    <div className="App">
      {globalStyles}
      <HashRouter basename="/">
        <Routes />
      </HashRouter>
    </div>
  );
};
