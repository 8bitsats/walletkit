import { useEffect } from "react";

import { Alliance } from "./Alliance";
import { Jumbotron } from "./Jumbotron";

export const TribecaIndexView: React.FC = () => {
  useEffect(() => {
    document.body.classList.add("dark");
    return () => {
      document.body.classList.remove("dark");
    };
  }, []);

  return (
    <div tw="w-11/12 overflow-x-hidden">
      <div tw="min-h-screen">
        <Jumbotron />
      </div>
      <Alliance />
    </div>
  );
};
