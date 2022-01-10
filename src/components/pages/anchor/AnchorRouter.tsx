import { useEffect } from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { IndexView } from "../landing";
import { AddressPage } from "./AddressPage";
import { InspectorPage } from "./InspectorPage";
import { TransactionInspectPage } from "./tx/InspectPage";

export const AnchorRouter: React.FC = () => {
  useEffect(() => {
    document.body.classList.add("dark");
    return () => {
      document.body.classList.remove("dark");
    };
  }, []);

  return (
    <BrowserRouter basename="/">
      <Route path="/address/:address" component={AddressPage} />
      <Route path="/tx/:txid/inspect" component={TransactionInspectPage} />
      <Route exact path="/tx/inspector" component={InspectorPage} />
      <Route exact path="/" component={IndexView} />
    </BrowserRouter>
  );
};
