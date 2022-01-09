import { usePubkey } from "@saberhq/sail";
import { useState } from "react";

import {
  useParsedOperator,
  useParsedRewarder,
} from "../../../../../../utils/parsers";
import { Card } from "../../../../../common/governance/Card";
import { InputText } from "../../../../../common/inputs/InputText";
import { ModalButton } from "../../../../../common/Modal/ModalButton";
import { CreateGaugemeisterModal } from "./CreateGaugemeisterModal";

export const SetupGaugesCard: React.FC = () => {
  const [rewarderKeyStr, setRewarderKeyStr] = useState<string>("");
  const rewarderKey = usePubkey(rewarderKeyStr);
  const { data: rewarder } = useParsedRewarder(rewarderKey);
  const { data: operator } = useParsedOperator(
    rewarder?.accountInfo.data.authority
  );

  const disabledReason = !rewarder
    ? "Rewarder does not exist"
    : !operator
    ? "Must be operator"
    : null;

  return (
    <Card title="Setup Gauges">
      <div tw="px-7 py-4 text-sm">
        <p tw="mb-4">
          Gauges allow DAO members to vote on where they want liquidity mining
          rewards to exist.
        </p>
        <form>
          <label tw="flex flex-col gap-1" htmlFor="title">
            <span tw="text-sm">Rewarder Key</span>
            <InputText
              id="title"
              placeholder="Your Quarry Rewarder."
              value={rewarderKeyStr}
              onChange={(e) => setRewarderKeyStr(e.target.value)}
            />
          </label>
        </form>
        <ModalButton
          buttonLabel={disabledReason ?? "Create Gaugemeister"}
          buttonProps={{
            disabled: !!disabledReason,
          }}
        >
          {operator && rewarder && (
            <CreateGaugemeisterModal rewarder={rewarder} operator={operator} />
          )}
        </ModalButton>
      </div>
    </Card>
  );
};
