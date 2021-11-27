import { usePubkey } from "@saberhq/sail";
import { useParams } from "react-router-dom";

export const WalletIndexView: React.FC = () => {
  const { walletKey: walletKeyStr } = useParams<{ walletKey: string }>();
  const walletKey = usePubkey(walletKeyStr);

  if (!walletKey) {
    return <div>Invalid wallet key</div>;
  }

  return (
    <div>
      <h1>My Wallet</h1>
      <div>
        <p>Address: {walletKey.toString()}</p>
      </div>
    </div>
  );
};
