import { useSmartWallet } from "../../../../hooks/useSmartWallet";

export const SmartWalletInner: React.FC = () => {
  const { smartWallet } = useSmartWallet();

  return (
    <div>{smartWallet?.data?.owners.map((o) => o.toString()).join(",")}</div>
  );
};
