import { useMemo } from "react";
import { Link } from "react-router-dom";

import { useAuthorityPrograms } from "../../../../../hooks/useAuthorityPrograms";
import { Button } from "../../../../common/Button";
import { NoPrograms } from "../../../../common/governance/NoPrograms";
import { LoadingPage } from "../../../../common/LoadingPage";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { Notice } from "../../../../common/Notice";
import { useGovernor } from "../../hooks/useGovernor";
import { ProgramCard } from "./ProgramCard";
import { ProgramPlaceholder } from "./ProgramPlaceholder";

interface Props {
  maxCount?: number;
}

export const ProgramsList: React.FC<Props> = ({ maxCount = 100 }: Props) => {
  const { smartWallet, path } = useGovernor();
  const { programs, programData } = useAuthorityPrograms(smartWallet);
  const programsToRender = useMemo(
    () => programs.slice(0, maxCount),
    [maxCount, programs]
  );

  if (!smartWallet || programData.isLoading) {
    return (
      <div tw="h-[251px]">
        <LoadingPage />
      </div>
    );
  }

  const isEmpty = programs.length === 0 && programData.isFetched;
  if (isEmpty) {
    return <NoPrograms smartWallet={smartWallet} />;
  }

  return (
    <>
      {programs.length === 0 &&
        programData.data?.map((pdata) => (
          <Notice key={pdata.pubkey.toString()}>
            <LoadingSpinner />
          </Notice>
        ))}
      <div tw="flex flex-col gap-2">
        {programsToRender.map((program, i) => {
          return (
            <div key={program.data?.programID.toString() ?? `loading_${i}`}>
              {program.isLoading && <ProgramPlaceholder />}
              {program.data && (
                <ProgramCard
                  program={program.data}
                  actions={
                    <Link to={`${path}/proposals/create`}>
                      <Button
                        tw="py-5 px-6 hover:dark:text-primary hover:dark:border-primary"
                        variant="outline"
                      >
                        Upgrade
                      </Button>
                    </Link>
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
