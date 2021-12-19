import { makeParserHooks } from "@saberhq/sail";
import { TRIBECA_CODERS } from "@tribecahq/tribeca-sdk";

const parserHooks = makeParserHooks({
  ...TRIBECA_CODERS.Govern.accountParsers,
  ...TRIBECA_CODERS.LockedVoter.accountParsers,
});

export const {
  proposal: { useData: useParsedProposals, useSingleData: useParsedProposal },
  proposalMeta: {
    useData: useParsedProposalMetas,
    useSingleData: useParsedProposalMeta,
  },
  locker: { useData: useParsedLockers, useSingleData: useParsedLocker },
  escrow: { useData: useParsedEscrows, useSingleData: useParsedEscrow },
  governor: { useData: useParsedGovernors, useSingleData: useParsedGovernor },
  vote: { useData: useParsedVotes, useSingleData: useParsedVote },
} = parserHooks;
