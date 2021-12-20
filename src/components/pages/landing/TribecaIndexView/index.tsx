import { useEffect } from "react";

import { Jumbotron } from "./Jumbotron";

export const TribecaIndexView: React.FC = () => {
  useEffect(() => {
    document.body.classList.add("dark");
    return () => {
      document.body.classList.remove("dark");
    };
  }, []);

  return (
    <div tw="w-full overflow-x-hidden">
      <Jumbotron />
    </div>
  );
};
