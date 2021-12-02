import type { ParsedInstruction } from "../../../../../../../hooks/useSmartWallet";
import type { SystemProgramInstruction } from "../../../../../../../utils/instructions/parseNonAnchorInstruction";
import { AttributeList } from "../../../../../../common/AttributeList";
import { Box } from "./Box";
import { IXAccounts } from "./IXAccounts";
import { IXArguments } from "./IXArguments";
import { IXData } from "./IXData";
import { Transfer } from "./token/Transfer";

interface Props {
  instruction: ParsedInstruction;
}

export const InstructionDisplay: React.FC<Props> = ({ instruction }: Props) => {
  if (!instruction.parsed || "error" in instruction.parsed) {
    return (
      <div tw="grid gap-4">
        <IXData
          data={instruction.ix.data}
          error={
            instruction.parsed && "error" in instruction.parsed
              ? instruction.parsed.error
              : null
          }
        />
        <IXAccounts accounts={instruction.ix.keys} />
      </div>
    );
  }

  if ("anchor" in instruction.parsed) {
    return (
      <div tw="grid gap-4">
        <IXArguments parsed={instruction.parsed} />
        <IXAccounts accounts={instruction.parsed.accounts} />
      </div>
    );
  }

  const { program, accountLabels, name: _name, ...rest } = instruction.parsed;
  return (
    <div tw="grid gap-4">
      {program === "upgradeable_loader" &&
        // hide data if there is none
        instruction.ix.data.length !== 4 && (
          <IXData data={instruction.ix.data} />
        )}
      {program === "system" &&
        ((rest as SystemProgramInstruction).decoded ? (
          <Box title="Arguments" tw="p-0">
            <AttributeList
              attributes={
                (rest as SystemProgramInstruction).decoded as Record<
                  string,
                  unknown
                >
              }
            />
          </Box>
        ) : (
          <IXData data={instruction.ix.data} />
        ))}
      {program === "memo" && (
        <Box title="Memo Text">
          <p>{instruction.parsed.text}</p>
        </Box>
      )}
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
