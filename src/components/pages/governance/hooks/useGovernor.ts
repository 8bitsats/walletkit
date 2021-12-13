import { useToken } from "@quarryprotocol/react-quarry";
import { useParsedAccountData, usePubkey } from "@saberhq/sail";
import { Token, TokenAmount } from "@saberhq/token-utils";
import type { KeyedAccountInfo } from "@solana/web3.js";
import { GovernorWrapper, TRIBECA_CODERS } from "@tribecahq/tribeca-sdk";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { useSDK } from "../../../../contexts/sdk";

const parseGovernor = (data: KeyedAccountInfo) =>
  TRIBECA_CODERS.Govern.accountParsers.governor(data.accountInfo.data);

const parseLocker = (data: KeyedAccountInfo) =>
  TRIBECA_CODERS.LockedVoter.accountParsers.locker(data.accountInfo.data);

export const useGovernor = () => {
  const { governor: governorStr } = useParams<{ governor: string }>();
  const governor = usePubkey(governorStr);
  if (!governor) {
    throw new Error(`unknown governor`);
  }

  const path = `/gov/${governorStr}`;

  const { data: governorData } = useParsedAccountData(governor, parseGovernor);
  const { data: lockerData } = useParsedAccountData(
    governorData ? governorData.accountInfo.data.electorate : governorData,
    parseLocker
  );
  const govToken = useToken(
    lockerData ? lockerData.accountInfo.data.tokenMint : lockerData
  );
  const veToken = govToken
    ? new Token({
        ...govToken.info,
        name: `Voting Escrow ${govToken.name}`,
        symbol: `ve${govToken.symbol}`,
      })
    : govToken;

  const minActivationThreshold =
    veToken && lockerData
      ? new TokenAmount(
          veToken,
          lockerData.accountInfo.data.params.proposalActivationMinVotes
        )
      : null;

  const lockedSupply =
    govToken && lockerData
      ? new TokenAmount(govToken, lockerData.accountInfo.data.lockedSupply)
      : govToken === undefined && lockerData === undefined
      ? undefined
      : null;

  const proposalCount = governorData
    ? governorData.accountInfo.data.proposalCount.toNumber()
    : governorData;

  const { tribecaMut } = useSDK();
  const governorW = useMemo(
    () => (tribecaMut ? new GovernorWrapper(tribecaMut, governor) : null),
    [governor, tribecaMut]
  );

  return {
    daoName: govToken?.name.split(" ")[0] ?? "the Protocol",
    path,
    governor,
    governorW,
    governorData,
    lockerData,
    govToken,
    veToken,
    minActivationThreshold,
    lockedSupply,
    proposalCount,
  };
};
