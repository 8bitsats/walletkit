import { QuarrySDKProvider } from "@quarryprotocol/react-quarry";
import React from "react";

import { useEnvironment } from "../utils/useEnvironment";

interface Props {
  children?: React.ReactNode;
}

export const QuarryInterfaceProvider: React.FC<Props> = ({
  children,
}: Props) => {
  const { tokenMap } = useEnvironment();
  return (
    <QuarrySDKProvider initialState={{ tokenMap: tokenMap ?? undefined }}>
      {children}
    </QuarrySDKProvider>
  );
};
