import {
  findOwnerInvokerAddress,
  findWalletDerivedAddress,
} from "@gokiprotocol/client";
import { useQuery } from "react-query";

import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { AddressLink } from "../../../../common/AddressLink";

export const SubaccountsSection: React.FC = () => {
  const { key } = useSmartWallet();

  const { data: subaccounts } = useQuery(
    ["smartWalletSubaccounts", key.toString()],
    async () => {
      const ownerInvokers = await Promise.all(
        Array(3)
          .fill(null)
          .map(async (_, i) => {
            const [address] = await findOwnerInvokerAddress(key, i);
            return {
              index: i,
              address,
            };
          })
      );
      const derived = await Promise.all(
        Array(3)
          .fill(null)
          .map(async (_, i) => {
            const [address] = await findWalletDerivedAddress(key, i);
            return {
              index: i,
              address,
            };
          })
      );
      return { ownerInvokers, derived };
    }
  );

  return (
    <div>
      <h2 tw="text-xl font-medium mb-1">Subaccounts</h2>

      <div tw="text-sm">
        {subaccounts?.ownerInvokers.map(({ index, address }) => {
          return (
            <div
              key={`owner_invoker_${index}`}
              tw="h-11 flex items-center justify-between border-b px-2"
            >
              <div>
                <code>owner_invoker/{index}</code>
              </div>
              <AddressLink address={address} showCopy />
            </div>
          );
        })}
      </div>
      <div tw="text-sm">
        {subaccounts?.derived.map(({ index, address }) => {
          return (
            <div
              key={`derived_${index}`}
              tw="h-11 flex items-center justify-between border-b px-2"
            >
              <div>
                <code>derived/{index}</code>
              </div>
              <AddressLink address={address} showCopy />
            </div>
          );
        })}
      </div>
    </div>
  );
};
