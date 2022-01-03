import type { AccountDatum } from "@saberhq/sail";
import {
  deserializeAccount,
  deserializeMint,
  MintLayout,
  TOKEN_PROGRAM_ID,
  TokenAccountLayout,
} from "@saberhq/token-utils";
import type { SimulatedTransactionAccountInfo } from "@solana/web3.js";
import { PublicKey, SystemProgram } from "@solana/web3.js";

import { ColoredDiff } from "./ColoredDiff";
import { makeBufferDiff, makeObjectDiff } from "./makeDiff";

interface Props {
  accountId: PublicKey;
  prevInfo: AccountDatum;
  nextInfo: SimulatedTransactionAccountInfo;
}

export const getAccountType = (
  owner: PublicKey,
  data: Buffer
): string | null => {
  if (owner.equals(TOKEN_PROGRAM_ID)) {
    if (data.length === TokenAccountLayout.span) {
      return "Token Account";
    } else if (data.length === MintLayout.span) {
      return "Mint";
    }
  }
  if (data.length === 0) {
    if (owner.equals(SystemProgram.programId)) {
      return "System Account";
    } else {
      return "PDA";
    }
  }
  return null;
};

const tryToDiff = (props: Props) => {
  const { prevInfo, nextInfo } = props;
  const nextInfoData = nextInfo.data as [string, string];
  const nextData = Buffer.from(
    nextInfoData[0],
    nextInfoData[1] as BufferEncoding
  );

  let prevObj: Record<string, unknown> | null = null;
  let nextObj: Record<string, unknown> | null = null;

  const owner = new PublicKey(nextInfo.owner);
  if (owner.equals(TOKEN_PROGRAM_ID)) {
    if (nextData.length === TokenAccountLayout.span) {
      if (prevInfo) {
        prevObj = deserializeAccount(prevInfo.accountInfo.data);
      }
      nextObj = deserializeAccount(nextData);
    } else if (nextData.length === MintLayout.span) {
      if (prevInfo) {
        prevObj = deserializeMint(prevInfo.accountInfo.data);
      }
      nextObj = deserializeMint(nextData);
    }
  }

  if (prevObj === null && nextObj === null) {
    return makeBufferDiff(
      prevInfo ? prevInfo.accountInfo.data : null,
      nextData
    );
  }

  // const prevDataStr = prevInfo?.accountInfo.data.toString("hex");
  // const nextDataStr = nextData.toString("hex");
  return makeObjectDiff(prevObj, nextObj);
};

export const NonAnchorDiff: React.FC<Props> = (props: Props) => {
  const diff = tryToDiff(props);
  if (diff) {
    return <ColoredDiff parsed={diff} />;
  }
  return <div>test</div>;
};
