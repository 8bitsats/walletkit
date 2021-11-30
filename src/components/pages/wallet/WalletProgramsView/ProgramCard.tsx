import { startCase } from "lodash";

import type { ProgramInfo } from "../../../../hooks/useAuthorityPrograms";
import { useIDL } from "../../../../hooks/useIDLs";
import { programLabel } from "../../../../utils/programs";
import { AddressLink } from "../../../common/AddressLink";
import { Button } from "../../../common/Button";
import { SlotLink } from "../../../common/SlotLink";

interface Props {
  program: ProgramInfo;
}

export const ProgramCard: React.FC<Props> = ({ program }: Props) => {
  const idl = useIDL(program.programID);
  const label =
    programLabel(program.programID.toString()) ??
    (idl.data ? startCase(idl.data.idl.name) : program.programID.toString());
  return (
    <div tw="flex items-center rounded bg-gray-50 border px-3 py-2 text-sm">
      <div tw="flex flex-grow">
        <div tw="flex-basis[236px] flex flex-col gap-1">
          <span tw="font-medium text-gray-800">{label}</span>
          <div tw="text-xs flex gap-1 text-secondary">
            <span>ID:</span>
            <AddressLink address={program.programID} />
          </div>
        </div>
        <div tw="flex items-center gap-1 text-secondary">
          <span>Deployed at:</span>
          <span>
            <SlotLink slot={program.lastDeploySlot} />
          </span>
        </div>
      </div>
      <div>
        <Button>Upgrade</Button>
      </div>
    </div>
  );
};
