import { useSail } from "@saberhq/sail";
import { Link } from "react-router-dom";
import invariant from "tiny-invariant";

import { Button } from "../../../../../common/Button";
import { Card } from "../../../../../common/governance/Card";
import { LoadingPage } from "../../../../../common/LoadingPage";
import { useUserEscrow } from "../../../hooks/useEscrow";
import { useGovernor } from "../../../hooks/useGovernor";
import type { ProposalInfo } from "../../../hooks/useProposals";
import { formatDurationSeconds } from "../../../locker/LockerIndexView/LockEscrowModal";

interface Props {
  proposal: ProposalInfo;
  onActivate: () => void;
}

export const ProposalActivate: React.FC<Props> = ({
  proposal,
  onActivate,
}: Props) => {
  const { minActivationThreshold, path, governorData } = useGovernor();
  const { data: escrow, veBalance } = useUserEscrow();
  const { handleTX } = useSail();
  const { governorW } = useGovernor();

  const earliestActivationTime = governorData
    ? new Date(
        proposal.proposalData.createdAt
          .add(governorData.accountInfo.data.params.votingDelay)
          .toNumber() * 1_000
      )
    : null;

  return (
    <Card title="Actions">
      <div tw="px-7 py-4 text-sm">
        <div tw="flex flex-col gap-2">
          {governorW &&
            proposal.proposalData.proposer.equals(
              governorW.provider.wallet.publicKey
            ) && (
              <div>
                <Button
                  variant="danger"
                  tw="dark:text-white"
                  onClick={async () => {
                    const tx = governorW.cancelProposal({
                      proposal: proposal.proposalKey,
                    });
                    const handle = await handleTX(tx, "Cancel Proposal");
                    if (!handle.pending) {
                      return;
                    }
                    await handle.pending.wait();
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          <div>
            {!earliestActivationTime || !governorData ? (
              <LoadingPage />
            ) : earliestActivationTime > new Date() ? (
              <div tw="flex flex-col gap-2">
                <p>
                  You must wait{" "}
                  {formatDurationSeconds(
                    governorData.accountInfo.data.params.votingDelay.toNumber()
                  )}{" "}
                  for this proposal to be activated.
                </p>
                <p>
                  The proposal may be activated at{" "}
                  {earliestActivationTime?.toLocaleString(undefined, {
                    timeZoneName: "short",
                  })}{" "}
                  by anyone who possesses at least{" "}
                  {minActivationThreshold?.formatUnits()}.
                </p>
              </div>
            ) : minActivationThreshold &&
              veBalance?.greaterThan(minActivationThreshold) ? (
              <Button
                disabled={!escrow}
                variant="primary"
                onClick={async () => {
                  invariant(escrow);
                  const tx = escrow.escrowW.activateProposal(
                    proposal.proposalKey
                  );
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
        </div>
      </div>
    </Card>
  );
};
