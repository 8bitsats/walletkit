import formatDistance from "date-fns/formatDistance";
import { FaExternalLinkAlt } from "react-icons/fa";

import { LoadingPage } from "../../../../common/LoadingPage";
import { TXLink } from "../../../../common/TXLink";
import { useTransaction } from "../context";
import { TXEvent } from "./TXEvent";

export const TXActivity: React.FC = () => {
  const { historicalTXs } = useTransaction();
  const txsWithEvents = historicalTXs?.flatMap((tx) =>
    tx.events.map((event) => ({ tx, event }))
  );
  return (
    <div>
      <h2 tw="mt-8 text-gray-800 font-semibold mb-4">Activity</h2>
      {txsWithEvents ? (
        <div tw="text-xs">
          {txsWithEvents.map(({ tx, event }) => {
            return (
              <div key={tx.sig} tw="text-gray-500 flex items-center gap-4">
                <span>
                  <TXEvent event={event} />
                </span>
                <span>
                  {formatDistance(
                    new Date(event.data.timestamp.toNumber() * 1_000),
                    new Date(),
                    { addSuffix: true }
                  )}
                </span>
                <TXLink txSig={tx.sig} tw="text-primary hover:text-primary-300">
                  <FaExternalLinkAlt />
                </TXLink>
              </div>
            );
          })}
        </div>
      ) : (
        <LoadingPage />
      )}
    </div>
  );
};
