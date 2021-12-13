import {
  useToken,
  useUserAssociatedTokenAccounts,
} from "@quarryprotocol/react-quarry";
import { SliderHandle, SliderRange, SliderTrack } from "@reach/slider";
import { useSail } from "@saberhq/sail";
import type { VoteEscrow } from "@tribecahq/tribeca-sdk";
import { LockerWrapper } from "@tribecahq/tribeca-sdk";
import BN from "bn.js";
import formatDuration from "date-fns/formatDuration";
import { useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import invariant from "tiny-invariant";

import { useSDK } from "../../../../../contexts/sdk";
import { useParseTokenAmount } from "../../../../../hooks/useParseTokenAmount";
import { AttributeList } from "../../../../common/AttributeList";
import { Button } from "../../../../common/Button";
import { InputSlider } from "../../../../common/inputs/InputSlider";
import { InputTokenAmount } from "../../../../common/inputs/InputTokenAmount";
import type { ModalProps } from "../../../../common/Modal";
import { Modal } from "../../../../common/Modal";
import { useEscrow, useLocker } from "../../hooks/useEscrow";
import { useGovernor } from "../../hooks/useGovernor";

type Props = Omit<ModalProps, "children"> & {
  escrowW: VoteEscrow | null;
};

const ONE_DAY = 86_400;
const ONE_YEAR = ONE_DAY * 365;

const normalizeDuration = (seconds: number): Duration => {
  if (seconds >= ONE_YEAR) {
    return {
      years: Math.floor(seconds / ONE_YEAR),
      days: Math.floor((seconds % ONE_YEAR) / ONE_DAY),
    };
  }
  if (seconds >= ONE_DAY) {
    return {
      days: Math.floor(seconds / ONE_DAY),
    };
  }
  return {
    seconds,
  };
};

export const formatDurationSeconds = (seconds: number) =>
  formatDuration(normalizeDuration(seconds));

const nicePresets = (
  minLockupSeconds: number,
  maxLockupSeconds: number
): { duration: Duration; seconds: number }[] => {
  const result = [];
  if (maxLockupSeconds > ONE_DAY * 30) {
    result.push(ONE_DAY * 30);
  }
  if (maxLockupSeconds > ONE_YEAR) {
    result.push(ONE_YEAR);
  }
  return [minLockupSeconds, ...result.slice(-3), maxLockupSeconds].map(
    (seconds) => ({
      seconds,
      duration: normalizeDuration(seconds),
    })
  );
};

export const LockEscrowModal: React.FC<Props> = ({ ...modalProps }) => {
  const { tribecaMut } = useSDK();
  const { governor } = useGovernor();
  const { data: locker } = useLocker();
  const govToken = useToken(locker?.accountInfo.data.tokenMint);
  const { data: escrow, remove } = useEscrow(
    tribecaMut?.provider.wallet.publicKey
  );
  const [userBalance] = useUserAssociatedTokenAccounts([govToken]);
  const [lockDurationSeconds, setDurationSeconds] = useState<string>(
    ONE_DAY.toString()
  );
  const parsedDurationSeconds = parseFloat(lockDurationSeconds);
  const { handleTX } = useSail();

  const durations = locker
    ? ([
        locker.accountInfo.data.params.minStakeDuration.toNumber(),
        locker.accountInfo.data.params.maxStakeDuration.toNumber(),
      ] as const)
    : locker;

  const durationPresets = durations
    ? nicePresets(durations[0], durations[1])
    : [];

  const [depositAmountStr, setDepositAmountStr] = useState<string>("0");
  const depositAmount = useParseTokenAmount(govToken, depositAmountStr);

  const unlockTime = new Date(Date.now() + parsedDurationSeconds * 1_000);

  const currentVotingPower =
    escrow && govToken
      ? parseFloat(escrow.calculateVotingPower(Date.now() / 1_000).toString()) /
        10 ** govToken.decimals
      : 0;

  const addedVotingPower = locker
    ? depositAmount?.asFraction
        .multiply(locker.accountInfo.data.params.maxStakeVoteMultiplier)
        .multiply(parsedDurationSeconds)
        .divide(locker.accountInfo.data.params.maxStakeDuration).asNumber
    : null;

  const newVotingPower = currentVotingPower + (addedVotingPower ?? 0);

  return (
    <Modal tw="p-0 dark:text-white" {...modalProps}>
      <div tw="h-14 flex items-center px-8 border-b dark:border-warmGray-700">
        <h1 tw="font-medium text-base">Lock Tokens</h1>
      </div>
      <div tw="px-8 py-4">
        <div tw="flex flex-col gap-8">
          <InputTokenAmount
            tokens={[]}
            label="Deposit Amount"
            token={govToken ?? null}
            inputValue={depositAmountStr}
            inputOnChange={setDepositAmountStr}
            currentAmount={{
              amount: userBalance?.balance,
              allowSelect: true,
            }}
          />
          <div>
            <div tw="flex flex-col gap-2">
              <span tw="font-medium text-sm">Lock Period</span>
              <div tw="text-4xl my-6">
                {formatDuration(
                  normalizeDuration(
                    Math.floor(parsedDurationSeconds / 86_400) * 86_400
                  )
                )}
              </div>
              <div tw="w-11/12 mx-auto my-4">
                <InputSlider
                  value={parsedDurationSeconds}
                  min={durations?.[0]}
                  max={durations?.[1]}
                  step={1}
                  onChange={(e) => setDurationSeconds(e.toFixed(2))}
                >
                  <SliderTrack>
                    <SliderRange />
                    <SliderHandle />
                  </SliderTrack>
                </InputSlider>
              </div>
              <div tw="flex gap-4 mx-auto mt-4 flex-wrap">
                {durationPresets.map(({ duration, seconds }, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    tw="px-4 rounded border-primary hover:border-primary bg-primary bg-opacity-20"
                    onClick={() => {
                      setDurationSeconds(seconds.toString());
                    }}
                  >
                    {formatDuration(duration)}
                  </Button>
                ))}
              </div>
              <div tw="py-6 flex items-center justify-center">
                <FaArrowDown />
              </div>
              <div>
                <AttributeList
                  attributes={{
                    "Current Voting Power": currentVotingPower,
                    "Added Voting Power": addedVotingPower,
                    "New Voting Power": newVotingPower,
                    "Unlock Time": unlockTime.toLocaleString(undefined, {
                      timeZoneName: "short",
                    }),
                  }}
                />
              </div>
              <Button
                size="md"
                variant="primary"
                disabled={!tribecaMut || !depositAmount || !locker}
                onClick={async () => {
                  invariant(tribecaMut && depositAmount && locker);
                  const lockerW = new LockerWrapper(
                    tribecaMut,
                    locker.accountId,
                    governor
                  );
                  const tx = await lockerW.lockTokens({
                    amount: depositAmount.toU64(),
                    duration: new BN(parsedDurationSeconds),
                  });
                  const { pending, success } = await handleTX(
                    tx,
                    `Lock tokens`
                  );
                  if (!pending || !success) {
                    return;
                  }
                  await pending.wait();
                  remove();
                  modalProps.onDismiss();
                }}
              >
                Lock Tokens
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
