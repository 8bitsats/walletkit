import { useSail } from "@saberhq/sail";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import invariant from "tiny-invariant";

import { Button } from "../Button";
import { ContentLoader } from "../ContentLoader";
import type { TransactionPlan } from "./plan";

interface Props {
  makePlan: () => Promise<TransactionPlan>;
  onComplete?: () => void;
}

export const TransactionPlanExecutor: React.FC<Props> = ({
  makePlan,
  onComplete,
}: Props) => {
  const { handleTXs } = useSail();
  const [nextTX, setNextTX] = useState<number>(0);

  const [plan, setPlan] = useState<TransactionPlan | null>(null);
  useEffect(() => {
    if (plan) {
      return;
    }
    void (async () => {
      const plan = await makePlan();
      setPlan(plan);
    })();
  }, [makePlan, plan]);

  return (
    <div tw="flex flex-col gap-4 items-center">
      <p tw="text-white">
        You are about to execute the following transactions:
      </p>
      {plan ? (
        <div tw="text-sm flex flex-col border border-warmGray-800 rounded w-full">
          {plan.steps.map(({ title, txs }, i) => {
            return (
              <div
                key={i}
                tw="flex items-center justify-between py-4 px-4 border-t border-t-warmGray-800"
              >
                <div>{title}</div>
                <div>
                  {i < nextTX ? (
                    <FaCheckCircle tw="text-primary" />
                  ) : (
                    <Button
                      disabled={i !== nextTX}
                      onClick={async () => {
                        const { pending, success } = await handleTXs(
                          txs,
                          title
                        );
                        if (!success) {
                          return;
                        }
                        await Promise.all(pending.map((p) => p.wait()));
                        if (i === plan.steps.length - 1) {
                          onComplete?.();
                        } else {
                          setNextTX(i + 1);
                        }
                      }}
                    >
                      Execute
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div tw="text-sm flex flex-col border border-warmGray-800 rounded w-full">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                tw="flex items-center justify-between py-4 px-4 border-t border-t-warmGray-800"
              >
                <ContentLoader tw="w-12 h-4" />
                <ContentLoader tw="w-4 h-4" />
              </div>
            ))}
        </div>
      )}
      <Button
        variant="primary"
        size="md"
        disabled={!plan}
        onClick={async () => {
          invariant(plan);
          for (const [i, tx] of plan.steps.slice(nextTX).entries()) {
            if (tx.txs.length === 0) {
              continue;
            }
            const { pending, success } = await handleTXs(tx.txs, tx.title);
            if (!success) {
              return;
            }
            await Promise.all(pending.map((p) => p.wait()));
            setNextTX(i + 1);
          }
          onComplete?.();
        }}
      >
        Execute All
      </Button>
    </div>
  );
};
