import { createContainer } from "unstated-next";

import type { SunnyPool } from "./useSunnyPools";
import { useSunnyPools } from "./useSunnyPools";

export interface UseArrow {
  pools: SunnyPool[];
}

const useArrowInternal = (): UseArrow => {
  const pools = useSunnyPools();

  return {
    pools,
  };
};

export const { useContainer: useArrow, Provider: ArrowProvider } =
  createContainer(useArrowInternal);
