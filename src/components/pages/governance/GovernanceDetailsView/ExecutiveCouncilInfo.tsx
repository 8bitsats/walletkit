import { AddressLink } from "../../../common/AddressLink";
import { AttributeList } from "../../../common/AttributeList";
import { Card } from "../../../common/governance/Card";
import { HelperCard } from "../../../common/HelperCard";
import { ExternalLink } from "../../../common/typography/ExternalLink";
import { useExecutiveCouncil } from "../hooks/useExecutiveCouncil";

export const ExecutiveCouncilInfo: React.FC = () => {
  const { ecWallet } = useExecutiveCouncil();

  return (
    <Card title="Executive Council" tw="pb-2">
      <div tw="px-5 my-5">
        <HelperCard>
          <p>
            All members of the Executive Council may execute transactions that
            have been approved by governance and have surpassed the timelock.
          </p>
          <ExternalLink
            tw="mt-2"
            href="https://docs.tribeca.so/voting-escrow/recommended#executive-council"
          >
            Learn more
          </ExternalLink>
        </HelperCard>
      </div>
      <AttributeList
        attributes={{
          Key: ecWallet.data?.accountId,
          Members: (
            <div tw="flex flex-col gap-1 items-end">
              {ecWallet.data?.accountInfo.data.owners.map((owner) => (
                <AddressLink key={owner.toString()} address={owner} showCopy />
              ))}
            </div>
          ),
        }}
      />
    </Card>
  );
};
