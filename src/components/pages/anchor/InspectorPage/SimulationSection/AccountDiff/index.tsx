import { AccountsCoder, Coder } from "@project-serum/anchor";
import { ACCOUNT_DISCRIMINATOR_SIZE } from "@project-serum/anchor/dist/cjs/coder";
import { useAccountData, usePubkey } from "@saberhq/sail";
import type { SimulatedTransactionAccountInfo } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";

import { useIDL } from "../../../../../../hooks/useIDLs";
import { useProgramLabel } from "../../../../../../hooks/useProgramMeta";
import { AddressWithContext } from "../../../../../common/program/AddressWithContext";
import { SolAmount } from "../../../../../common/program/SolAmount";
import { ColoredDiff } from "./ColoredDiff";
import { makeObjectDiff } from "./makeDiff";
import { getAccountType, NonAnchorDiff } from "./NonAnchorDiff";

interface Props {
  accountId: PublicKey;
  nextInfo: SimulatedTransactionAccountInfo;
  name?: string;
}

export const AccountDiff: React.FC<Props> = ({
  accountId,
  nextInfo,
  name,
}: Props) => {
  const owner = usePubkey(nextInfo.owner);
  const { data: currentInfo } = useAccountData(accountId);
  const programLabel = useProgramLabel(owner);
  const { data: idl } = useIDL(owner);

  const anchorParsed = useMemo(() => {
    if (!idl?.idl) {
      return null;
    }
    const parser = new Coder(idl.idl);
    const discriminators = idl.idl.accounts?.map((account) => ({
      name: account.name,
      discriminator: AccountsCoder.accountDiscriminator(account.name),
    }));

    const nextInfoData = nextInfo.data as [string, string];
    const nextData = Buffer.from(
      nextInfoData[0],
      nextInfoData[1] as BufferEncoding
    );

    const discriminator =
      nextData?.slice(0, ACCOUNT_DISCRIMINATOR_SIZE) ??
      currentInfo?.accountInfo.data.slice(0, ACCOUNT_DISCRIMINATOR_SIZE);
    if (!discriminator) {
      return null;
    }

    const accountName = discriminators?.find((d) =>
      d.discriminator.equals(discriminator)
    );
    if (!accountName) {
      return null;
    }

    const current: Record<string, unknown> | null = currentInfo
      ? parser.accounts.decode(accountName.name, currentInfo.accountInfo.data)
      : null;
    const next: Record<string, unknown> | null = nextData
      ? parser.accounts.decode(accountName.name, nextData)
      : null;

    const diff = makeObjectDiff(current, next);

    return { accountName: accountName.name, ...diff };
  }, [currentInfo, idl?.idl, nextInfo.data]);

  const nextInfoData = nextInfo.data as [string, string];
  const nextData = Buffer.from(
    nextInfoData[0],
    nextInfoData[1] as BufferEncoding
  );

  const currentLamports = currentInfo?.accountInfo.lamports ?? 0;
  const nextLamports = nextInfo.lamports;
  const dataChanged =
    currentInfo && !currentInfo.accountInfo.data.equals(nextData);
  const accountChanged =
    (!currentInfo && nextData) ||
    dataChanged ||
    currentLamports !== nextLamports;

  const accountType = getAccountType(new PublicKey(nextInfo.owner), nextData);

  return (
    <div tw="border-b border-b-warmGray-800 w-full text-sm">
      <div tw="flex items-center gap-8 justify-between py-4 w-full border-b border-warmGray-800">
        <h2 tw="pl-8 text-sm text-white font-semibold">
          {name ??
            (anchorParsed
              ? `${programLabel}: ${anchorParsed.accountName}`
              : null) ??
            (accountType ? `${programLabel}: ${accountType}` : null) ??
            "Unknown Account Type"}
        </h2>
        <div tw="pr-8">
          <AddressWithContext pubkey={accountId} />
        </div>
      </div>
      {!accountChanged ? (
        <div tw="pl-8 py-6 w-full text-gray-300">
          <p>Account unchanged.</p>
        </div>
      ) : (
        <>
          {currentLamports !== nextInfo.lamports && (
            <div tw="py-4 px-8 border-b border-b-warmGray-800">
              SOL balance{" "}
              {currentLamports > nextLamports ? "decreased" : "increased"} from{" "}
              <SolAmount lamports={currentLamports} /> to{" "}
              <SolAmount lamports={nextLamports} />.
            </div>
          )}
          {dataChanged && (
            <>
              {anchorParsed && <ColoredDiff parsed={anchorParsed} />}
              {!anchorParsed && (
                <NonAnchorDiff
                  accountId={accountId}
                  prevInfo={currentInfo}
                  nextInfo={nextInfo}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
