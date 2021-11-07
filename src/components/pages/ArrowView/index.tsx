import { generateArrowAddress, parseArrow } from "@arrowprotocol/arrow";
import { usePubkey, useToken } from "@quarryprotocol/react-quarry";
import { TOKEN_ACCOUNT_PARSER, useParsedAccountData } from "@saberhq/sail";
import { TokenAmount } from "@saberhq/token-utils";
import type { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { shortenAddress } from "../../../utils/utils";
import { AttributeList } from "../../common/AttributeList";
import { Module } from "../../common/Module";
import { Actions } from "./Actions";
import { PositionManagement } from "./PositionManagement";

export const ArrowView: React.FC = () => {
  const { arrowMint: arrowMintStr } = useParams<{ arrowMint: string }>();
  const arrowMint = usePubkey(arrowMintStr);
  if (!arrowMint) {
    throw new Error("invalid arrow mint");
  }

  const [arrowKey, setArrowKey] = useState<PublicKey | undefined>(undefined);
  useEffect(() => {
    if (!arrowMint) {
      return;
    }
    void (async () => {
      const [key] = await generateArrowAddress(arrowMint);
      setArrowKey(key);
    })();
  }, [arrowMint]);
  const { data } = useParsedAccountData(arrowKey, parseArrow);
  const arrowData = data?.accountInfo.data;

  const stakedToken = useToken(arrowData?.vendorMiner.mint);

  const lockedAmount = useParsedAccountData(
    arrowData?.vendorMiner.minerVault,
    TOKEN_ACCOUNT_PARSER
  );

  return (
    <div tw="grid gap-12 w-full max-w-[780px] mx-auto">
      <div>
        <div tw="prose">
          <h1>Arrow {shortenAddress(arrowMint.toString())}</h1>
        </div>
      </div>
      <div tw="flex gap-4 justify-between flex-col md:flex-row">
        <Module tw="p-8">
          <Heading>Overview</Heading>
          <AttributeList
            attributes={{
              "Token Addr.": arrowData?.mint,
              TVL:
                lockedAmount.data && stakedToken
                  ? new TokenAmount(
                      stakedToken,
                      lockedAmount.data.accountInfo.data.amount
                    )
                  : lockedAmount.data ?? stakedToken,
              "Sunny Pool": arrowData?.pool,
              "Sunny Vault": arrowData?.vault,
              Beneficiary: arrowData?.beneficiary,
            }}
          />
        </Module>
        <div tw="mx-auto">
          {arrowData && <PositionManagement arrowData={arrowData} />}
        </div>
      </div>
      <Module>
        <Heading>Actions</Heading>
        <Actions arrowKey={arrowKey} arrowData={arrowData} />
      </Module>
      <Module>
        <Heading>Internal Miner</Heading>
        <AttributeList attributes={arrowData?.internalMiner ?? {}} />
      </Module>
      <Module>
        <Heading>Vendor Miner</Heading>
        <AttributeList attributes={arrowData?.vendorMiner ?? {}} />
      </Module>
    </div>
  );
};

const Heading = styled.h3(() => tw`font-sans text-sm uppercase mb-4`);
