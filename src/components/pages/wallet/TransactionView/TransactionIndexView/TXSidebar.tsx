import { useTransaction } from "../context";

export const TXSidebar: React.FC = () => {
  const { tx, title } = useTransaction();
  return (
    <>
      <div tw="text-xs font-semibold text-gray-500 border-b pb-2">{title}</div>
      <div tw="text-xs mt-4">
        <div tw="flex mb-4">
          <span tw="text-secondary w-[90px]">Status</span>
          <span>{tx.accountInfo.data.executedAt.toNumber()}</span>
        </div>
      </div>
    </>
  );
};
