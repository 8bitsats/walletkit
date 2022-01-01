import { AnchorIndexView } from "./AnchorIndexView";
import { GokiIndexView } from "./GokiIndexView";
import { TribecaIndexView } from "./TribecaIndexView";

export const IndexView: React.FC = () => {
  return (
    <>
      {process.env.REACT_APP_APP_CONFIG === "anchor" ? (
        <AnchorIndexView />
      ) : process.env.REACT_APP_APP_CONFIG === "tribeca" ? (
        <TribecaIndexView />
      ) : (
        <GokiIndexView />
      )}
    </>
  );
};
