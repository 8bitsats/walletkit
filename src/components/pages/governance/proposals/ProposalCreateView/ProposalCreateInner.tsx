import { extractErrorMessage } from "@saberhq/sail";
import { Transaction } from "@solana/web3.js";
import { useMemo, useState } from "react";

import { Button } from "../../../../common/Button";
import { HelperCard } from "../../../../common/HelperCard";
import { InputText, Textarea } from "../../../../common/inputs/InputText";
import { useGovernor, useGovWindowTitle } from "../../hooks/useGovernor";
import { ProposalConfirmModal } from "./ProposalConfirmationModal";
import { ProposalTXForm } from "./ProposalTXForm";

export const ProposalCreateInner: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [txRaw, setTxRaw] = useState<string>("");
  const [theError, setError] = useState<string | null>(null);
  const { minActivationThreshold } = useGovernor();
  useGovWindowTitle(`Create Proposal`);

  const { tx, error: parseError } = useMemo(() => {
    try {
      const buffer = Buffer.from(txRaw, "base64");
      const tx = Transaction.from(buffer);
      if (tx.instructions.length === 0) {
        return { error: "Transaction cannot be empty" };
      }
      return { tx };
    } catch (e) {
      return {
        error: extractErrorMessage(e),
      };
    }
  }, [txRaw]);

  const error = theError ?? parseError;

  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  return (
    <>
      <ProposalConfirmModal
        isOpen={showConfirm}
        onDismiss={() => {
          setShowConfirm(false);
        }}
        proposal={{
          title,
          description,
          instructions: tx?.instructions ?? [],
        }}
      />
      <div tw="grid gap-4 px-7 py-6">
        <HelperCard variant="muted">
          <div tw="leading-loose">
            <p tw="text-white mb-2">You are creating a proposal draft.</p>
            <p>
              If activated by a a DAO member with at least{" "}
              <strong>{minActivationThreshold?.formatUnits()}</strong>, the
              members of the DAO may vote to execute or reject the proposal.
            </p>
          </div>
        </HelperCard>
        <label tw="flex flex-col gap-1" htmlFor="title">
          <span tw="text-sm">Title (max 140 characters)</span>
          <InputText
            id="title"
            placeholder="A short summary of your proposal."
            value={title}
            maxLength={140}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label tw="flex flex-col gap-1" htmlFor="description">
          <span tw="text-sm">Description</span>
          <Textarea
            id="description"
            tw="h-auto"
            rows={4}
            placeholder={`## Summary\nYour proposal will be formatted using Markdown.`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div tw="grid gap-2">
          <ProposalTXForm
            setError={setError}
            txRaw={txRaw}
            setTxRaw={setTxRaw}
          />
          {error && <span tw="text-red-500 text-sm">{error}</span>}
        </div>
        <Button
          type="button"
          disabled={!(tx && title && description) || !!error}
          variant="primary"
          onClick={() => {
            setShowConfirm(true);
          }}
        >
          Preview Proposal
        </Button>
      </div>
    </>
  );
};
