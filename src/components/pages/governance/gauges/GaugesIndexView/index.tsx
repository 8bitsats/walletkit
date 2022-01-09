import { RewarderProvider } from "@quarryprotocol/react-quarry";
import { Link } from "react-router-dom";

import { useParsedGaugemeister } from "../../../../../utils/parsers";
import { Card } from "../../../../common/governance/Card";
import { GovernancePage } from "../../../../common/governance/GovernancePage";
import { ExternalLink } from "../../../../common/typography/ExternalLink";
import { useGovernor, useGovWindowTitle } from "../../hooks/useGovernor";
import { useGaugemeister } from "../hooks/useGaugemeister";
import { AllGauges } from "./AllGauges";
import { GaugemeisterInfo } from "./GaugemeisterInfo";
import { UserGauges } from "./UserGauges";

export const GaugesIndexView: React.FC = () => {
  const gaugemeister = useGaugemeister();
  useGovWindowTitle(`Gauges`);
  const { govToken, veToken, path } = useGovernor();

  const gm = useParsedGaugemeister(gaugemeister);
  const rewarderKey = gm.data?.accountInfo.data.rewarder;

  return (
    <GovernancePage title="Gauges">
      <div tw="flex flex-wrap md:flex-nowrap gap-4 items-start">
        <div tw="w-full md:flex-basis[300px] flex flex-col gap-4 flex-shrink-0">
          <GaugemeisterInfo />
        </div>
        <div tw="flex-grow[2] flex flex-col gap-8">
          <Card title="Gauge Weight Voting">
            <div tw="px-8 py-5 text-sm">
              <p>
                You can vote for gauge weight with your {veToken?.symbol} tokens
                (locked {govToken?.symbol} tokens in{" "}
                <Link tw="text-primary hover:text-white" to={`${path}/locker`}>
                  Locker
                </Link>
                ). Gauge weights are used to determine how much{" "}
                {govToken?.symbol} each pool gets.
              </p>
              <ExternalLink
                tw="mt-4"
                href="https://docs.tribeca.so/voting-escrow/gauges/"
              >
                Learn more
              </ExternalLink>
            </div>
          </Card>
          {rewarderKey && (
            <RewarderProvider initialState={{ rewarderKey }}>
              <UserGauges />
              <AllGauges />
            </RewarderProvider>
          )}
        </div>
      </div>
    </GovernancePage>
  );
};
