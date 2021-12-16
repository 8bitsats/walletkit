import { useToken } from "@quarryprotocol/react-quarry";
import { useParsedAccountData, usePubkey } from "@saberhq/sail";
import { Token, TokenAmount } from "@saberhq/token-utils";
import type { KeyedAccountInfo } from "@solana/web3.js";
import { GovernorWrapper, TRIBECA_CODERS } from "@tribecahq/tribeca-sdk";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { createContainer } from "unstated-next";

import { useSDK } from "../../../../contexts/sdk";
import { useWindowTitle } from "../../../../hooks/useWindowTitle";
import { formatDurationSeconds } from "../locker/LockerIndexView/LockEscrowModal";

const parseGovernor = (data: KeyedAccountInfo) =>
  TRIBECA_CODERS.Govern.accountParsers.governor(data.accountInfo.data);

const parseLocker = (data: KeyedAccountInfo) =>
  TRIBECA_CODERS.LockedVoter.accountParsers.locker(data.accountInfo.data);

const useGovernorInner = () => {
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

  const smartWallet = governorData
    ? governorData.accountInfo.data.smartWallet
    : governorData;

  return {
    daoName: govToken?.name.split(" ")[0],
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
    smartWallet,
  };
};

export const useGovernorParams = () => {
  const { governorData, veToken } = useGovernor();
  const votesForQuorum =
    governorData && veToken
      ? new TokenAmount(
          veToken,
          governorData.accountInfo.data.params.quorumVotes
        )
      : null;
  const votingPeriodFmt = governorData
    ? formatDurationSeconds(
        governorData.accountInfo.data.params.votingPeriod.toNumber()
      )
    : null;
  return { votesForQuorum, votingPeriodFmt };
};

export const { useContainer: useGovernor, Provider: GovernorProvider } =
  createContainer(useGovernorInner);

export const useGovWindowTitle = (title: string) => {
  const { daoName } = useGovernor();
  useWindowTitle(daoName ? `${daoName} | ${title}` : "Loading...");
};
