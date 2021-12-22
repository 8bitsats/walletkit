import type { PublicKey } from "@solana/web3.js";
import makeBlockie from "ethereum-blockies-base64";

import { displayAddress } from "../../../utils/programs";
import { AddressLink } from "../AddressLink";

interface Props {
  address: PublicKey;
}

export const Profile: React.FC<Props> = ({ address }: Props) => {
  const addressStr = address.toString();
  return (
    <div tw="bg-warmGray-850 p-3 text-sm rounded">
      <div tw="flex gap-2">
        <img
          tw="h-10 w-10 rounded-full"
          alt={`profile-${addressStr}`}
          src={makeBlockie(addressStr)}
        ></img>
        <div tw="flex flex-col">
          <span tw="text-white font-medium">{displayAddress(addressStr)}</span>
          <AddressLink tw="text-gray-400" address={address} />
        </div>
      </div>
    </div>
  );
};
