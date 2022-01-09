import { useRewarder } from "@quarryprotocol/react-quarry";

import { TableCardBody } from "../../../../common/card/TableCardBody";
import { LoadingPage } from "../../../../common/LoadingPage";
import { ModalButton } from "../../../../common/Modal/ModalButton";
import { useAllGauges } from "../hooks/useGauges";
import { GaugeWeightRow } from "./GaugeWeightRow";
import { SetWeightsModal } from "./SetWeightsModal";
import { useUpdateGaugeWeights } from "./useUpdateGaugeWeights";

export const GaugeWeightsForm: React.FC = () => {
  const { quarries, quarriesLoading } = useRewarder();
  const { sharesDiff } = useUpdateGaugeWeights();
  const { gauges } = useAllGauges();
  if (quarriesLoading) {
    return <LoadingPage tw="p-16" />;
  }

  return (
    <>
      <div tw="overflow-x-auto">
        <TableCardBody
          head={
            <tr>
              <th>Token</th>
              <th>Current Share (%)</th>
              <th>Weight</th>
              <th>New Share (%)</th>
            </tr>
          }
        >
          {quarries.map((quarry) =>
            gauges.find(
              (gauge) =>
                gauge?.accountInfo.data.quarry.equals(quarry.key) &&
                !gauge.accountInfo.data.isDisabled
            ) ? (
              <GaugeWeightRow key={quarry.key.toString()} quarry={quarry} />
            ) : null
          )}
        </TableCardBody>
      </div>
      <div tw="w-full flex flex-col items-center p-8">
        <ModalButton
          buttonLabel="Update Gauge Weights"
          buttonProps={{
            disabled: sharesDiff.length === 0,
          }}
        >
          <SetWeightsModal />
        </ModalButton>
      </div>
    </>
  );
};
