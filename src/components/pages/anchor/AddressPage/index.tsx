import { useAccountData, usePubkey } from "@saberhq/sail";
import { useParams } from "react-router-dom";

import { useIDL } from "../../../../hooks/useIDLs";
import { ContentLoader } from "../../../common/ContentLoader";
import { Card } from "../../../common/governance/Card";
import { AnchorLayout } from "../../../layout/AnchorLayout";
import { AnchorDataCard } from "./AnchorDataCard";
import { OverviewCard } from "./OverviewCard";

export const AddressPage: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const addressKey = usePubkey(address);
  const { data } = useAccountData(addressKey);
  const { data: ownerIDL } = useIDL(data?.accountInfo.owner);

  return (
    <AnchorLayout title="Account">
      {data ? (
        <div tw="flex flex-col gap-8">
          <OverviewCard account={data} />
          {ownerIDL?.idl && (
            <AnchorDataCard account={data} idl={ownerIDL.idl} />
          )}
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
