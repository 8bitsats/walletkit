import { chunks } from "@saberhq/sail";

import type { InstructionParseError } from "../../../../../../../utils/instructions/parseNonAnchorInstruction";
import { Box } from "./Box";

interface Props {
  data: Buffer;
  error?: InstructionParseError | null;
}

export const IXData: React.FC<Props> = ({ data, error }: Props) => {
  return (
    <Box title={`Instruction Data (${data.length} bytes)`}>
      {error && (
        <div tw="text-red-500 text-sm mb-2">
          Error parsing instruction: {error.message}
        </div>
      )}
      {data.length > 0 ? (
        <pre tw="whitespace-pre-wrap bg-accent-50 bg-opacity-30 px-3 py-2 border border-accent-100 rounded">
          <code>
            {chunks(data.toString("hex").split(""), 2)
              .map((x) => x.join(""))
              .join(" ")}
          </code>
        </pre>
      ) : (
        <span tw="text-secondary text-sm">
          <em>(empty)</em>
        </span>
      )}
    </Box>
  );
};
