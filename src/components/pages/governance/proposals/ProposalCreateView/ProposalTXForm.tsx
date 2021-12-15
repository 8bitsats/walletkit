import { useState } from "react";

import { serializeToBase64 } from "../../../../../utils/makeTransaction";
import { Select } from "../../../../common/inputs/InputText";
import { RawTX } from "./actions/RawTX";
import { UpgradeProgramForm } from "./actions/UpgradeProgramForm";

const ACTION_TYPES = ["Upgrade Program", "Raw Transaction (base64)"] as const;

type ActionType = typeof ACTION_TYPES[number];

interface Props {
  txRaw: string;
  setTxRaw: (txRaw: string) => void;
}

export const ProposalTXForm: React.FC<Props> = ({ txRaw, setTxRaw }: Props) => {
  const [actionType, setActionType] = useState<ActionType>("Upgrade Program");

  return (
    <>
      <label tw="flex flex-col gap-1" htmlFor="proposedAction">
        <span tw="text-sm">Proposed Action</span>
        <Select
          onChange={(e) => {
            setActionType(e.target.value as ActionType);
          }}
        >
          {ACTION_TYPES.map((actionType) => {
            return (
              <option key={actionType} value={actionType}>
                {actionType}
              </option>
            );
          })}
        </Select>
      </label>
      {actionType === "Upgrade Program" && (
        <UpgradeProgramForm
          onSelect={(tx) => {
            setTxRaw(serializeToBase64(tx));
          }}
        />
      )}
      {actionType === "Raw Transaction (base64)" && (
        <RawTX txRaw={txRaw} setTxRaw={setTxRaw} />
      )}
    </>
  );
};
