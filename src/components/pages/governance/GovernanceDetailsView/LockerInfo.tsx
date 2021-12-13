import { AttributeList } from "../../../common/AttributeList";
import { Card } from "../../../common/governance/Card";
import { useGovernor } from "../hooks/useGovernor";

export const LockerInfo: React.FC = () => {
  const { lockerData, minActivationThreshold } = useGovernor();
  return (
    <Card title="Locker">
      <AttributeList
        attributes={{
          Locker: lockerData?.accountId,
          "Governance Token": lockerData?.accountInfo.data.tokenMint,
          "Min Stake Duration":
            lockerData?.accountInfo.data.params.minStakeDuration,
          "Max Stake Duration":
            lockerData?.accountInfo.data.params.maxStakeDuration,
          "Max Vote Multiplier":
            lockerData?.accountInfo.data.params.maxStakeVoteMultiplier,
          "Votes to Activate a Proposal": minActivationThreshold?.formatUnits(),
        }}
      />
    </Card>
  );
};
