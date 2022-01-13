import { tryGetName } from "@cardinal/namespaces";
import { useConnectionContext } from "@saberhq/use-solana";
import type { PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";

export const useWalletName = (
  address: PublicKey | undefined
): string | undefined => {
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const connectionContext = useConnectionContext();

  void useMemo(async () => {
    try {
      address &&
        setDisplayName(await tryGetName(connectionContext.connection, address));
    } catch (e) {
      console.log(e);
    }
  }, [connectionContext, address]);

  return displayName;
};
