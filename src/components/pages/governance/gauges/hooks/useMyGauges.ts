import type { GaugeVoteData } from "@quarryprotocol/gauge";
import {
  findGaugeVoteAddress,
  findGaugeVoterAddress,
} from "@quarryprotocol/gauge";
import type { ParsedAccountInfo } from "@saberhq/sail";
import type { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

import {
  useParsedGaugeVoter,
  useParsedGaugeVotes,
} from "../../../../../utils/parsers";
import { useUserEscrow } from "../../hooks/useEscrow";
import { useGaugemeister } from "./useGaugemeister";
import { useGaugeKeys } from "./useGauges";

export interface UserGaugeInfo extends GaugeVoteData {
  key: PublicKey;
  weight: number;
  percent: number | null;
}

export const useMyGauges = () => {
  const gaugemeister = useGaugemeister();
  const gaugeKeys = useGaugeKeys();
  const { escrowKey } = useUserEscrow();

  const { data: gaugeVoteKeys } = useQuery(
    ["gaugeVoteKeys", escrowKey?.toString()],
    async () => {
      invariant(escrowKey && gaugeKeys && gaugemeister);
      const [gaugeVoterKey] = await findGaugeVoterAddress(
        gaugemeister,
        escrowKey
      );
      const gaugeVoteKeys = await Promise.all(
        gaugeKeys.map(async (gauge) => {
          const [gaugeVote] = await findGaugeVoteAddress(gaugeVoterKey, gauge);
          return gaugeVote;
        }) ?? []
      );
      return { gaugeVoterKey, gaugeVoteKeys };
    },
    {
      enabled: !!escrowKey && !!gaugeKeys && !!gaugemeister,
    }
  );

  const { data: gaugeVoter } = useParsedGaugeVoter(
    gaugeVoteKeys?.gaugeVoterKey
  );
  const gaugeVotes = useParsedGaugeVotes(
    useMemo(() => gaugeVoteKeys?.gaugeVoteKeys ?? [], [gaugeVoteKeys])
  );

  const totalWeight = gaugeVoter
    ? gaugeVoter.accountInfo.data.totalWeight
    : gaugeVoter;

  const myGauges = useMemo(
    () =>
      gaugeVotes
        .filter((gv): gv is ParsedAccountInfo<GaugeVoteData> => !!gv)
        .map((gv): UserGaugeInfo => {
          const weight = gv.accountInfo.data.weight ?? 0;
          const percent =
            typeof totalWeight === "number" ? weight / totalWeight : null;
          return {
            key: gv.accountId,
            ...gv.accountInfo.data,
            percent,
          };
        })
        .sort((a, b) => (a.weight > b.weight ? -1 : 1)),
    [gaugeVotes, totalWeight]
  );

  return {
    gaugeVoter,
    gaugeVotes,
    myGauges,
    hasNoGauges:
      gaugeVotes.length !== 0 && gaugeVotes.every((gv) => gv === null),
  };
};
