import { VoteSide } from "@tribecahq/tribeca-sdk";
import { sum } from "lodash";
import invariant from "tiny-invariant";
import tw, { css } from "twin.macro";

import { FORMAT_VOTE_PERCENT } from "../../../../../../utils/format";
import { HelperCard } from "../../../../../common/HelperCard";
import { Textarea } from "../../../../../common/inputs/InputText";
import { Meter } from "../../../../../common/Meter";
import type { ProposalInfo } from "../../../hooks/useProposals";
import { sideColor } from "../../../utils/voting";
import { VOTE_SIDE_LABEL } from "../VotesCard";

interface Props {
  proposal: ProposalInfo;

  side: VoteSide | null;
  setSide: (side: VoteSide) => void;
  reason: string;
  setReason: (reason: string) => void;
}

export const VoteSelectContents: React.FC<Props> = ({
  proposal,
  side,
  setSide,
  reason,
  setReason,
}: Props) => {
  const allVotes = (["forVotes", "againstVotes", "abstainVotes"] as const).map(
    (vote) => proposal.proposalData[vote].toNumber()
  );
  const totalVotes = sum(allVotes);
  return (
    <div tw="grid gap-4">
      <div tw="flex flex-col items-center text-white font-semibold">
        <h2>Your Ballot for Proposal #{proposal.index}</h2>
      </div>
      <HelperCard variant="muted">
        <p>Select one of the options below to cast your vote.</p>
      </HelperCard>
      <div tw="w-full flex flex-col gap-4 text-sm">
        {([VoteSide.For, VoteSide.Against, VoteSide.Abstain] as const).map(
          (voteSide, i) => {
            const myVotes = allVotes[i];
            invariant(typeof myVotes === "number");
            const percent = FORMAT_VOTE_PERCENT.format(
              totalVotes === 0 ? 0 : myVotes / totalVotes
            );
            return (
              <button
                tw="flex items-center gap-4 px-5 py-4 border rounded border-warmGray-600 transition-all"
                key={voteSide}
                css={[
                  side === voteSide && {
                    borderColor: sideColor(voteSide),
                  },
                ]}
                onClick={() => setSide(voteSide)}
              >
                <div>
                  <div css={[tw`border border-gray-500`, tw`w-6 h-6`]}>
                    <svg
                      tw="w-full h-full"
                      css={[
                        css`
                          stroke-width: 15px;
                          fill: none;
                          & > path {
                            stroke: ${sideColor(voteSide)};
                          }
                        `,
                        side === voteSide &&
                          css`
                            & > path {
                              stroke-dashoffset: 0;
                              transition: stroke-dashoffset 0.1s ease-in 0s;
                            }
                          `,
                      ]}
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {voteSide === VoteSide.For ? (
                        <path
                          d="M 10 50 L 40 86 L 90 10"
                          strokeDasharray="140"
                          strokeDashoffset="140"
                        ></path>
                      ) : (
                        <>
                          <path
                            d="M 10 10 L 90 90"
                            strokeDasharray="113"
                            strokeDashoffset="113"
                          ></path>
                          <path
                            d="M 90 10 L 10 90"
                            strokeDasharray="113"
                            strokeDashoffset="113"
                          ></path>
                        </>
                      )}
                    </svg>
                  </div>
                </div>
                <div tw="flex flex-col gap-2 flex-grow">
                  <div tw="w-full flex items-center justify-between">
                    <div tw="text-white font-medium">
                      {VOTE_SIDE_LABEL[voteSide]}
                    </div>
                    <div tw="text-warmGray-400 font-medium">{percent}</div>
                  </div>
                  <Meter
                    tw="w-full"
                    value={myVotes}
                    max={totalVotes === 0 ? 1 : totalVotes}
                    barColor={sideColor(voteSide)}
                  />
                </div>
              </button>
            );
          }
        )}
      </div>
      <div tw="mt-8">
        <label htmlFor="reason" tw="flex flex-col gap-2">
          <span tw="font-medium text-white text-sm">
            Add Reason (max 200 characters)
          </span>
          <Textarea
            id="reason"
            tw="resize-none h-auto"
            maxLength={200}
            placeholder="Tell others why you are voting this way"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};
