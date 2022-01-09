import { GOKI_CODERS } from "@gokiprotocol/client";
import { GAUGE_CODERS } from "@quarryprotocol/gauge";
import { QUARRY_CODERS } from "@quarryprotocol/quarry-sdk";
import { makeParserHooks } from "@saberhq/sail";
import { TRIBECA_CODERS } from "@tribecahq/tribeca-sdk";

const parserHooks = makeParserHooks({
  ...TRIBECA_CODERS.Govern.accountParsers,
  ...TRIBECA_CODERS.LockedVoter.accountParsers,
  ...GOKI_CODERS.SmartWallet.accountParsers,
  ...GAUGE_CODERS.Gauge.accountParsers,
  ...QUARRY_CODERS.Mine.accountParsers,
  ...QUARRY_CODERS.Operator.accountParsers,
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
  transaction: { useData: useParsedTXByKeys, useSingleData: useParsedTXByKey },
  gaugemeister: {
    useData: useParsedGaugemeisters,
    useSingleData: useParsedGaugemeister,
  },
  gauge: { useData: useParsedGauges, useSingleData: useParsedGauge },
  gaugeVoter: {
    useData: useParsedGaugeVoters,
    useSingleData: useParsedGaugeVoter,
  },
  gaugeVote: {
    useData: useParsedGaugeVotes,
    useSingleData: useParsedGaugeVote,
  },
  epochGauge: {
    useData: useParsedEpochGauges,
    useSingleData: useParsedEpochGauge,
  },
  epochGaugeVote: {
    useData: useParsedEpochGaugeVotes,
    useSingleData: useParsedEpochGaugeVote,
  },
  epochGaugeVoter: {
    useData: useParsedEpochGaugeVoters,
    useSingleData: useParsedEpochGaugeVoter,
  },
  rewarder: { useData: useParsedRewarders, useSingleData: useParsedRewarder },
  quarry: { useData: useParsedQuarries, useSingleData: useParsedQuarry },
  operator: { useData: useParsedOperators, useSingleData: useParsedOperator },
} = parserHooks;
