import { useSail } from "@saberhq/sail";
import BN from "bn.js";
import invariant from "tiny-invariant";

import { AsyncButton } from "../../../../../common/AsyncButton";
import { Card } from "../../../../../common/governance/Card";
import { useGovernor } from "../../../hooks/useGovernor";
import type { ProposalInfo } from "../../../hooks/useProposals";

interface Props {
  proposal: ProposalInfo;
  onActivate: () => void;
}

export const ProposalQueue: React.FC<Props> = ({
  proposal,
  onActivate,
}: Props) => {
  const { governorW } = useGovernor();
  const { handleTX } = useSail();

  const votingEndedAt = new Date(
    proposal.proposalData.votingEndsAt.toNumber() * 1_000
  );

  return (
    <Card title="Proposal Passed">
      <div tw="px-7 py-4 text-sm">
        <p tw="mb-4">
          The proposal passed successfully on {votingEndedAt.toLocaleString()}.
        </p>
        <AsyncButton
          disabled={!governorW}
          size="md"
          variant="primary"
          onClick={async () => {
            invariant(governorW);
            const tx = await governorW.queueProposal({
              index: new BN(proposal.index),
            });
            const { pending, success } = await handleTX(tx, "Queue Proposal");
            if (!pending || !success) {
              return;
            }
            await pending.wait();
            onActivate();
          }}
        >
          Queue Proposal
        </AsyncButton>
      </div>
    </Card>
  );
};
