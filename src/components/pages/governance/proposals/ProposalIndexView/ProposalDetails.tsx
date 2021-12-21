import { ProposalState } from "@tribecahq/tribeca-sdk";
import ReactMarkdown from "react-markdown";

import { Alert } from "../../../../common/Alert";
import { Card } from "../../../../common/governance/Card";
import { IXSummary } from "../../../../common/governance/IXSummary";
import { TransactionPreviewLink } from "../../../../common/governance/TransactionPreviewLink";
import { useGovernor } from "../../hooks/useGovernor";
import type { ProposalInfo } from "../../hooks/useProposals";

interface Props {
  className?: string;
  proposalInfo?: ProposalInfo | null;
}

export const ProposalDetails: React.FC<Props> = ({
  className,
  proposalInfo,
}: Props) => {
  const { minActivationThreshold } = useGovernor();

  const description = proposalInfo?.proposalMetaData?.descriptionLink ?? "";
  return (
    <Card className={className} title="Details">
      <div>
        {proposalInfo?.proposalData.instructions.map((ix, i) => (
          <div key={i} tw="px-7 py-5 border-b border-warmGray-800 flex">
            <div tw="w-10 text-warmGray-600 font-medium">{i + 1}</div>
            <div tw="text-white">
              <IXSummary instruction={ix} />
            </div>
          </div>
        ))}
      </div>
      <div tw="p-7">
        {proposalInfo && proposalInfo.proposalData.instructions.length > 0 && (
          <TransactionPreviewLink
            instructions={proposalInfo.proposalData.instructions}
          />
        )}
        {proposalInfo?.state === ProposalState.Draft && (
          <Alert type="info" tw="my-6">
            <h2>This proposal is a draft.</h2>
            <p>
              The DAO cannot vote on this proposal until a member with at least{" "}
              <strong>{minActivationThreshold?.formatUnits()}</strong> activates
              it.
            </p>
          </Alert>
        )}

        <div tw="prose prose-light mt-4">
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
      </div>
    </Card>
  );
};
