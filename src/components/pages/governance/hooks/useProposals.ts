import type { ParsedAccountInfo } from "@saberhq/sail";
import { getCacheKeyOfPublicKey } from "@saberhq/sail";
import { u64 } from "@saberhq/token-utils";
import { useSolana } from "@saberhq/use-solana";
import type { PublicKey } from "@solana/web3.js";
import type {
  GovernorData,
  ProposalData,
  ProposalMetaData,
  ProposalState,
} from "@tribecahq/tribeca-sdk";
import {
  findProposalAddress,
  findProposalMetaAddress,
  getProposalState,
} from "@tribecahq/tribeca-sdk";
import { useMemo } from "react";
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
  governorData,
  proposalData,
  proposalMetaData,
}: {
  index: number;
  governorData: ParsedAccountInfo<GovernorData>;
  proposalData: ParsedAccountInfo<ProposalData>;
  proposalMetaData: ProposalMetaData | null;
}): ProposalInfo | null => {
  const state = getProposalState({
    proposalData: proposalData.accountInfo.data,
    quorumVotes: governorData.accountInfo.data.params.quorumVotes,
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
  const { governor, governorData } = useGovernor();
  const id = `000${index}`.slice(-4);

  const proposalKeys = useQuery(
    ["proposalKeys", network, governor.toString(), index],
    async () => {
      invariant(governorData);
      const [proposalKey] = await findProposalAddress(
        governorData.accountId,
        new u64(index)
      );
      const [proposalMetaKey] = await findProposalMetaAddress(proposalKey);
      return { proposalKey, proposalMetaKey };
    },
    { enabled: !!governorData }
  );

  const { data: proposalData } = useParsedProposal(
    proposalKeys.data?.proposalKey
  );
  const { data: proposalMetaData } = useParsedProposalMeta(
    proposalKeys.data?.proposalMetaKey
  );

  const proposalInfo = useMemo(() => {
    if (!governorData || !proposalData || proposalMetaData === undefined) {
      return null;
    }
    return buildProposalInfo({
      index,
      governorData,
      proposalData,
      proposalMetaData: proposalMetaData
        ? proposalMetaData.accountInfo.data
        : null,
    });
  }, [governorData, index, proposalData, proposalMetaData]);
  return {
    info: proposalInfo,
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
    !governorData ||
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
              invariant(governorData);
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
                governorData,
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
