import type { SmartWalletTransactionData } from "@gokiprotocol/client";
import { ZERO } from "@quarryprotocol/quarry-sdk";
import type { ParsedAccountDatum } from "@saberhq/sail";
import { useParsedAccountData } from "@saberhq/sail";
import type { ProposalData } from "@tribecahq/tribeca-sdk";
import {
  getProposalState,
  PROPOSAL_STATE_LABELS,
  ProposalState,
} from "@tribecahq/tribeca-sdk";
import BN from "bn.js";
import { startCase } from "lodash";
import { FaExternalLinkAlt } from "react-icons/fa";

import { decodeTransaction } from "../../../../../hooks/useSmartWallet";
import { Card } from "../../../../common/governance/Card";
import type { ProposalInfo } from "../../hooks/useProposals";

interface Props {
  className?: string;
  proposalInfo?: ProposalInfo | null;
}

interface ProposalEvent {
  title: string;
  date: Date;
  link?: string | null;
}

export const makeDate = (num: BN): Date => new Date(num.toNumber() * 1_000);

const extractEvents = (
  proposalData: ProposalData,
  tx: ParsedAccountDatum<SmartWalletTransactionData>
): ProposalEvent[] => {
  const events: ProposalEvent[] = [];
  if (!proposalData.canceledAt.eq(ZERO)) {
    events.push({ title: "Canceled", date: makeDate(proposalData.canceledAt) });
  }
  if (!proposalData.activatedAt.eq(ZERO)) {
    events.push({
      title: "Activated",
      date: makeDate(proposalData.activatedAt),
    });
  }
  if (!proposalData.createdAt.eq(ZERO)) {
    events.push({ title: "Created", date: makeDate(proposalData.createdAt) });
  }
  if (!proposalData.queuedAt.eq(ZERO)) {
    events.push({
      title: "Queued",
      date: makeDate(proposalData.queuedAt),
      link: tx
        ? `https://beta.goki.so/#/wallets/${tx.accountInfo.data.smartWallet.toString()}/tx/${tx.accountInfo.data.index.toString()}`
        : null,
    });
  }
  if (
    !proposalData.votingEndsAt.eq(ZERO) &&
    makeDate(proposalData.votingEndsAt) <= new Date()
  ) {
    // TODO: update quorum
    const state = getProposalState({ proposalData });
    events.push({
      title: startCase(
        PROPOSAL_STATE_LABELS[
          state === ProposalState.Queued ? ProposalState.Succeeded : state
        ]
      ),
      date: makeDate(proposalData.votingEndsAt),
    });
  }
  if (tx?.accountInfo.data.executedAt.gt(new BN(0))) {
    events.push({
      title: "Executed",
      date: makeDate(tx.accountInfo.data.executedAt),
      link: tx
        ? `https://beta.goki.so/#/wallets/${tx.accountInfo.data.smartWallet.toString()}/tx/${tx.accountInfo.data.index.toString()}`
        : null,
    });
  }
  return events.sort((a, b) => (a.date < b.date ? -1 : 1));
};

export const ProposalHistory: React.FC<Props> = ({
  className,
  proposalInfo,
}: Props) => {
  const { data: tx } = useParsedAccountData(
    !proposalInfo?.proposalData.queuedAt.eq(ZERO)
      ? proposalInfo?.proposalData.queuedTransaction
      : null,
    decodeTransaction
  );
  const events = proposalInfo
    ? extractEvents(proposalInfo.proposalData, tx)
    : [];
  return (
    <Card className={className} title="Proposal History">
      <div tw="px-7 py-4 grid gap-4">
        {events.map(({ title, date, link }, i) => (
          <div key={i}>
            <div tw="flex items-center justify-between">
              <div tw="flex flex-col text-sm">
                <span tw="text-white">{title}</span>
                <span tw="text-warmGray-600 text-xs">
                  {date.toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  &mdash; {date.toLocaleTimeString()}
                </span>
              </div>
              {link && (
                <a
                  href={link}
                  tw="text-primary hover:text-white transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaExternalLinkAlt />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
