import {
  findEpochGaugeVoterAddress,
  findGaugeVoterAddress,
} from "@quarryprotocol/gauge";
import { ZERO } from "@quarryprotocol/quarry-sdk";
import BN from "bn.js";
import { FaExclamationCircle } from "react-icons/fa";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";
import tw from "twin.macro";

import { useSDK } from "../../../../../../contexts/sdk";
import {
  useParsedEpochGaugeVoter,
  useParsedGaugeVoter,
} from "../../../../../../utils/parsers";
import { Button } from "../../../../../common/Button";
import { TableCardBody } from "../../../../../common/card/TableCardBody";
import { ContentLoader } from "../../../../../common/ContentLoader";
import {
  EmptyState,
  EmptyStateConnectWallet,
} from "../../../../../common/EmptyState";
import { Card } from "../../../../../common/governance/Card";
import { MouseoverTooltip } from "../../../../../common/MouseoverTooltip";
import { useUserEscrow } from "../../../hooks/useEscrow";
import { useGovernor } from "../../../hooks/useGovernor";
import { LockupTooShortTooltip } from "../../GaugesSetupView/lockupTooShortTooltip";
import { useCommitVotes } from "../../hooks/useCommitVotes";
import { useGaugemeister, useGMData } from "../../hooks/useGaugemeister";
import { useMyGauges } from "../../hooks/useMyGauges";
import { useRevertVotes } from "../../hooks/useRevertVotes";
import { UserGauge } from "./UserGauge";

export const UserGauges: React.FC = () => {
  const { path } = useGovernor();
  const { sdkMut } = useSDK();
  const { myGauges, hasNoGauges } = useMyGauges();
  const commitVotes = useCommitVotes();
  const revertVotes = useRevertVotes();

  const gaugemeister = useGaugemeister();
  const { data: gmData } = useGMData();
  const { escrow } = useUserEscrow();
  const votingEpoch = gmData
    ? gmData.accountInfo.data.currentRewardsEpoch + 1
    : null;
  const { data: epochGaugeVoterKey } = useQuery(
    ["epochGaugeVoterKey", votingEpoch],
    async () => {
      invariant(votingEpoch && gaugemeister && escrow);
      const [gaugeVoter] = await findGaugeVoterAddress(
        gaugemeister,
        escrow.escrowW.escrowKey
      );
      const [epochGaugeVoter] = await findEpochGaugeVoterAddress(
        gaugeVoter,
        votingEpoch
      );
      return { gaugeVoter, epochGaugeVoter };
    },
    { enabled: !!(votingEpoch !== null && escrow && gaugemeister) }
  );
  const { data: gaugeVoter } = useParsedGaugeVoter(
    epochGaugeVoterKey?.gaugeVoter
  );
  const { data: epochGaugeVoter } = useParsedEpochGaugeVoter(
    epochGaugeVoterKey?.epochGaugeVoter
  );

  const expectedPower =
    gmData && escrow
      ? escrow.calculateVotingPower(
          gmData.accountInfo.data.nextEpochStartsAt.toNumber()
        )
      : null;
  const isVotesChanged =
    gaugeVoter &&
    epochGaugeVoter &&
    expectedPower &&
    !expectedPower
      .sub(epochGaugeVoter.accountInfo.data.allocatedPower)
      .abs()
      // rounding error can be up to the number of gauges
      .lt(new BN(myGauges.length));

  const isDirty =
    gaugeVoter &&
    (!epochGaugeVoter ||
      !gaugeVoter.accountInfo.data.weightChangeSeqno.eq(
        epochGaugeVoter.accountInfo.data.weightChangeSeqno
      ));

  const showSyncButton = isVotesChanged || isDirty;

  const lockupTooShort = escrow?.escrow.escrowEndsAt.lt(
    gmData?.accountInfo.data.nextEpochStartsAt ?? ZERO
  );

  return (
    <Card
      titleStyles={tw`flex items-center justify-between`}
      title={
        <>
          <div tw="flex">
            <span>Your Gauge Votes</span>
            {lockupTooShort && <LockupTooShortTooltip />}
          </div>
          {showSyncButton && (
            <Button
              onClick={async () => {
                await revertVotes();
                await commitVotes();
              }}
              variant="outline"
            >
              Sync
            </Button>
          )}
        </>
      }
      link={
        sdkMut
          ? {
              title: `${hasNoGauges ? "Cast Votes" : "Edit gauges"}`,
              href: `${path}/gauges/weights`,
            }
          : undefined
      }
    >
      {!sdkMut ? (
        <EmptyStateConnectWallet />
      ) : hasNoGauges ? (
        <EmptyState title="You haven't voted on any gauges yet." />
      ) : (
        <div tw="text-sm w-full whitespace-nowrap overflow-x-auto">
          <TableCardBody
            head={
              <tr>
                <th>Gauge</th>
                <th>
                  {isDirty || isVotesChanged ? (
                    <div tw="flex items-center gap-2">
                      <span>Your Votes</span>
                      <MouseoverTooltip
                        text={
                          isDirty
                            ? "Your votes have yet to be committed. Please click the 'Sync' button to the right."
                            : "Your voting escrow balance has changed. Please click the 'Sync' button to the right to maximize your voting power."
                        }
                      >
                        <FaExclamationCircle tw="text-yellow-500" />
                      </MouseoverTooltip>
                    </div>
                  ) : (
                    <>Your Votes</>
                  )}
                </th>
                <th>Weight</th>
              </tr>
            }
          >
            {myGauges.length === 0 ? (
              <tr>
                <td>
                  <ContentLoader tw="w-20 h-4" />
                </td>
                <td>
                  <ContentLoader tw="w-16 h-4" />
                </td>
                <td>
                  <ContentLoader tw="w-8 h-4" />
                </td>
              </tr>
            ) : (
              myGauges.map((gaugeVote, i) => (
                <UserGauge
                  css={[
                    i !== myGauges.length - 1 &&
                      tw`border-b border-b-warmGray-800`,
                  ]}
                  key={gaugeVote.key.toString()}
                  gaugeVote={gaugeVote}
                />
              ))
            )}
          </TableCardBody>
        </div>
      )}
    </Card>
  );
};
