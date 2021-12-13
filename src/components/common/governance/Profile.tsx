import type { PublicKey } from "@solana/web3.js";

import { displayAddress } from "../../../utils/programs";
import { AddressLink } from "../AddressLink";

interface Props {
  address: PublicKey;
}

export const Profile: React.FC<Props> = ({ address }: Props) => {
  return (
    <div tw="bg-warmGray-850 p-3 text-sm rounded">
      <div tw="flex gap-2">
        <div tw="h-10 w-10 rounded-full border border-dashed"></div>
        <div tw="flex flex-col">
          <span tw="text-white font-medium">
            {displayAddress(address.toString())}
          </span>
          <AddressLink tw="text-gray-400" address={address} />
        </div>
      </div>
    </div>
  );
};
