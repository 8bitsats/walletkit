import { useSolana } from "@saberhq/use-solana";
import { startCase } from "lodash";
import { FaExternalLinkAlt } from "react-icons/fa";

import { shortenAddress } from "../../../../../../utils/utils";
import { AddressLink } from "../../../../../common/AddressLink";
import { useTransaction } from "../context";
import { Actions } from "./Actions";
import { InstructionDisplay } from "./InstructionDisplay";
import { TXActivity } from "./TXActivity";
import { TXSidebar } from "./TXSidebar";

export const TransactionIndexView: React.FC = () => {
  const { network } = useSolana();
  const { instructions, txEnv, title, id } = useTransaction();
  return (
    <div tw="flex w-full py-2">
      <div tw="grid gap-4 flex-grow[2] flex-basis[760px]">
        <div tw="w-full max-w-3xl mx-auto">
          <div tw="pb-16">
            <h2 tw="border-b pb-2 text-gray-500 font-semibold text-sm mb-4">
              Transactions › {id}
            </h2>
            <h1 tw="font-medium text-2xl leading-relaxed my-4 py-2">{title}</h1>
            <Actions />
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
                      >
                        {instruction.programName} (
                        {shortenAddress(instruction.ix.programId.toString())})
                      </AddressLink>
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
            {txEnv && network !== "localnet" && (
              <div>
                <a
                  tw="text-sm flex items-center gap-2 text-primary"
                  href={txEnv.generateInspectLink(network)}
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
