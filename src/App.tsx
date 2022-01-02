import "inter-ui/inter.css";

import React from "react";
import toast, { resolveValue, Toaster } from "react-hot-toast";
import { VscClose } from "react-icons/vsc";
import { HashRouter } from "react-router-dom";

import { AnchorRouter } from "./components/pages/anchor/AnchorRouter";
import { CURRENT_APP } from "./config";
import { globalStyles } from "./globalStyles";
import { Routes } from "./routes";

export const App: React.FC = () => {
  return (
    <div tw="h-full w-full" className="App">
      {globalStyles}
      {CURRENT_APP === "anchor" ? (
        <AnchorRouter />
      ) : (
        <HashRouter basename="/">
          <Routes />
        </HashRouter>
      )}
      <Toaster position="bottom-right">
        {(t) => (
          <div
            tw="bg-white border p-4 w-full max-w-sm shadow rounded relative dark:(bg-gray-850 border-warmGray-600)"
            style={{
              opacity: t.visible ? 1 : 0,
            }}
          >
            <button
              tw="absolute right-3 top-3 text-secondary hover:text-gray-600"
              onClick={() => toast.dismiss(t.id)}
            >
              <VscClose />
            </button>
            {resolveValue(t.message, t)}
          </div>
        )}
      </Toaster>
    </div>
  );
};
