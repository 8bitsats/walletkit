import { useUserAssociatedTokenAccounts } from "@quarryprotocol/react-quarry";
import { SliderHandle, SliderRange, SliderTrack } from "@reach/slider";
import { useSail } from "@saberhq/sail";
import { Fraction, sleep, TokenAmount } from "@saberhq/token-utils";
import type { VoteEscrow } from "@tribecahq/tribeca-sdk";
import { LockerWrapper } from "@tribecahq/tribeca-sdk";
import BN from "bn.js";
import formatDuration from "date-fns/formatDuration";
import { useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import invariant from "tiny-invariant";
import tw from "twin.macro";

import { useSDK } from "../../../../../contexts/sdk";
import { useParseTokenAmount } from "../../../../../hooks/useParseTokenAmount";
import { tsToDate } from "../../../../../utils/utils";
import { AttributeList } from "../../../../common/AttributeList";
import { Button } from "../../../../common/Button";
import { ContentLoader } from "../../../../common/ContentLoader";
import { HelperCard } from "../../../../common/HelperCard";
import { InputSlider } from "../../../../common/inputs/InputSlider";
import { InputTokenAmount } from "../../../../common/inputs/InputTokenAmount";
import { LoadingSpinner } from "../../../../common/LoadingSpinner";
import type { ModalProps } from "../../../../common/Modal";
import { Modal } from "../../../../common/Modal";
import { ModalInner } from "../../../../common/Modal/ModalInner";
import { useLocker, useUserEscrow } from "../../hooks/useEscrow";
import { useGovernor } from "../../hooks/useGovernor";

type Props = Omit<ModalProps, "children"> & {
  escrowW: VoteEscrow | null;
  variant: "lock" | "extend" | null;
};

const ONE_MINUTE = 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_YEAR = ONE_DAY * 365;

const normalizeDuration = (seconds: number): Duration => {
  if (seconds >= ONE_YEAR) {
    return {
      years: Math.floor(seconds / ONE_YEAR) || undefined,
      days: Math.floor((seconds % ONE_YEAR) / ONE_DAY) || undefined,
    };
  }
  if (seconds >= ONE_DAY) {
    return {
      days: Math.floor(seconds / ONE_DAY) || undefined,
    };
  }
  if (seconds >= ONE_HOUR) {
    return {
      hours: Math.floor(seconds / ONE_HOUR),
    };
  }
  if (seconds >= ONE_MINUTE) {
    return {
      minutes: Math.floor(seconds / ONE_MINUTE),
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
  if (minLockupSeconds < ONE_DAY) {
    result.push(ONE_MINUTE);
    result.push(ONE_HOUR);
  }
  if (maxLockupSeconds > ONE_DAY * 30) {
    result.push(ONE_DAY * 30);
  }
  if (maxLockupSeconds > ONE_YEAR) {
    result.push(ONE_YEAR);
  }
  return [minLockupSeconds, ...result, maxLockupSeconds].map((seconds) => ({
    seconds,
    duration: normalizeDuration(seconds),
  }));
};

export const LockEscrowModal: React.FC<Props> = ({
  variant,
  ...modalProps
}: Props) => {
  const { tribecaMut } = useSDK();
  const { governor, veToken, govToken, lockerData } = useGovernor();
  const { data: locker } = useLocker();
  const { data: escrow, refetch } = useUserEscrow();
  const [userBalance] = useUserAssociatedTokenAccounts([govToken]);
  const [lockDurationSeconds, setDurationSeconds] = useState<string>(
    lockerData?.accountInfo.data.params.minStakeDuration.toString() ?? ""
  );
  const parsedDurationSeconds = lockDurationSeconds
    ? parseFloat(lockDurationSeconds)
    : null;
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

  const [depositAmountStr, setDepositAmountStr] = useState<string>("");
  const depositAmount = useParseTokenAmount(govToken, depositAmountStr);

  const prevUnlockTime = escrow ? tsToDate(escrow.escrow.escrowEndsAt) : null;
  const unlockTime = parsedDurationSeconds
    ? new Date(Date.now() + parsedDurationSeconds * 1_000)
    : null;
  const isInvalidUnlockTime =
    prevUnlockTime && unlockTime && unlockTime < prevUnlockTime;

  const currentVotingPower = veToken
    ? new TokenAmount(
        veToken,
        escrow ? escrow.calculateVotingPower(Date.now() / 1_000) : 0
      )
    : null;

  const newDeposits = govToken
    ? new TokenAmount(govToken, escrow?.escrow?.amount ?? 0).add(
        new TokenAmount(govToken, depositAmount?.raw ?? 0)
      )
    : null;
  const newVotingPower =
    newDeposits && locker && veToken && parsedDurationSeconds
      ? new TokenAmount(
          veToken,
          new Fraction(newDeposits.raw)
            .multiply(locker.accountInfo.data.params.maxStakeVoteMultiplier)
            .multiply(parsedDurationSeconds)
            .divide(locker.accountInfo.data.params.maxStakeDuration).quotient
        )
      : null;

  return (
    <Modal tw="p-0 dark:text-white" {...modalProps}>
      <ModalInner
        tw="p-0"
        title={variant === "extend" ? "Extend Lockup" : "Lock Tokens"}
      >
        <div tw="px-8 py-4">
          <div tw="flex flex-col gap-8">
            {variant === "extend" && (
              <HelperCard>
                <p>
                  Extend your lockup to increase the voting power of your
                  current token stake.
                </p>
              </HelperCard>
            )}
            {variant === "lock" && (
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
            )}
            <div>
              <div tw="flex flex-col gap-2">
                <span tw="font-medium text-sm">Lock Period</span>
                <div
                  tw="text-4xl my-6"
                  css={[isInvalidUnlockTime && tw`text-red-500`]}
                >
                  {parsedDurationSeconds ? (
                    formatDuration(normalizeDuration(parsedDurationSeconds), {
                      zero: true,
                    })
                  ) : (
                    <ContentLoader tw="h-4 w-8" />
                  )}
                </div>
                <div tw="w-11/12 mx-auto my-4">
                  <InputSlider
                    value={parsedDurationSeconds ?? undefined}
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
                      {formatDuration(duration, { zero: true })}
                    </Button>
                  ))}
                </div>
                <div tw="py-6 flex items-center justify-center">
                  <FaArrowDown />
                </div>
                <div tw="mb-6 border rounded border-warmGray-800">
                  {!veToken ? (
                    <div tw="w-full py-5 flex items-center justify-center">
                      <LoadingSpinner tw="h-8 w-8" />
                    </div>
                  ) : (
                    <AttributeList
                      rowStyles={tw`items-start gap-4`}
                      labelStyles={tw`w-32`}
                      valueStyles={tw`flex-grow`}
                      transformLabel={false}
                      attributes={{
                        [`${veToken.symbol} balance`]: (
                          <div tw="flex flex-col">
                            <div>
                              <span tw="text-warmGray-400">Prev: </span>
                              <span>
                                {currentVotingPower?.toExact({
                                  groupSeparator: ",",
                                })}
                              </span>
                            </div>
                            <div>
                              <span tw="text-warmGray-400">Next: </span>
                              <span>
                                {newVotingPower?.toExact({
                                  groupSeparator: ",",
                                })}
                              </span>
                            </div>
                          </div>
                        ),
                        "Unlock Time": (
                          <div tw="flex flex-col">
                            <div>
                              <span tw="text-warmGray-400">Prev: </span>
                              <span>
                                {prevUnlockTime?.toLocaleString(undefined, {
                                  timeZoneName: "short",
                                }) ?? "n/a"}
                              </span>
                            </div>
                            <div>
                              <span tw="text-warmGray-400">Next: </span>
                              <span>
                                {unlockTime?.toLocaleString(undefined, {
                                  timeZoneName: "short",
                                }) ?? "--"}
                              </span>
                            </div>
                          </div>
                        ),
                      }}
                    />
                  )}
                </div>
                {isInvalidUnlockTime && (
                  <HelperCard variant="error" tw="my-4">
                    <div tw="py-2">
                      <h2 tw="text-base text-white mb-2 font-semibold">
                        You cannot decrease your lock period
                      </h2>
                      <p tw="mb-1">
                        Your existing lock period ends at{" "}
                        {prevUnlockTime.toLocaleString()}. Any updates to your
                        vote escrow must result in a lockup that ends at or
                        after this date.
                      </p>
                      <p>
                        You may use a separate wallet in order to maintain
                        multiple lockups of varying expiries.
                      </p>
                    </div>
                  </HelperCard>
                )}
                <Button
                  size="md"
                  variant="primary"
                  disabled={
                    !tribecaMut ||
                    !locker ||
                    !!isInvalidUnlockTime ||
                    !parsedDurationSeconds ||
                    !depositAmount ||
                    depositAmount.toU64().isZero()
                  }
                  onClick={async () => {
                    invariant(
                      tribecaMut &&
                        locker &&
                        parsedDurationSeconds &&
                        depositAmount
                    );
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
                    await sleep(1_000);
                    await refetch();
                    modalProps.onDismiss();
                  }}
                >
                  {isInvalidUnlockTime
                    ? "Cannot decrease lock time"
                    : variant === "extend"
                    ? "Extend Lockup"
                    : "Lock Tokens"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ModalInner>
    </Modal>
  );
};
