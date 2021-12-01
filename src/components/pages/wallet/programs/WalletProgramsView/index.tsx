import { useAuthorityPrograms } from "../../../../../hooks/useAuthorityPrograms";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { Card } from "../../../../common/Card";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { LoadingPage } from "../../../../common/LoadingPage";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { BasicPage } from "../../../../common/page/BasicPage";
import { ProgramCard } from "./ProgramCard";

export const WalletProgramsView: React.FC = () => {
  const { key } = useSmartWallet();
  const { programs, programData } = useAuthorityPrograms(key);
  console.log({ programs, programData });
  return (
    <BasicPage
      title="Programs"
      description="Manage the programs that are upgradable by this wallet."
    >
      {programData.isLoading ? (
        <LoadingPage />
      ) : (
        programs.length === 0 &&
        programData.data?.map((pdata) => (
          <Card key={pdata.pubkey.toString()}>
            <LoadingSpinner />
          </Card>
        ))
      )}
      <div tw="flex flex-col gap-2">
        {programs.map((program, i) => {
          return (
            <div key={program.data?.programID.toString() ?? `loading_${i}`}>
              {program.isLoading && <LoadingSpinner />}
              {program.isError && <ErrorMessage error={program.error} />}
              {program.data && <ProgramCard program={program.data} />}
            </div>
          );
        })}
      </div>
    </BasicPage>
  );
};
