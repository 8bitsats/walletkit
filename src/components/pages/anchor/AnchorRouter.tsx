import { useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { IndexView } from "../landing";
import { InspectorPage } from "./InspectorPage";

export const AnchorRouter: React.FC = () => {
  useEffect(() => {
    document.body.classList.add("dark");
    return () => {
      document.body.classList.remove("dark");
    };
  }, []);

  return (
    <BrowserRouter basename="/">
      <Route exact path="/tx/inspector" component={InspectorPage} />
      <Route exact path="/" component={IndexView} />
    </BrowserRouter>
  );
};
