import type { TransactionEnvelope } from "@saberhq/solana-contrib";

export interface TransactionPlan {
  /**
   * Steps of the plan.
   */
  steps: {
    /**
     * Title of the transaction(s).
     */
    title: string;
    /**
     * Transactions involved in this step of the plan.
     * These transactions will be sent in parallel.
     */
    txs: TransactionEnvelope[];
  }[];
}
