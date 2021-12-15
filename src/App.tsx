import "inter-ui/inter.css";

import React from "react";
import toast, { resolveValue, Toaster } from "react-hot-toast";
import { VscClose } from "react-icons/vsc";
import { HashRouter } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { globalStyles } from "./globalStyles";
import { Routes } from "./routes";

export const App: React.FC = () => {
  return (
    <AppWrapperInner tw="h-full w-full" className="App">
      {globalStyles}
      <HashRouter basename="/">
        <Routes />
      </HashRouter>
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
    </AppWrapperInner>
  );
};

const AppWrapperInner = styled.div`
  ${tw`font-sans bg-white text-DEFAULT dark:(bg-warmGray-800 text-gray-300)`};
`;
