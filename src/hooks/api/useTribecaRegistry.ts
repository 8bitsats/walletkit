import type { Network } from "@saberhq/solana-contrib";
import { formatNetwork } from "@saberhq/solana-contrib";
import type { TokenInfo } from "@saberhq/token-utils";
import { useConnectionContext } from "@saberhq/use-solana";
import { useQuery } from "react-query";

import { fetcher } from "../../utils/fetcher";

export interface GovernorMeta {
  slug: string;
  name: string;
  address: string;
  network: Network;
  iconURL: string;
  govToken?: TokenInfo;
}

const REGISTRY_URL =
  "https://raw.githubusercontent.com/TribecaHQ/tribeca-registry-build/master/registry/governor-metas";

export const useTribecaRegistry = () => {
  const { network } = useConnectionContext();
  return useQuery<GovernorMeta[]>(["tribecaRegistry", network], async () => {
    return (await fetcher(
      `${REGISTRY_URL}.${formatNetwork(network)}.json`
    )) as GovernorMeta[];
  });
};
