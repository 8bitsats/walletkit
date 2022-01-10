import { useAccountData, usePubkey } from "@saberhq/sail";
import { useParams } from "react-router-dom";

import { ContentLoader } from "../../../common/ContentLoader";
import { Card } from "../../../common/governance/Card";
import { AnchorLayout } from "../../../layout/AnchorLayout";
import { OverviewCard } from "./OverviewCard";

export const AddressPage: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const addressKey = usePubkey(address);
  const { data } = useAccountData(addressKey);

  return (
    <AnchorLayout title="Account">
      {data ? (
        <div tw="flex flex-col gap-8">
          <OverviewCard account={data} />
        </div>
      ) : data === undefined ? (
        <Card title="Account">
          <div tw="px-8 py-5">
            <ContentLoader tw="h-8 w-40" />
          </div>
        </Card>
      ) : (
        <Card title="Not found">
          <p>
            Account <code>{address}</code> not found.
          </p>
        </Card>
      )}
    </AnchorLayout>
  );
};
