import { usePubkey, useSail } from "@saberhq/sail";
import { Keypair } from "@solana/web3.js";
import {
  createLocker,
  findGovernorAddress,
  findLockerAddress,
} from "@tribecahq/tribeca-sdk";
import BN from "bn.js";
import { useState } from "react";
import { FaDice } from "react-icons/fa";
import { useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../contexts/sdk";
import { handleException } from "../../../../../utils/error";
import { notify } from "../../../../../utils/notifications";
import { AsyncButton } from "../../../../common/AsyncButton";
import { Button } from "../../../../common/Button";
import { InputText } from "../../../../common/inputs/InputText";

export const DAOStep4LockerView: React.FC = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const executiveStr = urlParams.get("executive");
  const emergencyStr = urlParams.get("emergency");
  const executive = usePubkey(executiveStr);
  const emergencyDAO = usePubkey(emergencyStr);

  const { handleTX } = useSail();
  const { sdkMut, tribecaMut } = useSDK();

  const [baseKP, setBaseKP] = useState<Keypair>(Keypair.generate());

  const [govTokenMintStr, setGovTokenMintStr] = useState<string>("");
  const govTokenMint = usePubkey(govTokenMintStr);

  const { data: keys } = useQuery(
    ["lockedVoterKeys", baseKP?.publicKey.toString()],
    async () => {
      invariant(baseKP);
      const [governor] = await findGovernorAddress(baseKP.publicKey);
      const [locker] = await findLockerAddress(baseKP.publicKey);
      return { governor, locker };
    },
    {
      enabled: !!baseKP,
    }
  );

  const governorKey = keys?.governor;
  const lockerKey = keys?.locker;
  const history = useHistory();

  return (
    <div tw="grid gap-12 w-full max-w-sm mx-auto">
      <div>
        <div tw="mb-8">
          <h1 tw="font-bold text-3xl mb-4 dark:text-gray-50">Create the DAO</h1>
          <h2 tw="text-secondary font-medium text-sm dark:text-gray-300">
            Launch your Tribeca DAO by providing a governance token.
          </h2>
        </div>
        <div tw="flex flex-col gap-16">
          <div tw="grid gap-4">
            <label tw="flex flex-col" htmlFor="govTokenMint">
              <span tw="text-xs mb-1">Governance Token Mint</span>
              <InputText
                id="govTokenMint"
                tw="h-10"
                value={govTokenMintStr}
                onChange={(e) => setGovTokenMintStr(e.target.value)}
              />
            </label>
            <div tw="flex flex-col w-full">
              <span tw="text-xs mb-1.5">Governor Address</span>
              <div tw="flex gap-2 w-full">
                <InputText
                  tw="h-10 flex-grow"
                  disabled
                  value={governorKey?.toString()}
                />
                <Button
                  tw="flex items-center gap-2 h-10"
                  onClick={() => {
                    setBaseKP(Keypair.generate());
                  }}
                >
                  <span>Reroll</span>
                  <FaDice />
                </Button>
              </div>
            </div>
            <div tw="flex flex-col w-full">
              <span tw="text-xs mb-1.5">Locker Address</span>
              <div tw="flex gap-2 w-full">
                <InputText
                  tw="h-10 flex-grow"
                  disabled
                  value={lockerKey?.toString()}
                />
                <Button
                  tw="flex items-center gap-2 h-10"
                  onClick={() => {
                    setBaseKP(Keypair.generate());
                  }}
                >
                  <span>Reroll</span>
                  <FaDice />
                </Button>
              </div>
            </div>
            <div tw="flex flex-col">
              <span tw="text-xs mb-1">Executive Multisig</span>
              <InputText tw="h-10" disabled value={executive?.toString()} />
            </div>
            <div tw="flex flex-col">
              <span tw="text-xs mb-1">Emergency Multisig</span>
              <InputText tw="h-10" disabled value={emergencyDAO?.toString()} />
            </div>
          </div>
          <div tw="mx-auto flex flex-col items-center gap-6">
            <AsyncButton
              type="submit"
              tw="w-[200px]"
              variant="primary"
              size="md"
              disabled={!govTokenMint || !executive || !emergencyDAO}
              onClick={async () => {
                try {
                  invariant(sdkMut, "sdk");
                  invariant(tribecaMut, "sdk");
                  invariant(govTokenMint && executive && emergencyDAO);

                  const doCreateLocker = await createLocker({
                    sdk: tribecaMut,
                    gokiSDK: sdkMut,
                    govTokenMint,
                    governorBaseKP: baseKP,
                    lockerBaseKP: baseKP,
                    owners: [emergencyDAO, executive],
                    governanceParameters: {
                      quorumVotes: new BN(10),
                      votingDelay: new BN(30),
                      votingPeriod: new BN(600),
                      timelockDelaySeconds: new BN(60),
                    },
                    lockerParams: {
                      minStakeDuration: new BN(0),
                      proposalActivationMinVotes: new BN(10),
                    },
                  });

                  for (const { title, tx } of doCreateLocker.createTXs) {
                    notify({
                      message: `${title}`,
                    });
                    const { pending, success } = await handleTX(tx, title);
                    if (!success || !pending) {
                      return;
                    }
                    await pending.wait({ commitment: "confirmed" });
                  }

                  history.push(
                    `/gov/${doCreateLocker.governorWrapper.governorKey.toString()}`
                  );
                } catch (e) {
                  handleException(e, {
                    source: "create-dao",
                  });
                }
              }}
            >
              Launch DAO
            </AsyncButton>
          </div>
        </div>
      </div>
    </div>
  );
};
