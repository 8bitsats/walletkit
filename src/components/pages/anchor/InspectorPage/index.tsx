import { Message } from "@solana/web3.js";
import { useMemo } from "react";
import { useLocation } from "react-router";

import { AnchorLayout } from "../../../layout/AnchorLayout";
import { InstructionsSection } from "./InstructionsSection";
import { SimulationSection } from "./SimulationSection";
import { TransactionOverview } from "./TransactionOverview";

export const MIN_MESSAGE_LENGTH =
  3 + // header
  1 + // accounts length
  32 + // accounts, must have at least one address for fees
  32 + // recent blockhash
  1; // instructions length

export const InspectorPage: React.FC = () => {
  const location = useLocation();
  const { raw, message } = useMemo(() => {
    const urlParams = new URLSearchParams(location.search);
    const messageRaw = urlParams.get("message");
    if (!messageRaw) {
      return { raw: null, message: null };
    }
    const raw = Buffer.from(decodeURIComponent(messageRaw), "base64");
    if (raw.length < MIN_MESSAGE_LENGTH) {
      throw new Error("message buffer is too short");
    }
    return { raw, message: Message.from(raw) };
  }, [location.search]);

  return (
    <AnchorLayout title="Transaction Inspector">
      {raw && message && (
        <div tw="flex flex-col gap-8">
          <TransactionOverview message={message} />
          <SimulationSection message={message} />
          <InstructionsSection message={message} />
        </div>
      )}
    </AnchorLayout>
  );
};
