import { Link } from "react-router-dom";

import { useAuthorityPrograms } from "../../../../../hooks/useAuthorityPrograms";
import { useSmartWallet } from "../../../../../hooks/useSmartWallet";
import { Button } from "../../../../common/Button";
import { EmptyState } from "../../../../common/EmptyState";
import { ErrorMessage } from "../../../../common/ErrorMessage";
import { LoadingPage } from "../../../../common/LoadingPage";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import { Notice } from "../../../../common/Notice";
import { BasicPage } from "../../../../common/page/BasicPage";
import { ReactComponent as EmptyFolder } from "../../../../common/svgs/EmptyFolder.svg";
import { ProgramCard } from "./ProgramCard";

export const WalletProgramsView: React.FC = () => {
  const { key, path } = useSmartWallet();
  const { programs, programData } = useAuthorityPrograms(key);
  const isEmpty = programs.length === 0 && programData.isFetched;
  return (
    <BasicPage
      title="Programs"
      description="Manage the programs that this wallet can upgrade."
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
      {isEmpty && (
        <EmptyState
          icon={<EmptyFolder />}
          title="This wallet doesn't own any programs."
        >
          <Link
            to={`/wallets/${key.toString()}/programs/import`}
            tw="text-primary"
          >
            Import a program
          </Link>
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
                    <Link
                      to={`${path}/programs/${program.data.programID.toString()}/upgrade`}
                    >
                      <Button>Upgrade</Button>
                    </Link>
                  }
                />
              )}
            </div>
          );
        })}
      </div>
      {!isEmpty && (
        <div tw="mt-6">
          <Link to={`${path}/programs/import`}>
            <Button>Import an existing program</Button>
          </Link>
        </div>
      )}
    </BasicPage>
  );
};
