import React from "react";
import { HashRouter } from "react-router-dom";

import { MainLayout } from "./components/layout/MainLayout";
import { globalStyles } from "./globalStyles";
import { Routes } from "./routes";

export const App: React.FC = () => {
  return (
    <div className="App">
      {globalStyles}
      <HashRouter basename="/">
        <MainLayout>
          <Routes />
        </MainLayout>
      </HashRouter>
    </div>
  );
};
