import { FaExclamationTriangle } from "react-icons/fa";

import { MouseoverTooltip } from "../../../../common/MouseoverTooltip";

export const LockupTooShortTooltip = () => {
  return (
    <MouseoverTooltip
      text={
        <div tw="max-w-sm">
          <p>
            Your voting escrow expires before the start of the next epoch.
            Please extend your lockup to have your gauge vote count.
          </p>
        </div>
      }
      placement="bottom-start"
    >
      <FaExclamationTriangle
        tw="h-4 cursor-pointer inline-block align-middle mx-3 mb-0.5"
        color="#9945FF"
      />
    </MouseoverTooltip>
  );
};
