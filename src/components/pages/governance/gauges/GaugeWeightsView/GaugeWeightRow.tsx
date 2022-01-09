import {
  findGaugeAddress,
  findGaugeVoteAddress,
  findGaugeVoterAddress,
} from "@quarryprotocol/gauge";
import type { QuarryInfo } from "@quarryprotocol/react-quarry";
import { useEffect } from "react";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

import { FORMAT_VOTE_PERCENT } from "../../../../../utils/format";
import { useParsedGaugeVote } from "../../../../../utils/parsers";
import { InputText } from "../../../../common/inputs/InputText";
import { TokenIcon } from "../../../../common/TokenIcon";
import { useUserEscrow } from "../../hooks/useEscrow";
import { useGaugemeister } from "../hooks/useGaugemeister";
import { useUpdateGaugeWeights } from "./useUpdateGaugeWeights";

interface Props {
  quarry: QuarryInfo;
}

export const GaugeWeightRow: React.FC<Props> = ({ quarry }: Props) => {
  const { escrowKey } = useUserEscrow();
  const gaugemeister = useGaugemeister();

  const { data: gaugeKey } = useQuery(
    ["gaugeKey", gaugemeister?.toString(), quarry.key.toString()],
    async () => {
      invariant(gaugemeister);
      const [gauge] = await findGaugeAddress(gaugemeister, quarry.key);
      return gauge;
    },
    {
      enabled: !!gaugemeister,
    }
  );

  const { data: gaugeVoterKeys } = useQuery(
    ["gaugeVoterKeys", gaugeKey?.toString(), escrowKey?.toString()],
    async () => {
      invariant(escrowKey && gaugeKey && gaugemeister);
      const [gaugeVoter] = await findGaugeVoterAddress(gaugemeister, escrowKey);
      const [gaugeVote] = await findGaugeVoteAddress(gaugeVoter, gaugeKey);
      return { gaugeVoter, gaugeVote };
    },
    {
      enabled: !!escrowKey && !!gaugeKey,
    }
  );
  const gaugeVoteKey = gaugeVoterKeys?.gaugeVote;
  const { data: gaugeVote } = useParsedGaugeVote(gaugeVoteKey);

  const {
    currentTotalShares,
    nextShares,
    nextTotalShares,
    nextSharesRaw,
    setTokenShareStr,
  } = useUpdateGaugeWeights();
  const nextShare = nextShares[quarry.stakedToken.address];

  const currentShare = gaugeVote ? gaugeVote.accountInfo.data.weight : null;
  useEffect(() => {
    if (currentShare) {
      setTokenShareStr(
        quarry.stakedToken,
        currentShare,
        currentShare.toString()
      );
    }
  }, [currentShare, setTokenShareStr, quarry.stakedToken]);

  const percent = nextTotalShares ? (nextShare ?? 0) / nextTotalShares : null;

  const currentSharePercent =
    currentShare !== null && currentTotalShares
      ? currentShare / currentTotalShares
      : null;

  return (
    <tr>
      <td>
        <div tw="flex gap-2 items-center">
          <TokenIcon token={quarry.stakedToken} />
          {quarry.stakedToken.name}
        </div>
      </td>
      <td>
        {currentSharePercent !== null
          ? FORMAT_VOTE_PERCENT.format(currentSharePercent)
          : "--"}
      </td>
      <td>
        <InputText
          value={nextSharesRaw[quarry.stakedToken.address]?.value ?? ""}
          onChange={(e) => {
            setTokenShareStr(
              quarry.stakedToken,
              currentShare ?? 0,
              e.target.value
            );
          }}
        />
      </td>
      <td>{percent !== null ? FORMAT_VOTE_PERCENT.format(percent) : "--"}</td>
    </tr>
  );
};
