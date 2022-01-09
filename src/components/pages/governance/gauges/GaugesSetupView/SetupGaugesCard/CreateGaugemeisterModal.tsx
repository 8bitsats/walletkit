import { GaugeSDK } from "@quarryprotocol/gauge";
import type { OperatorData, RewarderData } from "@quarryprotocol/quarry-sdk";
import type { ParsedAccountInfo } from "@saberhq/sail";
import { useSail } from "@saberhq/sail";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../../contexts/sdk";
import { AttributeList } from "../../../../../common/AttributeList";
import { ModalInner } from "../../../../../common/Modal/ModalInner";
import { useGovernor } from "../../../hooks/useGovernor";

interface Props {
  operator: ParsedAccountInfo<OperatorData>;
  rewarder: ParsedAccountInfo<RewarderData>;
}

export const CreateGaugemeisterModal: React.FC<Props> = ({
  operator,
  rewarder,
}: Props) => {
  const { handleTX } = useSail();
  const { lockerData } = useGovernor();
  const { sdkMut } = useSDK();
  const create = async () => {
    invariant(sdkMut && lockerData);
    const gauge = GaugeSDK.load({ provider: sdkMut.provider });
    const { gaugemeister, tx: createGMTX } =
      await gauge.gauge.createGaugemeister({
        firstEpochStartsAt: new Date(Date.now() + 1_000 * 30),
        locker: lockerData.accountId,
        operator: operator.accountId,
      });

    const { pending, success } = await handleTX(
      createGMTX,
      `Create Gaugemeister at ${gaugemeister.toString()}`
    );
    if (!pending || !success) {
      return;
    }
    await pending.wait();
  };

  return (
    <ModalInner
      title="Create Gaugemeister"
      buttonProps={{
        onClick: create,
        variant: "primary",
        children: "Create Gaugemeister",
      }}
    >
      <div tw="px-8 flex flex-col items-center">
        <p tw="mb-4 text-sm">Set up your gauge system.</p>
        <AttributeList
          attributes={{
            Rewarder: rewarder.accountId,
            Operator: operator.accountId,
          }}
        />
      </div>
    </ModalInner>
  );
};
