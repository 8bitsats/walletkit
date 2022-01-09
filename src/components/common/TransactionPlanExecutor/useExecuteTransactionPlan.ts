import type { TransactionPlan } from "./plan";

export const useExecuteTransactionPlan = (plan: TransactionPlan) => {
  return { plan };
};
