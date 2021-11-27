import type { IdlType } from "@project-serum/anchor/dist/cjs/idl";
import { u64 } from "@saberhq/token-utils";
import { useState } from "react";

import type { InstructionInfo } from ".";
import { AccountsForm } from "./AccountsForm";

interface Props {
  ix: InstructionInfo;
}

const parseArg = (type: IdlType, value: string): unknown => {
  switch (type) {
    case "u8":
    case "i8":
    case "u16":
    case "i16":
    case "u32":
    case "i32":
      return parseInt(value);
    case "u64":
      return new u64(value);
    default:
      JSON.parse(value);
  }
};

export const IXForm: React.FC<Props> = ({ ix }: Props) => {
  const [rawArgs, setRawArgs] = useState<string[]>(
    new Array(ix.instruction.args.length).map(() => "")
  );
  const [accountsStrs, setAccountsStrs] = useState<Record<string, string>>({});

  return (
    <div>
      {ix.instruction.name}
      {ix.instruction.args.length > 0 && (
        <div>
          <h3>Arguments</h3>
          <div tw="grid gap-1">
            {ix.instruction.args.map((arg, i) => (
              <input
                key={`arg_${i}`}
                type="string"
                placeholder={arg.name}
                value={
                  (rawArgs[i] as string | null | undefined)?.toString() ?? ""
                }
                onChange={(e) => {
                  setRawArgs((prev) => {
                    const next = prev.slice();
                    next[i] = e.target.value;
                    return next;
                  });
                }}
              />
            ))}
          </div>
        </div>
      )}
      <div>
        <h3>Accounts</h3>
        <div>
          <AccountsForm
            accountItems={ix.instruction.accounts}
            accountsStrs={accountsStrs}
            prefix=""
            onChange={(path, key) => {
              setAccountsStrs((value) => ({
                ...value,
                [path]: key,
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
};
