import { useSail } from "@saberhq/sail";
import { Link } from "react-router-dom";
import invariant from "tiny-invariant";

import { Button } from "../../../../../common/Button";
import { Card } from "../../../../../common/governance/Card";
import { useUserEscrow } from "../../../hooks/useEscrow";
import { useGovernor } from "../../../hooks/useGovernor";
import type { ProposalInfo } from "../../../hooks/useProposals";

interface Props {
  proposal: ProposalInfo;
  onActivate: () => void;
}

export const ProposalActivate: React.FC<Props> = ({
  proposal,
  onActivate,
}: Props) => {
  const { minActivationThreshold, path } = useGovernor();
  const { data: escrow, veBalance } = useUserEscrow();
  const { handleTX } = useSail();
  return (
    <Card title="Activate Proposal">
      <div tw="px-7 py-4 text-sm">
        {minActivationThreshold &&
        veBalance?.greaterThan(minActivationThreshold) ? (
          <Button
            disabled={!escrow}
            variant="primary"
            onClick={async () => {
              invariant(escrow);
              const tx = escrow.escrowW.activateProposal(proposal.proposalKey);
              const { pending, success } = await handleTX(
                tx,
                "Activate Proposal"
              );
              if (!pending || !success) {
                return;
              }
              await pending.wait();
              onActivate();
            }}
          >
            Activate Proposal
          </Button>
        ) : (
          <div tw="flex flex-col gap-2">
            <p>
              You must have at least{" "}
              <strong>{minActivationThreshold?.formatUnits()}</strong> to
              activate this proposal for voting.
            </p>
            {veBalance ? (
              <p>You currently have {veBalance?.formatUnits()}.</p>
            ) : (
              <p>You currently don't have any tokens vote locked.</p>
            )}
            <Link to={`${path}/locker`} tw="mt-4">
              <Button>Lock Tokens</Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};
