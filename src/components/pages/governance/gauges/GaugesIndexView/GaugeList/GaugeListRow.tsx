import type { GaugeData } from "@quarryprotocol/gauge";
import { findEpochGaugeAddress } from "@quarryprotocol/gauge";
import type { QuarryInfo } from "@quarryprotocol/react-quarry";
import type { ParsedAccountInfo } from "@saberhq/sail";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

import {
  useParsedEpochGauge,
  useParsedGaugemeister,
} from "../../../../../../utils/parsers";
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

  return (
    <tr>
      <td>
        <div tw="flex gap-2 items-center">
          <TokenIcon token={quarry.stakedToken} />
          {quarry.stakedToken.name}
        </div>
      </td>
      <td>
        {quarry.quarry.accountInfo.data.rewardsShare
          .toNumber()
          .toLocaleString()}
      </td>
      <td>
        {epochGauge?.accountInfo.data.totalPower.toNumber().toLocaleString()}
      </td>
    </tr>
  );
};
