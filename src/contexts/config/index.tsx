import type { Network } from "@saberhq/solana-contrib";
import { useMemo } from "react";
import { createContainer } from "unstated-next";

import type { IEnvironment } from "../../utils/environments";
import { environments as environmentsConfig } from "../../utils/environments";

type EnvironmentsMap = { [N in Network]: IEnvironment };

interface UseConfig {
  environments: EnvironmentsMap;
}

export interface Flags {
  /**
   * Whether or not to use the RPC1 mainnet nodes.
   */
  "use-rpc1-nodes": boolean;
}

export const DEFAULT_FLAGS: Flags = {
  "use-rpc1-nodes": false,
};

const useConfigInternal = (): UseConfig => {
  const environments: EnvironmentsMap = useMemo(() => {
    return {
      ...environmentsConfig,
    };
  }, []);

  return { environments };
};

export const { Provider: ConfigProvider, useContainer: useConfig } =
  createContainer(useConfigInternal);
