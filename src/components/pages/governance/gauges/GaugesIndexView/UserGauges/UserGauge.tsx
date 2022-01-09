import { findEpochGaugeVoteAddress } from "@quarryprotocol/gauge";
import { useToken } from "@quarryprotocol/react-quarry";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";
import { theme } from "twin.macro";

import { FORMAT_VOTE_PERCENT } from "../../../../../../utils/format";
import {
  useParsedEpochGaugeVote,
  useParsedGauge,
  useParsedGaugemeister,
  useParsedQuarry,
} from "../../../../../../utils/parsers";
import { Button } from "../../../../../common/Button";
import { ContentLoader } from "../../../../../common/ContentLoader";
import { Meter } from "../../../../../common/Meter";
import { TokenIcon } from "../../../../../common/TokenIcon";
import { useGovernor } from "../../../hooks/useGovernor";
import { useCommitVotes } from "../../hooks/useCommitVotes";
import { useGaugemeister } from "../../hooks/useGaugemeister";
import type { UserGaugeInfo } from "../../hooks/useMyGauges";

interface Props {
  className?: string;
  gaugeVote: UserGaugeInfo;
}

export const UserGauge: React.FC<Props> = ({ className, gaugeVote }: Props) => {
  const gaugemeister = useGaugemeister();
  const { data: gm } = useParsedGaugemeister(gaugemeister);
  const { data: gauge } = useParsedGauge(gaugeVote.gauge);
  const { data: quarry } = useParsedQuarry(gauge?.accountInfo.data.quarry);
  const { veToken } = useGovernor();
  const stakedToken = useToken(quarry?.accountInfo.data.tokenMintKey);
  const { data: epochGaugeVoteKey } = useQuery(
    ["epochGaugeVoteKey", gaugeVote.gauge.toString(), gm?.accountId.toString()],
    async () => {
      invariant(gm);
      const [key] = await findEpochGaugeVoteAddress(
        gaugeVote.key,
        gm.accountInfo.data.currentRewardsEpoch + 1
      );
      return key;
    },
    { enabled: !!gm }
  );
  const { data: epochGaugeVote } = useParsedEpochGaugeVote(epochGaugeVoteKey);

  const commitVotes = useCommitVotes();

  return (
    <tr className={className}>
      <td>
        <div tw="flex items-center gap-2">
          <TokenIcon token={stakedToken} />
          <div>
            {stakedToken ? (
              <span>{stakedToken?.name}</span>
            ) : (
              <ContentLoader tw="w-32 h-4" />
            )}
          </div>
        </div>
      </td>
      <td>
        {epochGaugeVote && veToken ? (
          (
            epochGaugeVote.accountInfo.data.allocatedPower.toNumber() /
            10 ** veToken.decimals
          ).toLocaleString()
        ) : epochGaugeVote === undefined ? (
          <ContentLoader tw="w-20 h-4" />
        ) : (
          <Button variant="muted" onClick={commitVotes}>
            Commit
          </Button>
        )}
      </td>
      <td>
        <div tw="flex items-center">
          <div tw="w-16">
            <Meter
              value={gaugeVote.percent ?? 0}
              max={1}
              barColor={theme`colors.primary`}
            />
          </div>
          <div tw="ml-2">
            {gaugeVote.percent !== null
              ? FORMAT_VOTE_PERCENT.format(gaugeVote.percent)
              : "--"}
          </div>
        </div>
      </td>
    </tr>
  );
};
