import { TokenAmount } from "@saberhq/token-utils";
import { useSolana } from "@saberhq/use-solana";
import type { PublicKey } from "@solana/web3.js";
import { findEscrowAddress, VoteEscrow } from "@tribecahq/tribeca-sdk";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../contexts/sdk";
import { useParsedEscrow, useParsedLocker } from "../../../../utils/parsers";
import { useGovernor } from "./useGovernor";

export const useLocker = () => {
  const { governorData } = useGovernor();
  const lockerKey = governorData
    ? governorData.accountInfo.data.electorate
    : governorData;
  return useParsedLocker(lockerKey);
};

export const useEscrow = (owner?: PublicKey) => {
  const { tribecaMut } = useSDK();
  const { network } = useSolana();
  const { governorData, governor, veToken, govToken } = useGovernor();
  const lockerKey = governorData
    ? governorData.accountInfo.data.electorate
    : governorData;

  const escrowKey = useQuery(
    ["escrowKey", network, lockerKey?.toString(), owner?.toString()],
    async () => {
      invariant(lockerKey && owner);
      const [escrowKey] = await findEscrowAddress(lockerKey, owner);
      return escrowKey;
    },
    {
      enabled: !!(lockerKey && owner),
    }
  );
  const { data: escrow } = useParsedEscrow(escrowKey.data);

  const result = useQuery(
    ["escrow", escrow?.accountId.toString()],
    async () => {
      invariant(lockerKey && owner && tribecaMut && escrow);
      const escrowW = new VoteEscrow(
        tribecaMut,
        lockerKey,
        governor,
        escrow.accountId,
        owner
      );
      return {
        escrow: escrow.accountInfo.data,
        escrowW,
        calculateVotingPower: await escrowW.makeCalculateVotingPower(),
      };
    },
    {
      enabled: !!governorData && !!(lockerKey && owner && tribecaMut && escrow),
    }
  );

  const veBalance =
    veToken && result.data
      ? new TokenAmount(
          veToken,
          result.data.calculateVotingPower(new Date().getTime() / 1_000)
        )
      : null;

  const govTokensLocked =
    govToken && result.isFetched
      ? new TokenAmount(govToken, result.data ? result.data.escrow.amount : 0)
      : null;

  return { ...result, veBalance, govTokensLocked };
};

export const useUserEscrow = () => {
  const { tribecaMut } = useSDK();
  return useEscrow(tribecaMut?.provider.wallet.publicKey);
};
