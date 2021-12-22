import { useToken } from "@quarryprotocol/react-quarry";
import { usePubkey } from "@saberhq/sail";
import { Token, TokenAmount } from "@saberhq/token-utils";
import { useSolana } from "@saberhq/use-solana";
import type { PublicKey } from "@solana/web3.js";
import { GovernorWrapper } from "@tribecahq/tribeca-sdk";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { createContainer } from "unstated-next";

import type { GovernorMeta } from "../../../../config/governors";
import { GOVERNORS } from "../../../../config/governors";
import { useSDK } from "../../../../contexts/sdk";
import { useWindowTitle } from "../../../../hooks/useWindowTitle";
import { useParsedGovernor, useParsedLocker } from "../../../../utils/parsers";
import { formatDurationSeconds } from "../locker/LockerIndexView/LockEscrowModal";

export const useGovernorInfo = (): {
  key: PublicKey;
  meta: GovernorMeta | null;
  slug: string;
} | null => {
  const { network } = useSolana();
  const { governor: governorStr } = useParams<{ governor: string }>();
  const governorStrAsKey = usePubkey(governorStr);
  const governorMeta = governorStrAsKey
    ? GOVERNORS.find(
        (gov) => gov.address.equals(governorStrAsKey) && gov.network === network
      )
    : GOVERNORS.find(
        (gov) => gov.slug === governorStr && gov.network === network
      );
  const key = governorMeta?.address ?? governorStrAsKey;
  if (!key) {
    return null;
  }
  const slug = governorMeta?.slug ?? key.toString();
  return {
    key,
    meta: governorMeta ?? null,
    slug,
  };
};

const useGovernorInner = () => {
  const info = useGovernorInfo();
  if (!info) {
    throw new Error(`governor not found`);
  }
  const { meta, key: governor, slug } = info;
  const path = `/gov/${slug}`;

  const { data: governorData } = useParsedGovernor(governor);
  const { data: lockerData } = useParsedLocker(
    governorData ? governorData.accountInfo.data.electorate : governorData
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

  const iconURL = meta?.iconURL ?? govToken?.icon;

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
    meta,
    daoName: meta?.name ?? govToken?.name.split(" ")[0],
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
    iconURL,
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
