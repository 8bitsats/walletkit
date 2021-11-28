import { ReactComponent as GokiLogo } from "../../../common/svgs/logo-dark.svg";
import { WalletDropdownMini } from "../WalletDropdownMini";

export const Sidebar: React.FC = () => {
  return (
    <nav tw="w-[220px] max-w-[330px] h-screen border-r flex flex-col">
      <div tw="px-5 py-3 grid gap-7">
        <GokiLogo tw="h-5 w-min text-primary-800 hover:(text-primary -rotate-3) transition-all" />
        <WalletDropdownMini />
      </div>
      <div tw="flex flex-col px-4 mb-0.5">
        <h3 tw="text-xs font-medium text-gray-500">Transactions</h3>
        <span tw="text-gray-700 text-sm font-medium h-7 flex items-center px-2.5">
          All
        </span>
        <span>Pending</span>
        <span>All</span>
      </div>
    </nav>
  );
};
