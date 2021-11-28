import { TXAccounts } from "./TXAccounts";
import { TXData } from "./TXData";

export const TransactionIndexView: React.FC = () => {
  return (
    <div>
      <div tw="grid gap-4 w-full max-w-lg">
        <h2 tw="border-b pb-2 text-gray-500 font-semibold">
          Transaction Details
        </h2>
        <TXData />
        <TXAccounts />
      </div>
    </div>
  );
};
