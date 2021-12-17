import { findSubaccountInfoAddress, GOKI_CODERS } from "@gokiprotocol/client";
import { useParsedAccountData, useParsedAccountsData } from "@saberhq/sail";
import type { KeyedAccountInfo } from "@solana/web3.js";
import { useMemo } from "react";
import { useQuery } from "react-query";

import { useSDK } from "../../../../contexts/sdk";
import { useGovernor } from "./useGovernor";

const parseSmartWallet = (data: KeyedAccountInfo) =>
  GOKI_CODERS.SmartWallet.accountParsers.smartWallet(data.accountInfo.data);

export const parseGokiTransaction = (data: KeyedAccountInfo) =>
  GOKI_CODERS.SmartWallet.accountParsers.transaction(data.accountInfo.data);

const parseSubaccountInfo = (data: KeyedAccountInfo) =>
  GOKI_CODERS.SmartWallet.accountParsers.subaccountInfo(data.accountInfo.data);

export const useExecutiveCouncil = () => {
  const { smartWallet } = useGovernor();
  const { data: smartWalletData } = useParsedAccountData(
    smartWallet,
    parseSmartWallet
  );
  const { sdkMut } = useSDK();

  const { data: subaccountInfoKeys } = useQuery(
    ["subaccountInfos", smartWalletData?.accountId.toString()],
    async () => {
      return await Promise.all(
        smartWalletData?.accountInfo.data.owners.map(async (swOwner) => {
          const [sub] = await findSubaccountInfoAddress(swOwner);
          return sub;
        }) ?? []
      );
    },
    {
      enabled: !!smartWalletData,
    }
  );

  const subaccountInfo = useParsedAccountsData(
    useMemo(() => subaccountInfoKeys ?? [], [subaccountInfoKeys]),
    parseSubaccountInfo
  );

  const ecKey = useMemo(
    () =>
      subaccountInfo.find(
        (s) => s && "ownerInvoker" in s.accountInfo.data.subaccountType
      )?.accountInfo.data.smartWallet,
    [subaccountInfo]
  );
  const ecWallet = useParsedAccountData(ecKey, parseSmartWallet);

  const isMemberOfEC = !!(
    sdkMut &&
    ecWallet.data?.accountInfo.data.owners.find((o) =>
      o.equals(sdkMut.provider.wallet.publicKey)
    )
  );

  return { ecWallet, isMemberOfEC };
};
