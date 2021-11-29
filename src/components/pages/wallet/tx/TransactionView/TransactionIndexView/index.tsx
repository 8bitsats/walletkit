import { useTransaction } from "../context";
import { InstructionDisplay } from "./InstructionDisplay";
import { TXActivity } from "./TXActivity";
import { TXSidebar } from "./TXSidebar";

export const TransactionIndexView: React.FC = () => {
  const { instructions } = useTransaction();
  return (
    <div tw="flex w-full py-2">
      <div tw="grid gap-4 flex-grow[2] flex-basis[760px]">
        <div tw="w-full max-w-lg">
          <h2 tw="border-b pb-2 text-gray-500 font-semibold mb-4">
            Transaction Details
          </h2>
          <div tw="grid gap-4 border-b pb-4">
            {instructions?.map((instruction, i) => (
              <div tw="grid border" key={`ix_${i}`}>
                <h2 tw="font-semibold text-sm text-gray-800 p-4">
                  Instruction #{i}
                </h2>
                <div tw="p-4 border-t">
                  <InstructionDisplay instruction={instruction} />
                </div>
              </div>
            ))}
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
