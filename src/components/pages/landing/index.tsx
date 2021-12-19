import { GokiIndexView } from "./GokiIndexView";
import { TribecaIndexView } from "./TribecaIndexView";

export const IndexView: React.FC = () => {
  return <TribecaIndexView />;
  return (
    <>
      {process.env.REACT_APP_APP_CONFIG === "tribeca" ? (
        <TribecaIndexView />
      ) : (
        <GokiIndexView />
      )}
    </>
  );
};
