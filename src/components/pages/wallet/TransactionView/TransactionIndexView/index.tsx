import { TXAccounts } from "./TXAccounts";
import { TXActivity } from "./TXActivity";
import { TXData } from "./TXData";
import { TXSidebar } from "./TXSidebar";

export const TransactionIndexView: React.FC = () => {
  return (
    <div tw="flex w-full py-2">
      <div tw="grid gap-4 flex-grow[2] flex-basis[760px]">
        <div tw="w-full max-w-lg">
          <h2 tw="border-b pb-2 text-gray-500 font-semibold mb-4">
            Transaction Details
          </h2>
          <div tw="grid gap-4 border-b pb-4">
            <TXData />
            <TXAccounts />
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
