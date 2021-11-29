import type { ParsedInstruction } from "../../../../../../../hooks/useSmartWallet";

interface Props {
  instruction: ParsedInstruction;
}

export const IXData: React.FC<Props> = ({ instruction: { parsed } }: Props) => {
  return (
    <div tw="border rounded text-sm">
      <h2 tw="px-6 py-2 font-semibold text-gray-800">
        Arguments ({parsed?.args.length})
      </h2>
      {parsed?.args.map((arg, i) => {
        return (
          <div
            key={`arg_${i}`}
            tw="px-6 py-2 flex items-center justify-between border-t border-t-gray-150 gap-4"
          >
            <div tw="flex gap-4 flex-shrink-0">
              <span tw="text-gray-500 font-semibold">{arg.name}</span>
              <code tw="text-gray-500 font-medium font-mono">{arg.type}</code>
            </div>
            <div tw="text-gray-800 font-medium flex-shrink flex-wrap word-break[break-word]">
              {arg.data}
            </div>
          </div>
        );
      })}
    </div>
  );
};
