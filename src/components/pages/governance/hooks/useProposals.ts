import type { AccountFetchResult, ParsedAccountInfo } from "@saberhq/sail";
import { useSail } from "@saberhq/sail";
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
  TRIBECA_CODERS,
} from "@tribecahq/tribeca-sdk";
import { useQueries, useQuery } from "react-query";
import invariant from "tiny-invariant";

import { useGovernor } from "./useGovernor";

export interface ProposalInfo {
  proposalKey: PublicKey;
  index: number;
  proposalData: ProposalData;
  proposalMetaData: ProposalMetaData | null;
  state: ProposalState;
}

const fetchProposal = async ({
  index,
  governorData,
  fetchKeys,
}: {
  index: number;
  governorData: ParsedAccountInfo<GovernorData>;
  fetchKeys: (
    keys: (PublicKey | null | undefined)[]
  ) => Promise<AccountFetchResult[]>;
}): Promise<ProposalInfo | null> => {
  const [proposalKey] = await findProposalAddress(
    governorData.accountId,
    new u64(index)
  );
  const [proposalMetaKey] = await findProposalMetaAddress(proposalKey);
  const [proposalDataRaw, proposalMetaRaw] = await fetchKeys([
    proposalKey,
    proposalMetaKey,
  ]);
  if (!proposalDataRaw?.data) {
    return null;
  }
  const proposalData = TRIBECA_CODERS.Govern.accountParsers.proposal(
    proposalDataRaw.data.accountInfo.data
  );
  const state = getProposalState({
    proposalData,
    quorumVotes: governorData.accountInfo.data.params.quorumVotes,
  });
  const proposalMetaData = proposalMetaRaw?.data
    ? TRIBECA_CODERS.Govern.accountParsers.proposalMeta(
        proposalMetaRaw.data.accountInfo.data
      )
    : null;

  return {
    proposalKey,
    index,
    proposalData,
    proposalMetaData,
    state,
  };
};

/**
 * Fetches the data associated with a specific proposal.
 */
export const useProposal = (index: number) => {
  const { network } = useSolana();
  const { governor, governorData } = useGovernor();
  const { fetchKeys } = useSail();
  return useQuery({
    queryKey: ["proposalInfo", network, governor.toString(), index],
    queryFn: async (): Promise<ProposalInfo | null> => {
      invariant(governorData);
      return await fetchProposal({
        index,
        governorData,
        fetchKeys,
      });
    },
    enabled: !!governorData,
  });
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
  const { fetchKeys } = useSail();
  return useQueries(
    proposalCount
      ? Array(proposalCount)
          .fill(null)
          .map((_, i) => proposalCount - i - 1)
          .map((i) => ({
            queryKey: ["proposalInfo", network, governor.toString(), i],
            queryFn: async (): Promise<ProposalInfo | null> => {
              invariant(governorData);
              return await fetchProposal({
                index: i,
                governorData,
                fetchKeys,
              });
            },
            enabled: !!governorData,
          }))
      : []
  );
};
