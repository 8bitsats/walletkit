import type { Network } from "@saberhq/solana-contrib";
import type { TokenInfo } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";

export interface GovernorMeta {
  slug: string;
  name: string;
  address: PublicKey;
  network: Network;
  iconURL: string;
  govToken?: TokenInfo;
}

export const GOVERNORS: readonly GovernorMeta[] = [
  {
    slug: "cow",
    name: "Cash Cow DAO",
    address: new PublicKey("EnWtE8QEWYGkbVknjodYmnZPFt7Fpk9U9cBRpXY5e1Gh"),
    network: "mainnet-beta",
    iconURL:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/CowKesoLUaHSbAMaUxJUj7eodHHsaLsS65cy8NFyRDGP/icon.png",
    govToken: {
      chainId: 101,
      address: "CowKesoLUaHSbAMaUxJUj7eodHHsaLsS65cy8NFyRDGP",
      symbol: "COW",
      name: "Cash Cow",
      decimals: 6,
      logoURI:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/CowKesoLUaHSbAMaUxJUj7eodHHsaLsS65cy8NFyRDGP/icon.png",
      tags: ["governance-token"],
      extensions: {
        website: "https://cashio.app",
        twitter: "https://twitter.com/CashioApp",
        discord: "https://discord.com/invite/GmkRRKJkuh",
        medium: "https://medium.com/@cashioapp",
      },
    },
  },
];

export const getGovTokensForNetwork = (network: Network): TokenInfo[] => {
  return GOVERNORS.filter((gov) => gov.network === network)
    .map((gov) => gov.govToken)
    .filter((tok): tok is TokenInfo => !!tok);
};
