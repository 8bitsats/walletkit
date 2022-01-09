import { GaugeSDK } from "@quarryprotocol/gauge";
import { useMemo } from "react";

import { useSDK } from "../../../../contexts/sdk";

export const useGaugeSDK = () => {
  const { sdkMut } = useSDK();
  return useMemo(
    () => (sdkMut ? GaugeSDK.load({ provider: sdkMut.provider }) : null),
    [sdkMut]
  );
};
