import { useSolana } from "@saberhq/use-solana";
import type { Transaction } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { GiTumbleweed } from "react-icons/gi";

import { useSDK } from "../../../../../../../contexts/sdk";
import {
  useAuthorityBuffers,
  useAuthorityPrograms,
} from "../../../../../../../hooks/useAuthorityPrograms";
import { createUpgradeInstruction } from "../../../../../../../utils/instructions/upgradeable_loader/instructions";
import { makeTransaction } from "../../../../../../../utils/makeTransaction";
import { programLabel } from "../../../../../../../utils/programs";
import { AddressLink } from "../../../../../../common/AddressLink";
import { EmptyState } from "../../../../../../common/EmptyState";
import { Select } from "../../../../../../common/inputs/InputText";
import { LoadingPage } from "../../../../../../common/LoadingPage";
import { useGovernor } from "../../../../hooks/useGovernor";
import { BufferOption } from "./BufferOption";

interface Props {
  onSelect: (tx: Transaction) => void;
}

export const UpgradeProgramForm: React.FC<Props> = ({ onSelect }: Props) => {
  const { sdkMut } = useSDK();
  const { smartWallet } = useGovernor();
  const { data: buffers } = useAuthorityBuffers(smartWallet);
  const { programs } = useAuthorityPrograms(smartWallet);
  const { network } = useSolana();

  const [programID, setProgramID] = useState<PublicKey | null>(null);
  const [bufferKey, setBufferKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    if (!programID || !bufferKey || !sdkMut || !smartWallet) {
      return;
    }
    void (async () => {
      const ix = await createUpgradeInstruction({
        program: programID,
        buffer: bufferKey,
        spill: sdkMut.provider.wallet.publicKey,
        signer: smartWallet,
      });
      onSelect(makeTransaction(network, [ix]));
    })();
  }, [programID, bufferKey, network, sdkMut, onSelect, smartWallet]);

  return (
    <>
      <label tw="flex flex-col gap-1" htmlFor="upgradeBuffer">
        <span tw="text-sm">Program ID</span>
        {smartWallet ? (
          <>
            {programs?.length === 0 && (
              <EmptyState
                icon={<GiTumbleweed />}
                title="The DAO doesn't own any programs."
              >
                <div tw="text-center">
                  <p>
                    The DAO address at{" "}
                    <AddressLink address={smartWallet} showCopy /> does not own
                    any programs.
                  </p>
                  <p>
                    <a
                      tw="text-primary"
                      href="https://docs.solana.com/cli/deploy-a-program#set-a-programs-upgrade-authority"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Read the Solana Wiki to learn more about upgrade
                      authorities.
                    </a>
                  </p>
                </div>
              </EmptyState>
            )}
            <Select
              onChange={(e) => {
                setProgramID(new PublicKey(e.target.value));
              }}
            >
              <option>Select a program ID</option>
              {programs?.map((program) => {
                const { data } = program;
                if (!data) {
                  return null;
                }
                const label = programLabel(data.programID.toString());
                return (
                  <option
                    key={data.programID.toString()}
                    value={data.programID.toString()}
                  >
                    {label
                      ? `${label} (${data.programID.toString()})`
                      : data.programID.toString()}
                  </option>
                );
              })}
            </Select>
          </>
        ) : (
          <LoadingPage />
        )}
      </label>
      <label tw="flex flex-col gap-1" htmlFor="upgradeBuffer">
        <span tw="text-sm">New Buffer</span>
        {smartWallet ? (
          <>
            {buffers?.length === 0 && (
              <EmptyState icon={<GiTumbleweed />} title="No buffers available">
                <p>
                  To propose a program upgrade, please upload a buffer with the
                  <br />
                  upgrade authority{" "}
                  <AddressLink address={smartWallet} showCopy /> by following{" "}
                  <a
                    tw="text-primary"
                    href="https://github.com/gokiprotocol/goki-cli"
                    target="_blank"
                    rel="noreferrer"
                  >
                    these instructions
                  </a>
                  .
                </p>
              </EmptyState>
            )}
            <Select
              onChange={(e) => {
                setBufferKey(new PublicKey(e.target.value));
              }}
            >
              <option>Select a buffer</option>
              {buffers?.map((buffer) => (
                <BufferOption key={buffer.pubkey.toString()} buffer={buffer} />
              ))}
            </Select>
          </>
        ) : (
          <LoadingPage />
        )}
      </label>
    </>
  );
};
