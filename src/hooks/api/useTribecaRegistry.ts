import { formatNetwork } from "@saberhq/solana-contrib";
import type { TokenInfo } from "@saberhq/token-utils";
import { useConnectionContext } from "@saberhq/use-solana";
import { useQuery } from "react-query";

import { fetcher } from "../../utils/fetcher";

export interface GovernorConfig {
  slug: string;
  name: string;
  description: string;
  address: string;
  govTokenMint: string;
  customLogoURI?: string;
  gauge?: {
    /**
     * The Gaugemeister, if gauges are enabled for this governor.
     */
    gaugemeister: string;
  };
  proposals?: {
    /**
     * If specified, this links to the forum for discussing proposals.
     */
    requiredDiscussionLink?: string | null;
  };
  links?: {
    forum?: string;
  };
}

export interface GovernorMeta extends GovernorConfig {
  govToken: TokenInfo;
  iconURL: string;
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
