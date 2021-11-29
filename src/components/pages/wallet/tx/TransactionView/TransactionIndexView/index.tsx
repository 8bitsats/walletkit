import { useSolana } from "@saberhq/use-solana";
import { startCase } from "lodash";
import { FaExternalLinkAlt } from "react-icons/fa";

import { AddressLink } from "../../../../../common/AddressLink";
import { useTransaction } from "../context";
import { InstructionDisplay } from "./InstructionDisplay";
import { TXActivity } from "./TXActivity";
import { TXSidebar } from "./TXSidebar";

export const TransactionIndexView: React.FC = () => {
  const { network } = useSolana();
  const { instructions, txEnv } = useTransaction();
  return (
    <div tw="flex w-full py-2">
      <div tw="grid gap-4 flex-grow[2] flex-basis[760px]">
        <div tw="w-full max-w-lg">
          <div tw="pb-16">
            <h2 tw="border-b pb-2 text-gray-500 font-semibold mb-4">
              Transaction Details
            </h2>
            <div tw="grid gap-4">
              {instructions?.map((instruction, i) => (
                <div tw="grid border" key={`ix_${i}`}>
                  <div tw="text-sm p-4">
                    <h2 tw="font-semibold text-gray-800 mb-2">
                      Instruction #{i}:{" "}
                      {startCase(instruction.parsed?.name ?? "Unknown")}
                    </h2>
                    <p tw="text-xs text-gray-500">
                      <span tw="font-medium">Program:</span>{" "}
                      <AddressLink
                        tw="font-semibold text-secondary"
                        address={instruction.ix.programId}
                      />
                    </p>
                  </div>
                  <div tw="p-4 border-t">
                    <InstructionDisplay instruction={instruction} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div tw="pb-4 border-b">
            {network !== "localnet" && (
              <div>
                <a
                  tw="text-sm flex items-center gap-2 text-primary"
                  href={txEnv?.generateInspectLink(network)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Preview on Solana Explorer
                  <FaExternalLinkAlt />
                </a>
              </div>
            )}
          </div>
          <TXActivity />
        </div>
      </div>
      <div tw="flex-grow[1] border-l px-6">
        <TXSidebar />
      </div>
    </div>
  );
};
