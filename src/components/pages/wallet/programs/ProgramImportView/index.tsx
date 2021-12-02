import { useSail } from "@saberhq/sail";
import { useConnectedWallet } from "@saberhq/use-solana";
import invariant from "tiny-invariant";

import { useAuthorityPrograms } from "../../../../../hooks/useAuthorityPrograms";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import {
  createSetAuthorityInstruction,
  findProgramDataAddress,
} from "../../../../../utils/instructions/upgradeable_loader/instructions";
import { displayAddress } from "../../../../../utils/programs";
import { AsyncButton } from "../../../../common/AsyncButton";
import { EmptyState } from "../../../../common/EmptyState";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { LoadingPage } from "../../../../common/LoadingPage";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { Notice } from "../../../../common/Notice";
import { BasicPage } from "../../../../common/page/BasicPage";
import { ReactComponent as EmptyFolder } from "../../../../common/svgs/EmptyFolder.svg";
import { ProgramCard } from "../WalletProgramsView/ProgramCard";

export const ProgramImportView: React.FC = () => {
  const wallet = useConnectedWallet();
  const { key } = useSmartWallet();
  const { programs, programData } = useAuthorityPrograms(wallet?.publicKey);
  const { handleTX } = useSail();
  return (
    <BasicPage
      title="Import a Program"
      description="Transfer the upgrade authority of one of your programs to your Smart Wallet."
    >
      {programData.isLoading ? (
        <LoadingPage />
      ) : (
        programs.length === 0 &&
        programData.data?.map((pdata) => (
          <Notice key={pdata.pubkey.toString()}>
            <LoadingSpinner />
          </Notice>
        ))
      )}
      {programs.length === 0 && programData.isFetched && (
        <EmptyState
          icon={<EmptyFolder />}
          title="Your connected wallet doesn't own any programs."
        >
          <div tw="text-secondary flex flex-col items-center gap-2 mt-4">
            <p>
              You must connect to the upgrade authority wallet in order to
              import programs.
            </p>
            <p>
              Haven't deployed yet?{" "}
              <a
                tw="text-primary"
                href="https://docs.solana.com/cli/deploy-a-program"
                target="_blank"
                rel="noreferrer"
              >
                View the official guide
              </a>
            </p>
          </div>
        </EmptyState>
      )}
      <div tw="flex flex-col gap-2">
        {programs.map((program, i) => {
          return (
            <div key={program.data?.programID.toString() ?? `loading_${i}`}>
              {program.isLoading && <LoadingSpinner />}
              {program.isError && <ErrorMessage error={program.error} />}
              {program.data && (
                <ProgramCard
                  program={program.data}
                  actions={
                    <AsyncButton
                      onClick={async (sdkMut) => {
                        invariant(program.data);
                        const [programData] = await findProgramDataAddress(
                          program.data.programID
                        );
                        await handleTX(
                          sdkMut.provider.newTX([
                            createSetAuthorityInstruction({
                              account: programData,
                              authority: sdkMut.provider.wallet.publicKey,
                              nextAuthority: key,
                            }),
                          ]),
                          `Transfer authority of ${displayAddress(
                            program.data.programID.toString()
                          )} to Smart Wallet`
                        );
                      }}
                    >
                      Transfer Authority
                    </AsyncButton>
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </BasicPage>
  );
};
