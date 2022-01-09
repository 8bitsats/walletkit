import {
  findEpochGaugeVoterAddress,
  findGaugeVoterAddress,
} from "@quarryprotocol/gauge";
import { FaExclamationCircle } from "react-icons/fa";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
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

  const isDirty =
    gaugeVoter &&
    (!epochGaugeVoter ||
      !gaugeVoter.accountInfo.data.weightChangeSeqno.eq(
        epochGaugeVoter.accountInfo.data.weightChangeSeqno
      ));

  return (
    <Card
      titleStyles={tw`flex items-center justify-between`}
      title={
        <>
          <span>Your Gauge Votes</span>
          {isDirty && (
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
              title: "Edit gauges",
              href: `${path}/gauges/weights`,
            }
          : undefined
      }
    >
      {!sdkMut ? (
        <EmptyStateConnectWallet />
      ) : hasNoGauges ? (
        <EmptyState title="You don't have any gauges.">
          <Link to={`${path}/gauges/weights`}>
            <Button variant="outline">Edit Gauges</Button>
          </Link>
        </EmptyState>
      ) : (
        <div tw="text-sm w-full whitespace-nowrap overflow-x-auto">
          <TableCardBody
            head={
              <tr>
                <th>Gauge</th>
                <th>
                  {isDirty ? (
                    <div tw="flex items-center gap-2">
                      <span>Your Votes</span>
                      <MouseoverTooltip text="Your votes have yet to be committed. Please click the 'Sync' button to the right.">
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