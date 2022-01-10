import type { GaugeData } from "@quarryprotocol/gauge";
import { findEpochGaugeAddress } from "@quarryprotocol/gauge";
import type { QuarryInfo } from "@quarryprotocol/react-quarry";
import { useRewarder } from "@quarryprotocol/react-quarry";
import type { ParsedAccountInfo } from "@saberhq/sail";
import { Percent, TokenAmount } from "@saberhq/token-utils";
import { useSolana } from "@saberhq/use-solana";
import BN from "bn.js";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

import {
  useParsedEpochGauge,
  useParsedGaugemeister,
} from "../../../../../../utils/parsers";
import { TokenAmountDisplay } from "../../../../../common/TokenAmountDisplay";
import { TokenIcon } from "../../../../../common/TokenIcon";
import { useGovernor } from "../../../hooks/useGovernor";
import { useGaugemeister } from "../../hooks/useGaugemeister";

interface Props {
  quarry: QuarryInfo;
  gauge: ParsedAccountInfo<GaugeData>;
  /**
   * If null, the total shares are stil loading.
   */
  totalShares: BN | null;
  dailyRewardsRate: BN | null | undefined;
}

/**
 * Row in the "All Gauges" section of the Gauges homepage.
 * @returns
 */
export const GaugeListRow: React.FC<Props> = ({
  quarry,
  gauge: { accountId: gaugeKey },
  totalShares,
  dailyRewardsRate,
}: Props) => {
  const gaugemeister = useGaugemeister();
  const { data: gm } = useParsedGaugemeister(gaugemeister);
  const votingEpoch = gm ? gm.accountInfo.data.currentRewardsEpoch + 1 : null;
  const { veToken } = useGovernor();

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

  const { rewardToken, rewarder, rewarderKey } = useRewarder();
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

  const nextPercent =
    epochGauge && totalShares
      ? new Percent(epochGauge.accountInfo.data.totalPower, totalShares)
      : null;
  const nextRewardsRate =
    rewardToken && dailyRewardsRate && epochGauge && totalShares
      ? new TokenAmount(
          rewardToken,
          dailyRewardsRate
            .mul(epochGauge.accountInfo.data.totalPower)
            .div(totalShares)
        )
      : null;

  const { network } = useSolana();
  const quarryLink = `https://${
    network === "mainnet-beta"
      ? "app"
      : network === "devnet"
      ? "devnet"
      : network === "testnet"
      ? "testnet"
      : "app"
  }.quarry.so/#/rewarders/${rewarderKey.toString()}/quarries/${quarry.key.toString()}`;

  return (
    <tr>
      <td>
        <div tw="flex gap-2 items-center">
          <TokenIcon token={quarry.stakedToken} />
          <a
            tw="font-medium hover:underline"
            href={quarryLink}
            target="_blank"
            rel="noreferrer"
          >
            {quarry.stakedToken.name}
          </a>
          {quarry.stakedToken.info.extensions?.website ? (
            <a
              tw="text-primary hover:text-white transition-colors"
              href={quarry.stakedToken.info.extensions.website}
              target="_blank"
              rel="noreferrer"
            >
              <FaExternalLinkAlt />
            </a>
          ) : null}
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
        <div tw="flex flex-col gap-1">
          <span tw="text-white font-medium">
            {nextPercent?.toFixed(2)}%{" "}
            <span tw="text-warmGray-400 font-normal">
              (
              {epochGauge && veToken
                ? (
                    epochGauge.accountInfo.data.totalPower.toNumber() /
                    10 ** veToken.decimals
                  ).toLocaleString()
                : "--"}
              )
            </span>
          </span>
          <span tw="text-xs">
            {nextRewardsRate && (
              <TokenAmountDisplay amount={nextRewardsRate} suffix="/day" />
            )}
          </span>
        </div>
      </td>
    </tr>
  );
};
