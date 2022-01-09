import { useParsedGaugemeister } from "../../../../../utils/parsers";
import { useGovernor } from "../../hooks/useGovernor";

export const useGaugemeister = () => {
  const { gauge } = useGovernor();
  return gauge ? gauge.gaugemeister : null;
};

export const useGMData = () => {
  const gm = useGaugemeister();
  return useParsedGaugemeister(gm);
};
