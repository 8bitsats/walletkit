import { useToken } from "@quarryprotocol/react-quarry";
import { TokenAmount } from "@saberhq/token-utils";

import type { TransferChecked } from "../../../../../../../../utils/instructions/token/types";
import { AddressLink } from "../../../../../../../common/AddressLink";
import { LoadingSpinner } from "../../../../../../../common/LoadingSpinner";
import { TokenAmountDisplay } from "../../../../../../../common/TokenAmountDisplay";
import { Box } from "../Box";

interface Props {
  data: TransferChecked;
}

export const Transfer: React.FC<Props> = ({
  data: {
    mint,
    tokenAmount: { amount },
    destination,
  },
}: Props) => {
  const token = useToken(mint);
  const amt = token ? new TokenAmount(token, amount) : token;

  return (
    <Box title="Summary">
      {amt ? (
        <div tw="inline-flex items-center gap-2">
          Transfer <TokenAmountDisplay amount={amt} showIcon /> to{" "}
          <AddressLink address={destination} />
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </Box>
  );
};
