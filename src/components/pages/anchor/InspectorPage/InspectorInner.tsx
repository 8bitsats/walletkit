import type { Message } from "@solana/web3.js";

import { InstructionsSection } from "./InstructionsSection";
import { SimulationSection } from "./SimulationSection";
import { TransactionOverview } from "./TransactionOverview";

interface Props {
  message: Message;
}

export const InspectorInner: React.FC<Props> = ({ message }: Props) => {
  return (
    <div tw="flex flex-col gap-8">
      <TransactionOverview message={message} />
      <SimulationSection message={message} />
      <InstructionsSection message={message} />
    </div>
  );
};
