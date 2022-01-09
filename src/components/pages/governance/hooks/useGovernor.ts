import { useToken } from "@quarryprotocol/react-quarry";
import { useAccountData, usePubkey } from "@saberhq/sail";
import { Token, TokenAmount } from "@saberhq/token-utils";
import { PublicKey } from "@solana/web3.js";
import { GovernorWrapper } from "@tribecahq/tribeca-sdk";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { createContainer } from "unstated-next";

import { useSDK } from "../../../../contexts/sdk";
import type { GovernorMeta } from "../../../../hooks/api/useTribecaRegistry";
import { useTribecaRegistry } from "../../../../hooks/api/useTribecaRegistry";
import { useWindowTitle } from "../../../../hooks/useWindowTitle";
import { useParsedGovernor, useParsedLocker } from "../../../../utils/parsers";
import { formatDurationSeconds } from "../locker/LockerIndexView/LockEscrowModal";

export interface GaugeSettings {
  gaugemeister: PublicKey;
}

type GovernorInfo = (
  | {
      key: PublicKey;
      meta: GovernorMeta | null;
      slug: string;
      loading: boolean;
    }
  | {
      key: PublicKey | null;
      meta: GovernorMeta | null;
      slug: string;
      loading: true;
    }
) & {
  gauge: GaugeSettings | null;
};

export const useGovernorInfo = (): GovernorInfo | null => {
  const { governor: governorStr } = useParams<{ governor: string }>();
  const { data: governorMetas, isLoading, isFetched } = useTribecaRegistry();

  const governorMeta = useMemo(
    () =>
      governorMetas?.find(
        (gov) => gov.address === governorStr || gov.slug === governorStr
      ) ?? null,
    [governorMetas, governorStr]
  );
  const slug = governorMeta?.slug ?? governorStr;

  const key = usePubkey(governorMeta?.address ?? governorStr);

  // const gaugemeister = usePubkey(governorMeta?.gauge?.gaugemeister);
  const gaugemeister = new PublicKey(
    "ERufcsQwu7e67uTtuaNyJmy14Gfn2kPSfFvdjy3g94uo"
  );

  const loading = isLoading || !isFetched;
  if (loading && !key) {
    return {
      key: null,
      meta: governorMeta,
      slug,
      loading: true,
      gauge: null,
    };
  }

  // If there is no key and we aren't loading, the governor doesn't exist.
  if (!key) {
    return null;
  }

  return {
    key,
    meta: governorMeta,
    slug,
    loading,
    gauge: gaugemeister ? { gaugemeister } : null,
  };
};

const useGovernorInner = () => {
  const info = useGovernorInfo();
  if (!info) {
    throw new Error(`governor not found`);
  }
  const { meta, key: governor, slug, gauge } = info;
  if (!governor) {
    throw new Error("Governor not loaded.");
  }
  const path = `/gov/${slug}`;

  const { data: govDataRaw } = useAccountData(governor);
  const { data: parsedGovernorData } = useParsedGovernor(governor);

  const governorData =
    govDataRaw === undefined ? undefined : parsedGovernorData;
  const { data: lockerData } = useParsedLocker(
    governorData ? governorData.accountInfo.data.electorate : governorData
  );
  const backupGovToken = useToken(
    lockerData ? lockerData.accountInfo.data.tokenMint : lockerData
  );

  const govToken = meta?.govToken ? new Token(meta.govToken) : backupGovToken;
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
    gauge,
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
