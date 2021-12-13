import { useParsedAccountData, useSail } from "@saberhq/sail";
import { TokenAmount } from "@saberhq/token-utils";
import { useSolana } from "@saberhq/use-solana";
import type { KeyedAccountInfo, PublicKey } from "@solana/web3.js";
import {
  findEscrowAddress,
  TRIBECA_CODERS,
  VoteEscrow,
} from "@tribecahq/tribeca-sdk";
import { useQuery } from "react-query";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../contexts/sdk";
import { useGovernor } from "./useGovernor";

const parseLocker = (data: KeyedAccountInfo) =>
  TRIBECA_CODERS.LockedVoter.accountParsers.locker(data.accountInfo.data);

const parseEscrow = (data: KeyedAccountInfo) =>
  TRIBECA_CODERS.LockedVoter.accountParsers.escrow(data.accountInfo.data);

export const useLocker = () => {
  const { governorData } = useGovernor();
  const lockerKey = governorData
    ? governorData.accountInfo.data.electorate
    : governorData;
  return useParsedAccountData(lockerKey, parseLocker);
};

export const useEscrow = (owner?: PublicKey) => {
  const { tribecaMut } = useSDK();
  const { network } = useSolana();
  const { governorData, governor, veToken } = useGovernor();
  const lockerKey = governorData
    ? governorData.accountInfo.data.electorate
    : governorData;
  const { fetchKeys } = useSail();

  const result = useQuery(
    ["escrow", network, lockerKey?.toString(), owner?.toString()],
    async () => {
      invariant(lockerKey && owner && tribecaMut);
      const [escrowKey] = await findEscrowAddress(lockerKey, owner);
      const [escrowData] = await fetchKeys([escrowKey]);
      if (!escrowData || !escrowData.data) {
        return null;
      }
      const escrow = parseEscrow(escrowData.data);
      const escrowW = new VoteEscrow(
        tribecaMut,
        lockerKey,
        governor,
        escrowKey,
        owner
      );
      return {
        escrow,
        escrowW,
        calculateVotingPower: await escrowW.makeCalculateVotingPower(),
      };
    },
    {
      enabled: !!governorData && !!lockerKey && !!owner && !!tribecaMut,
    }
  );

  const veBalance =
    veToken && result.data
      ? new TokenAmount(
          veToken,
          result.data.calculateVotingPower(new Date().getTime() / 1_000)
        )
      : null;
  return { ...result, veBalance };
};

export const useUserEscrow = () => {
  const { tribecaMut } = useSDK();
  return useEscrow(tribecaMut?.provider.wallet.publicKey);
};
