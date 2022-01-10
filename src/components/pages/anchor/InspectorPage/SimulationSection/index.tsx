import type { Message } from "@solana/web3.js";
import { FaSpinner } from "react-icons/fa";
import tw from "twin.macro";

import { Button } from "../../../../common/Button";
import { Card } from "../../../../common/governance/Card";
import { useSimulator } from "../useSimulator";
import { AccountsDiff } from "./AccountsDiff";
import { TransactionSimulation } from "./TransactionSimulation";

interface Props {
  message: Message;
}

export const SimulationSection: React.FC<Props> = ({ message }: Props) => {
  const {
    simulate,
    simulating,
    simulationLogs: logs,
    simulationError,
    response,
  } = useSimulator(message);
  if (simulating) {
    return (
      <Card title="Transaction Simulation">
        <div tw="w-full px-8 py-4 flex flex-col items-center">
          <div tw="text-white mx-auto flex items-center gap-2">
            <FaSpinner tw="animate-spin" />
            Simulating
          </div>
        </div>
      </Card>
    );
  } else if (!logs) {
    return (
      <Card
        titleStyles={tw`w-full flex items-center justify-between`}
        title={
          <>
            <h3>Transaction Simulation</h3>
            <Button variant="outline" onClick={simulate}>
              Simulate
            </Button>
          </>
        }
      >
        <div tw="px-8 py-4 text-sm w-full">
          <div tw="prose prose-light prose-sm max-w-full">
            {simulationError ? (
              <>
                Failed to run simulation:
                <span tw="text-accent ml-2">{simulationError}</span>
              </>
            ) : (
              <ul>
                <li>
                  Simulation is free and will run this transaction against the
                  latest confirmed ledger state.
                </li>
                <li>
                  No state changes will be persisted and all signature checks
                  will be disabled.
                </li>
              </ul>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <TransactionSimulation
        message={message}
        logs={logs}
        simulate={simulate}
      />
      {response && !response.err && (
        <AccountsDiff message={message} response={response} />
      )}
    </>
  );
};
