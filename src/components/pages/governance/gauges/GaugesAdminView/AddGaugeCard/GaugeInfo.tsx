import { findGaugeAddress, GaugeSDK } from "@quarryprotocol/gauge";
import type { QuarryInfo } from "@quarryprotocol/react-quarry";
import { useSail } from "@saberhq/sail";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

import { useParsedGauge } from "../../../../../../utils/parsers";
import { AddressLink } from "../../../../../common/AddressLink";
import { AsyncButton } from "../../../../../common/AsyncButton";
import { Button } from "../../../../../common/Button";
import { LoadingSpinner } from "../../../../../common/LoadingSpinner";
import { TokenIcon } from "../../../../../common/TokenIcon";
import { useGovernor } from "../../../hooks/useGovernor";

interface Props {
  quarry: QuarryInfo;
}

export const GaugeInfo: React.FC<Props> = ({ quarry }: Props) => {
  const { handleTX } = useSail();
  const { gauge: gaugeSettings } = useGovernor();
  const { data: gaugeKey } = useQuery(
    ["gaugeKey", gaugeSettings?.gaugemeister.toString(), quarry.key.toString()],
    async () => {
      invariant(gaugeSettings);
      const [key] = await findGaugeAddress(
        gaugeSettings.gaugemeister,
        quarry.key
      );
      return key;
    },
    { enabled: !!gaugeSettings }
  );
  const { data: gauge, loading } = useParsedGauge(gaugeKey);
  return (
    <tr>
      <td>
        <div tw="flex gap-2 items-center">
          <TokenIcon token={quarry.stakedToken} />
          {quarry.stakedToken.name}
        </div>
      </td>
      <td>
        <AddressLink address={quarry.stakedToken.mintAccount} showCopy />
      </td>
      <td>
        <div tw="flex flex-col items-end">
          {gauge ? (
            <Button disabled>
              {loading ? <LoadingSpinner /> : "Already Created"}
            </Button>
          ) : (
            <AsyncButton
              disabled={!gaugeSettings}
              onClick={async (sdkMut) => {
                invariant(gaugeSettings);
                const gaugeSDK = GaugeSDK.load({ provider: sdkMut.provider });
                const { tx: createGaugeTX } = await gaugeSDK.gauge.createGauge({
                  gaugemeister: gaugeSettings.gaugemeister,
                  quarry: quarry.key,
                });
                await handleTX(createGaugeTX, "Create Gauge");
              }}
            >
              Add Gauge
            </AsyncButton>
          )}
          {!gauge ? (
            <Button disabled>
              {loading ? <LoadingSpinner /> : "Gauge not found"}
            </Button>
          ) : (
            <AsyncButton
              disabled={!gaugeKey || !gauge.accountInfo.data.isDisabled}
              onClick={async (sdkMut) => {
                invariant(gaugeKey);
                const gaugeSDK = GaugeSDK.load({ provider: sdkMut.provider });
                const enableGaugeTX = await gaugeSDK.gauge.enableGauge({
                  gauge: gaugeKey,
                });
                await handleTX(enableGaugeTX, "Enable Gauge");
              }}
            >
              Enable Gauge
            </AsyncButton>
          )}
        </div>
      </td>
    </tr>
  );
};
