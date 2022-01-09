import type { GaugeData } from "@quarryprotocol/gauge";
import { findEpochGaugeAddress } from "@quarryprotocol/gauge";
import type { QuarryInfo } from "@quarryprotocol/react-quarry";
import { useRewarder } from "@quarryprotocol/react-quarry";
import type { ParsedAccountInfo } from "@saberhq/sail";
import { Percent, TokenAmount } from "@saberhq/token-utils";
import BN from "bn.js";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

import {
  useParsedEpochGauge,
  useParsedGaugemeister,
} from "../../../../../../utils/parsers";
import { TokenAmountDisplay } from "../../../../../common/TokenAmountDisplay";
import { TokenIcon } from "../../../../../common/TokenIcon";
import { useGaugemeister } from "../../hooks/useGaugemeister";

interface Props {
  quarry: QuarryInfo;
  gauge: ParsedAccountInfo<GaugeData>;
}

export const GaugeListRow: React.FC<Props> = ({
  quarry,
  gauge: { accountId: gaugeKey },
}: Props) => {
  const gaugemeister = useGaugemeister();
  const { data: gm } = useParsedGaugemeister(gaugemeister);
  const votingEpoch = gm ? gm.accountInfo.data.currentRewardsEpoch + 1 : null;

  const { data: epochGaugeKey } = useQuery(
    ["epochGaugeKey", gaugeKey.toString()],
    async () => {
      invariant(votingEpoch, "votingEpoch must be defined");
      const [key] = await findEpochGaugeAddress(gaugeKey, votingEpoch);
      return key;
    },
    {
      enabled: votingEpoch !== null,
    }
  );

  const { data: epochGauge } = useParsedEpochGauge(epochGaugeKey);

  const { rewardToken, rewarder } = useRewarder();
  const rewardsRate = rewardToken
    ? new TokenAmount(
        rewardToken,
        quarry.quarry.accountInfo.data.annualRewardsRate.div(new BN(365))
      )
    : rewardToken;

  const percent = rewarder
    ? new Percent(
        quarry.quarry.accountInfo.data.rewardsShare,
        rewarder.accountInfo.data.totalRewardsShares
      )
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
        <div tw="flex flex-col gap-1">
          <span tw="text-white font-medium">
            {percent?.toFixed(2)}%{" "}
            <span tw="text-warmGray-400 font-normal">
              (
              {quarry.quarry.accountInfo.data.rewardsShare
                .toNumber()
                .toLocaleString()}
              )
            </span>
          </span>
          <span tw="text-xs">
            {rewardsRate && (
              <TokenAmountDisplay amount={rewardsRate} suffix="/day" />
            )}
          </span>
        </div>
      </td>
      <td>
        {epochGauge?.accountInfo.data.totalPower.toNumber().toLocaleString()}
      </td>
    </tr>
  );
};
