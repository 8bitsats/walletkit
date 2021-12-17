import { useParsedAccountData, useSail } from "@saberhq/sail";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../../contexts/sdk";
import { gokiTXLink, tsToDate } from "../../../../../../utils/utils";
import { AsyncButton } from "../../../../../common/AsyncButton";
import { Card } from "../../../../../common/governance/Card";
import { ExternalLink } from "../../../../../common/typography/ExternalLink";
import {
  parseGokiTransaction,
  useExecutiveCouncil,
} from "../../../hooks/useExecutiveCouncil";
import { useGovernor } from "../../../hooks/useGovernor";
import type { ProposalInfo } from "../../../hooks/useProposals";

interface Props {
  proposal: ProposalInfo;
  onActivate: () => void;
}

export const ProposalExecute: React.FC<Props> = ({
  proposal,
  onActivate,
}: Props) => {
  const { governorW, smartWallet } = useGovernor();
  const { sdkMut } = useSDK();
  const { handleTX } = useSail();
  const { ecWallet, isMemberOfEC } = useExecutiveCouncil();
  const { data: gokiTransactionData } = useParsedAccountData(
    proposal.proposalData.queuedTransaction,
    parseGokiTransaction
  );

  if (!isMemberOfEC || !gokiTransactionData) {
    return <></>;
  }

  const votingEndedAt = tsToDate(proposal.proposalData.queuedAt);

  return (
    <Card title="Execute Proposal">
      <div tw="px-7 py-4 text-sm">
        <p tw="mb-4">
          The proposal was queued on {votingEndedAt.toLocaleString()}.
        </p>
        <ExternalLink
          tw="mb-4"
          href={gokiTXLink(gokiTransactionData.accountInfo.data)}
        >
          View on Goki
        </ExternalLink>
        <AsyncButton
          disabled={!governorW || !ecWallet.data}
          size="md"
          variant="primary"
          onClick={async () => {
            invariant(governorW && sdkMut && smartWallet && ecWallet.data);
            const sw = await sdkMut.loadSmartWallet(ecWallet.data.accountId);
            const [invoker] = await sw.findOwnerInvokerAddress(0);
            const tx = await sw.ownerInvokeInstruction({
              instruction: sdkMut.programs.SmartWallet.instruction.approve({
                accounts: {
                  smartWallet: smartWallet,
                  transaction: proposal.proposalData.queuedTransaction,
                  owner: invoker,
                },
              }),
              index: 0,
            });
            const { pending, success } = await handleTX(tx, "Approve Proposal");
            if (!pending || !success) {
              return;
            }
            await pending.wait();

            const executeTX = await (
              await sdkMut.loadSmartWallet(smartWallet)
            ).executeTransaction({
              transactionKey: proposal.proposalData.queuedTransaction,
              owner: invoker,
            });
            const executeIX = executeTX.instructions[0];
            invariant(executeIX, "executed");
            const executeInvoke = await sw.ownerInvokeInstruction({
              instruction: executeIX,
              index: 0,
            });

            const ex = await handleTX(executeInvoke, "Execute Proposal");
            if (!ex.pending || !ex.success) {
              return;
            }
            await ex.pending.wait();
            onActivate();
          }}
        >
          Execute Proposal
        </AsyncButton>
      </div>
    </Card>
  );
};
