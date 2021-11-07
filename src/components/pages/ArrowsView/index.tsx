import { usePubkey } from "@quarryprotocol/react-quarry";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import invariant from "tiny-invariant";

import { Button } from "../../common/Button";
import { Module } from "../../common/Module";

export const ArrowsView: React.FC = () => {
  const [arrowMintStr, setArrowMintStr] = useState<string>("");
  const arrowMint = usePubkey(arrowMintStr);
  const history = useHistory();

  const disableReason = !arrowMintStr
    ? "Enter a mint address"
    : !arrowMint
    ? "Invalid key"
    : null;

  return (
    <div tw="grid gap-12 w-[400px] max-w-full mx-auto">
      <Module>
        <div tw="prose">
          <h1>Select an Arrow</h1>
          <p>
            Please specify the mint (address) of the Arrow you are looking to
            interact with.
          </p>
        </div>
        <div tw="grid gap-4 p-4 rounded border mt-4">
          <label>
            <span>Arrow Mint</span>
            <input
              type="text"
              tw="mt-1 w-full"
              placeholder="Enter a mint"
              onChange={(e) => {
                setArrowMintStr(e.target.value);
              }}
              value={arrowMintStr}
            />
          </label>
          <div tw="mt-4">
            <Button
              size="md"
              disabled={!!disableReason}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                invariant(arrowMint, "arrowMint");
                history.push(`/arrow/${arrowMint.toString()}`);
              }}
            >
              {disableReason ?? "View Arrow"}
            </Button>
          </div>
        </div>
      </Module>
    </div>
  );
};
