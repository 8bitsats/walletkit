import { useSolana } from "@saberhq/use-solana";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { ContentLoader } from "../../../../common/ContentLoader";
import { Card } from "../../../../common/governance/Card";
import { AnchorLayout } from "../../../../layout/AnchorLayout";
import { InstructionsSection } from "../../InspectorPage/InstructionsSection";
import { SimulationSection } from "../../InspectorPage/SimulationSection";
import { TransactionOverview } from "../../InspectorPage/TransactionOverview";

export const TransactionInspectPage: React.FC = () => {
  const { connection } = useSolana();
  const { txid } = useParams<{ txid: string }>();
  const { data: tx, isLoading } = useQuery(["tx", txid], async () => {
    return await connection.getTransaction(txid, { commitment: "confirmed" });
  });
  const message = tx?.transaction.message;

  return (
    <AnchorLayout title="Transaction Inspector">
      {message ? (
        <div tw="flex flex-col gap-8">
          <TransactionOverview message={message} />
          <SimulationSection message={message} />
          <InstructionsSection message={message} />
        </div>
      ) : isLoading ? (
        <Card title="Transaction Overview">
          <div tw="px-8 py-5">
            <ContentLoader tw="h-8 w-40" />
          </div>
        </Card>
      ) : (
        <Card title="Not found">
          <p>
            Transaction <code>{txid}</code> not found.
          </p>
        </Card>
      )}
    </AnchorLayout>
  );
};
