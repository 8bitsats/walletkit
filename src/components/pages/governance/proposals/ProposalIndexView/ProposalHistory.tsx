import { ZERO } from "@quarryprotocol/quarry-sdk";
import type { ProposalData } from "@tribecahq/tribeca-sdk";
import type BN from "bn.js";

import { Card } from "../../../../common/governance/Card";
import type { ProposalInfo } from "../../hooks/useProposals";

interface Props {
  className?: string;
  proposalInfo?: ProposalInfo | null;
}

interface ProposalEvent {
  title: string;
  date: Date;
}

const makeDate = (num: BN): Date => new Date(num.toNumber() * 1_000);

const extractEvents = (proposalData: ProposalData): ProposalEvent[] => {
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
    events.push({ title: "Queued", date: makeDate(proposalData.queuedAt) });
  }
  return events.sort((a, b) => (a.date < b.date ? -1 : 1));
};

export const ProposalHistory: React.FC<Props> = ({
  className,
  proposalInfo,
}: Props) => {
  const events = proposalInfo ? extractEvents(proposalInfo.proposalData) : [];
  return (
    <Card className={className} title="Proposal History">
      <div tw="px-7 py-4 grid gap-4">
        {events.map(({ title, date }, i) => (
          <div key={i}>
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
          </div>
        ))}
      </div>
    </Card>
  );
};
