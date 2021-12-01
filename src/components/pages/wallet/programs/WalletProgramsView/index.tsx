import { useAuthorityPrograms } from "../../../../../hooks/useAuthorityPrograms";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { BasicPage } from "../../../../common/page/BasicPage";
import { ProgramCard } from "./ProgramCard";

export const WalletProgramsView: React.FC = () => {
  const { key } = useSmartWallet();
  const programs = useAuthorityPrograms(key);
  return (
    <BasicPage
      title="Programs"
      description="Manage the programs that are upgradable by this wallet."
    >
      <div tw="flex flex-col gap-2">
        {programs.map((program, i) => {
          return (
            <div key={program.data?.programID.toString() ?? `loading_${i}`}>
              {program.isLoading && <LoadingSpinner />}
              {program.data && <ProgramCard program={program.data} />}
            </div>
          );
        })}
      </div>
    </BasicPage>
  );
};
