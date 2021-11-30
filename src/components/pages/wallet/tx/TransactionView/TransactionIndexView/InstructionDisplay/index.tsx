import type { ParsedInstruction } from "../../../../../../../hooks/useSmartWallet";
import { Box } from "./Box";
import { IXAccounts } from "./IXAccounts";
import { IXData } from "./IXData";
import { Transfer } from "./token/Transfer";

interface Props {
  instruction: ParsedInstruction;
}

export const InstructionDisplay: React.FC<Props> = ({ instruction }: Props) => {
  if (!instruction.parsed) {
    return <div />;
  }

  if ("anchor" in instruction.parsed) {
    return (
      <div tw="grid gap-4">
        <IXData parsed={instruction.parsed} />
        <IXAccounts accounts={instruction.parsed.accounts} />
      </div>
    );
  }

  const { program, accountLabels, name: _name, ...rest } = instruction.parsed;
  if (program === "memo") {
    return (
      <Box title="Memo Text">
        <p>{instruction.parsed.text}</p>
      </Box>
    );
  }

  return (
    <div tw="grid gap-4">
      {"data" in rest && rest.type === "transfer2" && rest.data && (
        <div>
          <Transfer data={rest.data} />
        </div>
      )}
      <IXAccounts
        accounts={instruction.ix.keys.map((k, i) => ({
          ...k,
          name: accountLabels?.[i],
        }))}
      />
    </div>
  );
};
