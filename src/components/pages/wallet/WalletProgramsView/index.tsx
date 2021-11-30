import { PublicKey } from "@solana/web3.js";

import { useAuthorityPrograms } from "../../../../hooks/useAuthorityPrograms";
import { BasicPage } from "../../../common/page/BasicPage";
import { ProgramCard } from "./ProgramCard";

export const WalletProgramsView: React.FC = () => {
  const programs = useAuthorityPrograms(
    new PublicKey("B8F6XMbcupoDoPX6Lwy4PdDEehaCJx5UZnyA8QUuf1Sc")
  );
  return (
    <BasicPage
      title="Programs"
      description="Manage the programs that are upgradable by this wallet."
    >
      <div tw="flex flex-col gap-2">
        {programs.map((program, i) => {
          return (
            <div key={program.data?.programID.toString() ?? `loading_${i}`}>
              {program.data && <ProgramCard program={program.data} />}
            </div>
          );
        })}
      </div>
    </BasicPage>
  );
};
