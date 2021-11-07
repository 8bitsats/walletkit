import type { Arrow } from "@arrowprotocol/arrow";
import type { TokenAmount } from "@saberhq/token-utils";

import { AsyncButton } from "../../../common/AsyncButton";
import { InputCash } from "../../../common/inputs/InputCash";
import { LoadingSpinner } from "../../../common/LoadingSpinner";

interface Props {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string | null;
  buttonLabel: string;
  onSubmit: (sdk: Arrow) => Promise<void>;
  max?: TokenAmount;
  onMaxClick?: () => void;
}

export const ActionForm: React.FC<Props> = ({
  value,
  onChange,
  errorMessage,
  onSubmit,
  buttonLabel,
  max,
  onMaxClick,
}: Props) => {
  return (
    <div tw="grid gap-6">
      <InputCash value={value} onChange={onChange} />
      <div tw="font-sans mx-auto">{max?.token.name}</div>
      <div tw="mx-auto text-secondary">
        Balance:{" "}
        {max === undefined ? (
          <LoadingSpinner />
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onMaxClick?.();
            }}
            tw="text-DEFAULT underline hover:text-brand"
          >
            {max.formatUnits()}
          </button>
        )}
      </div>
      <AsyncButton
        size="md"
        variant="primary"
        disabled={!!errorMessage}
        onClick={async (sdkMut) => {
          await onSubmit(sdkMut);
        }}
      >
        {errorMessage ?? buttonLabel}
      </AsyncButton>
    </div>
  );
};
