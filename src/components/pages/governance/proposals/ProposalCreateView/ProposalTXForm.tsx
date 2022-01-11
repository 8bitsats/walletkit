import { useState } from "react";

import { serializeToBase64 } from "../../../../../utils/makeTransaction";
import { Select } from "../../../../common/inputs/InputText";
import { useGovernor } from "../../hooks/useGovernor";
import { IssueTokensAction } from "./actions/IssueTokensAction";
import { Memo } from "./actions/Memo";
import { RawTX } from "./actions/RawTX";
import { UpgradeProgramForm } from "./actions/UpgradeProgramForm";

const ACTION_TYPES = [
  "Memo",
  "Issue Tokens",
  "Upgrade Program",
  "Raw Transaction (base64)",
] as const;

type ActionType = typeof ACTION_TYPES[number];

interface Props {
  setError: (error: string | null) => void;
  txRaw: string;
  setTxRaw: (txRaw: string) => void;
}

export const ProposalTXForm: React.FC<Props> = ({
  setError,
  txRaw,
  setTxRaw,
}: Props) => {
  const [actionType, setActionType] = useState<ActionType>("Memo");
  const { meta } = useGovernor();

  return (
    <div tw="grid gap-4">
      <label tw="flex flex-col gap-1" htmlFor="proposedAction">
        <span tw="text-sm">Proposed Action</span>
        <Select
          onChange={(e) => {
            setActionType(e.target.value as ActionType);
            setError(null);
            setTxRaw("");
          }}
        >
          {ACTION_TYPES.map((actionType) => {
            if (!meta?.minter && actionType === "Issue Tokens") {
              return null;
            }
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
      {actionType === "Memo" && (
        <Memo setError={setError} setTxRaw={setTxRaw} />
      )}
      {actionType === "Raw Transaction (base64)" && (
        <RawTX setError={setError} txRaw={txRaw} setTxRaw={setTxRaw} />
      )}
      {actionType === "Issue Tokens" && (
        <IssueTokensAction setError={setError} setTxRaw={setTxRaw} />
      )}
    </div>
  );
};
