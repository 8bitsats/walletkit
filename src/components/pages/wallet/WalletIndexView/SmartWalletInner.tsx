import type { PublicKey } from "@solana/web3.js";

import { useSmartWallet } from "../../../../hooks/useSmartWallet";

interface Props {
  walletKey: PublicKey;
}

export const SmartWalletInner: React.FC<Props> = ({ walletKey }: Props) => {
  const { smartWallet } = useSmartWallet(walletKey);

  return (
    <div>{smartWallet?.data?.owners.map((o) => o.toString()).join(",")}</div>
  );
};
