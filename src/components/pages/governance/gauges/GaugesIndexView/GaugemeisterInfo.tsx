import { GaugeSDK } from "@quarryprotocol/gauge";
import { useSail } from "@saberhq/sail";
import Countdown from "react-countdown";
import invariant from "tiny-invariant";

import { useParsedGaugemeister } from "../../../../../utils/parsers";
import { tsToDate } from "../../../../../utils/utils";
import { AsyncButton } from "../../../../common/AsyncButton";
import { ContentLoader } from "../../../../common/ContentLoader";
import { Card } from "../../../../common/governance/Card";
import { CardItem } from "../../locker/LockerIndexView/CardItem";
import { useGaugemeister } from "../hooks/useGaugemeister";

export const GaugemeisterInfo: React.FC = () => {
  const gaugemeister = useGaugemeister();
  const { data: gm } = useParsedGaugemeister(gaugemeister);
  const nextEpochStartsAt = gm
    ? tsToDate(gm.accountInfo.data.nextEpochStartsAt)
    : null;
  const { handleTX } = useSail();
  return (
    <Card title="Epoch Info">
      <CardItem label="Current Epoch">
        <div tw="flex items-center gap-2.5 h-7">
          {gm ? (
            gm.accountInfo.data.currentRewardsEpoch
          ) : (
            <div tw="h-4 w-12 animate-pulse rounded bg-white bg-opacity-10" />
          )}
        </div>
      </CardItem>
      <CardItem label="Next Epoch Start">
        <div tw="flex items-center gap-2.5 h-7">
          {nextEpochStartsAt ? (
            nextEpochStartsAt <= new Date() ? (
              <AsyncButton
                onClick={async (sdkMut) => {
                  invariant(gaugemeister);
                  const gaugeSDK = GaugeSDK.load({
                    provider: sdkMut.provider,
                  });
                  const triggerTX = gaugeSDK.gauge.triggerNextEpoch({
                    gaugemeister,
                  });
                  await handleTX(triggerTX, "Trigger next epoch");
                }}
              >
                Trigger next epoch
              </AsyncButton>
            ) : (
              <Countdown date={nextEpochStartsAt} />
            )
          ) : (
            <ContentLoader tw="h-4 w-12" />
          )}
        </div>
      </CardItem>
      <CardItem label="Next Rewards Period">
        <div tw="flex items-center gap-2.5 h-14 text-sm leading-snug">
          {nextEpochStartsAt ? (
            <>
              {nextEpochStartsAt.toLocaleString()} -<br />
              {new Date(
                nextEpochStartsAt.getTime() +
                  (gm?.accountInfo.data.epochDurationSeconds ?? 0) * 1000
              ).toLocaleString()}
            </>
          ) : (
            <ContentLoader tw="h-4 w-12" />
          )}
        </div>
      </CardItem>
    </Card>
  );
};
