import type { ParsedAccountInfo } from "@saberhq/sail";
import { getCacheKeyOfPublicKey } from "@saberhq/sail";
import { u64 } from "@saberhq/token-utils";
import { useSolana } from "@saberhq/use-solana";
import type { PublicKey } from "@solana/web3.js";
import type { ProposalData, ProposalMetaData } from "@tribecahq/tribeca-sdk";
import {
  findProposalAddress,
  findProposalMetaAddress,
  getProposalState,
  ProposalState,
} from "@tribecahq/tribeca-sdk";
import { useEffect, useMemo } from "react";
import { useQueries, useQuery } from "react-query";
import invariant from "tiny-invariant";

import {
  useParsedProposal,
  useParsedProposalMeta,
  useParsedProposalMetas,
  useParsedProposals,
} from "../../../../utils/parsers";
import { useGovernor } from "./useGovernor";

export interface ProposalInfo {
  proposalKey: PublicKey;
  index: number;
  proposalData: ProposalData;
  proposalMetaData: ProposalMetaData | null;
  state: ProposalState;
}

const buildProposalInfo = ({
  index,
  proposalData,
  proposalMetaData,
}: {
  index: number;
  proposalData: ParsedAccountInfo<ProposalData>;
  proposalMetaData: ProposalMetaData | null;
}): ProposalInfo => {
  const state = getProposalState({
    proposalData: proposalData.accountInfo.data,
  });
  return {
    proposalKey: proposalData.accountId,
    index,
    proposalData: proposalData.accountInfo.data,
    proposalMetaData: proposalMetaData,
    state,
  };
};

/**
 * Fetches the data associated with a specific proposal.
 */
export const useProposal = (index: number) => {
  const { network } = useSolana();
  const { governor } = useGovernor();
  const id = `000${index}`.slice(-4);

  const proposalKeys = useQuery(
    ["proposalKeys", network, governor.toString(), index],
    async () => {
      const [proposalKey] = await findProposalAddress(governor, new u64(index));
      const [proposalMetaKey] = await findProposalMetaAddress(proposalKey);
      return { proposalKey, proposalMetaKey };
    }
  );

  const { data: proposalData } = useParsedProposal(
    proposalKeys.data?.proposalKey
  );
  const { data: proposalMetaData } = useParsedProposalMeta(
    proposalKeys.data?.proposalMetaKey
  );

  const isLoading = !proposalData || proposalMetaData === undefined;
  const proposalInfoQuery = useQuery({
    queryKey: ["proposalInfo", network, governor.toString(), index],
    queryFn: (): ProposalInfo => {
      invariant(proposalData);
      return buildProposalInfo({
        index: proposalData.accountInfo.data.index.toNumber(),
        proposalData,
        proposalMetaData: proposalMetaData
          ? proposalMetaData.accountInfo.data
          : null,
      });
    },
    enabled: !isLoading,
  });

  const { refetch } = proposalInfoQuery;
  const info = isLoading ? null : proposalInfoQuery.data ?? null;
  const state = proposalData
    ? getProposalState({
        proposalData: proposalData.accountInfo.data,
      })
    : null;

  useEffect(() => {
    void refetch();
  }, [proposalData, refetch, proposalMetaData, state]);

  useEffect(() => {
    if (!proposalData) {
      return;
    }
    if (state === ProposalState.Active) {
      const timeRemaining =
        proposalData.accountInfo.data.votingEndsAt.toNumber() * 1_000 -
        Date.now();
      return clearTimeout(
        setTimeout(() => {
          void refetch();
        }, timeRemaining + 1)
      );
    }
  }, [proposalData, refetch, state]);

  return {
    refetch,
    info,
    id,
    index,
  };
};

/**
 * Fetches the data associated with all proposals of the DAO.
 *
 * This includes both active and draft proposals. In the future, we may want to filter this
 * out-- we should build an index somewhere for this.
 *
 * @returns
 */
export const useProposals = () => {
  const { network } = useSolana();
  const { governor, governorData, proposalCount } = useGovernor();
  const proposalsKeys = useQueries(
    proposalCount
      ? Array(proposalCount)
          .fill(null)
          .map((_, i) => proposalCount - i - 1)
          .map((i) => ({
            queryKey: ["proposalKeys", network, governor.toString(), i],
            queryFn: async () => {
              invariant(governorData);
              const [proposalKey] = await findProposalAddress(
                governorData.accountId,
                new u64(i)
              );
              const [proposalMetaKey] = await findProposalMetaAddress(
                proposalKey
              );
              return { proposalKey, proposalMetaKey };
            },
            enabled: !!governorData,
          }))
      : []
  );

  const proposalsKeysCache = proposalsKeys
    .map((p) => (p.data ? getCacheKeyOfPublicKey(p.data.proposalKey) : ""))
    .join(",");
  const proposalsData = useParsedProposals(
    useMemo(
      () => proposalsKeys.map((p) => p.data?.proposalKey),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [proposalsKeysCache]
    )
  );
  const proposalsMetaData = useParsedProposalMetas(
    useMemo(
      () => proposalsKeys.map((p) => p.data?.proposalMetaKey),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [proposalsKeysCache]
    )
  );

  const isLoading =
    !proposalsData.every((p) => p !== undefined) ||
    !proposalsMetaData.every((p) => p !== undefined);

  return useQueries(
    proposalCount
      ? Array(proposalCount)
          .fill(null)
          .map((_, i) => proposalCount - i - 1)
          .map((i) => ({
            queryKey: ["proposalInfo", network, governor.toString(), i],
            queryFn: (): ProposalInfo | null => {
              const proposalData = proposalsData.find(
                (p) => p?.accountInfo.data.index.toNumber() === i
              );
              if (!proposalData) {
                return null;
              }
              const proposalMetaData = proposalsMetaData.find((p) =>
                p?.accountInfo.data.proposal.equals(proposalData.accountId)
              );
              return buildProposalInfo({
                index: proposalData.accountInfo.data.index.toNumber(),
                proposalData,
                proposalMetaData: proposalMetaData
                  ? proposalMetaData.accountInfo.data
                  : null,
              });
            },
            enabled: !isLoading,
          }))
      : []
  );
};
