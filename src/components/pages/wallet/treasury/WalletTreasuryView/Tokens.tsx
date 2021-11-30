import { formatNetwork, PendingTransaction } from "@saberhq/solana-contrib";
import { SOL, TokenAmount } from "@saberhq/token-utils";
import { useSolana } from "@saberhq/use-solana";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { capitalize } from "lodash";
import { Link } from "react-router-dom";
import tw from "twin.macro";

import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { useTokenAccounts } from "../../../../../hooks/useTokenAccounts";
import { notify } from "../../../../../utils/notifications";
import { Button } from "../../../../common/Button";
import { TokenAmountDisplay } from "../../../../common/TokenAmountDisplay";
import { TokenIcon } from "../../../../common/TokenIcon";

export const Tokens: React.FC = () => {
  const { provider, network } = useSolana();
  const { key, smartWalletData } = useSmartWallet();

  const balance = smartWalletData
    ? new TokenAmount(SOL[network], smartWalletData.accountInfo.lamports)
    : smartWalletData;
  const balances = useTokenAccounts(key);

  const amounts = [
    ...(balance ? [balance] : []),
    ...(balances.data
      ?.map((b) => b?.balance)
      .filter((ta): ta is TokenAmount => !!ta) ?? []),
  ];

  return (
    <div tw="flex flex-col gap-4">
      <div tw="flex items-center gap-4">
        <Link to={`/wallets/${key.toString()}/treasury/deposit`}>
          <Button>Deposit</Button>
        </Link>
        {network !== "mainnet-beta" && (
          <Button
            onClick={async () => {
              const result = new PendingTransaction(
                provider.connection,
                await provider.connection.requestAirdrop(
                  key,
                  5 * LAMPORTS_PER_SOL
                )
              );
              notify({
                message: `Requesting ${capitalize(network)} SOL from faucet`,
                txid: result.signature,
              });
              await result.wait();
            }}
          >
            Request {capitalize(formatNetwork(network))} SOL
          </Button>
        )}
      </div>
      <div tw="text-sm">
        {amounts.map((amount, i) => (
          <div
            key={i}
            tw="flex items-center gap-4 py-2"
            css={[i !== 0 && tw`border-t`]}
          >
            <TokenIcon token={amount.token} />
            <div tw="w-[220px] font-semibold">{amount.token.name}</div>
            <div tw="flex-grow text-secondary">
              <TokenAmountDisplay amount={amount} />
            </div>
            <div>
              <Link
                to={`/wallets/${key.toString()}/treasury/send/${
                  amount.token.address
                }`}
              >
                <Button variant="primary" size="sm">
                  Send
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
