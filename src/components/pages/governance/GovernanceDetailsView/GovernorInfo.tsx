import { TokenAmount } from "@saberhq/token-utils";

import { AttributeList } from "../../../common/AttributeList";
import { Card } from "../../../common/governance/Card";
import { useGovernor } from "../hooks/useGovernor";

export const GovernorInfo: React.FC = () => {
  const { governorData, veToken } = useGovernor();
  const votesForQuorum =
    governorData && veToken
      ? new TokenAmount(
          veToken,
          governorData.accountInfo.data.params.quorumVotes
        )
      : null;

  return (
    <Card title="Governor">
      <AttributeList
        attributes={{
          "Smart Wallet": governorData?.accountInfo.data.smartWallet,
          Electorate: governorData?.accountInfo.data.electorate,
          "Votes for Quorum": votesForQuorum?.formatUnits(),
          "Timelock Delay (seconds)":
            governorData?.accountInfo.data.params.timelockDelaySeconds,
          "Voting Delay": governorData?.accountInfo.data.params.votingDelay,
          "Voting Period": governorData?.accountInfo.data.params.votingPeriod,
        }}
      />
    </Card>
  );
};
