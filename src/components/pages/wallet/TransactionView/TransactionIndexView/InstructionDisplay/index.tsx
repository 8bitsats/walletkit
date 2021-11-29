import type { ParsedInstruction } from "../../../../../../hooks/useSmartWallet";
import { IXAccounts } from "./IXAccounts";
import { IXData } from "./IXData";

interface Props {
  instruction: ParsedInstruction;
}

export const InstructionDisplay: React.FC<Props> = ({ instruction }: Props) => {
  return (
    <div tw="grid gap-4">
      <IXData instruction={instruction} />
      <IXAccounts instruction={instruction} />
    </div>
  );
};
