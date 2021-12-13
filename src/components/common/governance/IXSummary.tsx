import type { ProposalInstruction } from "@tribecahq/tribeca-sdk";

import { useParsedTXInstruction } from "../../../hooks/useParsedTXInstruction";

interface Props {
  instruction: ProposalInstruction;
}

export const IXSummary: React.FC<Props> = ({ instruction }: Props) => {
  const ix = useParsedTXInstruction(instruction);
  return <>{ix.title}</>;
};
