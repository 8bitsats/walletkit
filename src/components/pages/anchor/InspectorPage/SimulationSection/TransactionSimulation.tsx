import type { InstructionLogs } from "@saberhq/solana-contrib";
import type { Message } from "@solana/web3.js";
import tw from "twin.macro";

import { Button } from "../../../../common/Button";
import { Card } from "../../../../common/governance/Card";
import { ProgramLogs } from "../../../../common/program/ProgramLogs";

interface Props {
  simulate: () => void;
  message: Message;
  logs: InstructionLogs[];
}

export const TransactionSimulation: React.FC<Props> = ({
  simulate,
  message,
  logs,
}: Props) => {
  return (
    <Card
      titleStyles={tw`w-full flex items-center justify-between`}
      title={
        <>
          <h3>Transaction Simulation</h3>
          <Button variant="outline" onClick={simulate}>
            Retry
          </Button>
        </>
      }
    >
      <ProgramLogs message={message} logs={logs} />
    </Card>
  );
};
