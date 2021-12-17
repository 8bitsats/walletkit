import { startCase } from "lodash";

import { shortenAddress } from "../../../../../../utils/utils";
import { AddressLink } from "../../../../../common/AddressLink";
import { useTransaction } from "../../../../wallet/tx/TransactionView/context";
import { InstructionDisplay } from "../../../../wallet/tx/TransactionView/TransactionIndexView/InstructionDisplay";

export const InstructionsInner: React.FC = () => {
  const { instructions } = useTransaction();
  return (
    <div tw="grid gap-4">
      {instructions?.map((instruction, i) => (
        <div tw="grid border dark:border-warmGray-700 rounded" key={`ix_${i}`}>
          <div tw="text-sm p-4">
            <h2 tw="font-semibold text-gray-800 dark:text-white mb-2">
              Instruction #{i}:{" "}
              {startCase(
                (instruction.parsed && "name" in instruction.parsed
                  ? instruction.parsed.name
                  : null) ?? "Unknown"
              )}
            </h2>
            <p tw="text-xs text-gray-500">
              <span tw="font-medium">Program:</span>{" "}
              <AddressLink
                tw="font-semibold text-secondary"
                address={instruction.ix.programId}
              >
                {instruction.programName} (
                {shortenAddress(instruction.ix.programId.toString())})
              </AddressLink>
            </p>
          </div>
          <div tw="p-4 border-t dark:border-t-warmGray-600">
            <InstructionDisplay instruction={instruction} />
          </div>
        </div>
      ))}
    </div>
  );
};
