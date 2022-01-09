import { RewarderProvider } from "@quarryprotocol/react-quarry";
import { Link } from "react-router-dom";

import { useParsedGaugemeister } from "../../../../../utils/parsers";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { LoadingPage } from "../../../../common/LoadingPage";
import { ExternalLink } from "../../../../common/typography/ExternalLink";
import { useGovernor, useGovWindowTitle } from "../../hooks/useGovernor";
import { useGaugemeister } from "../hooks/useGaugemeister";
import { GaugeWeightsForm } from "./GaugeWeightsForm";
import { UpdateGaugeWeightsProvider } from "./useUpdateGaugeWeights";

export const GaugeWeightsView: React.FC = () => {
  const gaugemeister = useGaugemeister();
  const gm = useParsedGaugemeister(gaugemeister);
  const { govToken, veToken, path } = useGovernor();
  const rewarderKey = gm.data?.accountInfo.data.rewarder;

  useGovWindowTitle(`Update Gauge Weights`);
  return (
    <GovernancePage
      title="Update Gauge Weights"
      backLink={{
        label: "Gauges",
        href: `${path}/gauges`,
      }}
    >
      <div tw="flex flex-col gap-4">
        <Card title="All Gauges">
          {gm.loading ? (
            <LoadingPage tw="p-16" />
          ) : (
            rewarderKey && (
              <RewarderProvider initialState={{ rewarderKey }}>
                <UpdateGaugeWeightsProvider>
                  <GaugeWeightsForm />
                </UpdateGaugeWeightsProvider>
              </RewarderProvider>
            )
          )}
        </Card>
        <Card title="Gauge Weight Voting">
          <div tw="px-8 py-5 text-sm">
            <p>
              You can vote for gauge weight with your {veToken?.symbol} tokens
              (locked {govToken?.symbol} tokens in{" "}
              <Link tw="text-primary hover:text-white" to={`${path}/locker`}>
                Locker
              </Link>
              ). Gauge weights are used to determine how much {govToken?.symbol}{" "}
              each pool gets.
            </p>
            <ExternalLink
              tw="mt-4"
              href="https://docs.tribeca.so/voting-escrow/gauges/"
            >
              Learn more
            </ExternalLink>
          </div>
        </Card>
      </div>
    </GovernancePage>
  );
};
