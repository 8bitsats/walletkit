import { PendingTransaction } from "@saberhq/solana-contrib";
import { SOL, TOKEN_PROGRAM_ID, TokenAmount } from "@saberhq/token-utils";
import { useSolana } from "@saberhq/use-solana";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect } from "react";

import { useSmartWallet } from "../../../../hooks/useSmartWallet";
import { Button } from "../../../common/Button";
import { TokenAmountDisplay } from "../../../common/TokenAmountDisplay";
import { TokenIcon } from "../../../common/TokenIcon";

export const Tokens: React.FC = () => {
  const { provider, network } = useSolana();
  const { key, smartWalletData } = useSmartWallet();
  useEffect(() => {
    void (async () => {
      const accounts = await provider.connection.getTokenAccountsByOwner(key, {
        programId: TOKEN_PROGRAM_ID,
      });
    })();
  }, [key, provider.connection]);

  const balance = smartWalletData
    ? new TokenAmount(SOL[network], smartWalletData.accountInfo.lamports)
    : smartWalletData;

  const amounts = balance ? [balance] : [];

  return (
    <div>
      <Button
        onClick={async () => {
          const pt = new PendingTransaction(
            provider.connection,
            await provider.connection.requestAirdrop(key, 5 * LAMPORTS_PER_SOL)
          );
        }}
      >
        Deposit
      </Button>
      <div>
        {amounts.map((amount, i) => (
          <div key={i} tw="flex items-center gap-4">
            <TokenIcon token={amount.token} />
            <div tw="w-[220px]">{amount.token.name}</div>
            <div tw="flex-grow">
              <TokenAmountDisplay amount={amount} />
            </div>
            <div>
              <Button variant="primary" size="sm">
                Transfer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
