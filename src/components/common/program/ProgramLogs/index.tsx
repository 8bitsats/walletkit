import type { InstructionLogs } from "@saberhq/solana-contrib";
import type { Message, ParsedMessage } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { darken } from "polished";
import React, { useMemo } from "react";
import invariant from "tiny-invariant";
import { css, theme } from "twin.macro";

import { useProgramMetas } from "../../../../hooks/useProgramMeta";
import { programLabel } from "../../../../utils/programs";
import { Badge } from "../../Badge";
import { TableCardBody } from "../../card/TableCardBody";
import { RenderedLogEntry } from "./RenderedLogEntry";

interface Props {
  message: Message | ParsedMessage;
  logs: InstructionLogs[];
}

export const ProgramLogs: React.FC<Props> = ({ message, logs }: Props) => {
  const { instructions, programIDs } = useMemo(() => {
    const instructions = message.instructions.map((ix) => {
      let programId: PublicKey;
      if ("programIdIndex" in ix) {
        const programAccount = message.accountKeys[ix.programIdIndex];
        invariant(programAccount);
        if ("pubkey" in programAccount) {
          programId = programAccount.pubkey;
        } else {
          programId = programAccount;
        }
      } else {
        programId = ix.programId;
      }
      return { programId, ix };
    });
    const programIDs = instructions.map((ix) => ix.programId);
    return { instructions, programIDs };
  }, [message]);

  const ixMetas = useProgramMetas(programIDs);
  return (
    <div tw="overflow-x-auto whitespace-nowrap">
      <TableCardBody>
        {instructions.map(({ programId }, index) => {
          const programName =
            ixMetas.find((m) => m.data?.programID.equals(programId))?.data?.meta
              ?.label ??
            programLabel(programId.toBase58()) ??
            "Unknown Program";
          const programLogs: InstructionLogs | undefined = logs[index];

          let badgeColor: string = theme`colors.white`;
          if (programLogs) {
            badgeColor = programLogs.failed
              ? theme`colors.accent`
              : theme`colors.primary`;
          }

          const cpiStack: PublicKey[] = [programId];
          return (
            <tr key={index}>
              <td>
                <div tw="flex items-center gap-2 text-sm">
                  <Badge
                    css={css`
                      background-color: ${darken(0.3, badgeColor)};
                      color: ${badgeColor};
                    `}
                    tw="h-auto"
                  >
                    #{index + 1}
                  </Badge>
                  <span tw="font-bold text-white">
                    {programName} Instruction
                  </span>
                </div>
                {programLogs && (
                  <div tw="flex items-start flex-col font-mono p-2 text-sm">
                    {programLogs.logs.map((log, key) => {
                      if (log.type === "cpi" && log.programAddress) {
                        cpiStack.push(new PublicKey(log.programAddress));
                      } else if (log.type === "success") {
                        cpiStack.pop();
                      }
                      return (
                        <RenderedLogEntry
                          key={key}
                          entry={log}
                          currentProgramId={cpiStack[cpiStack.length - 1]}
                        />
                      );
                    })}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </TableCardBody>
    </div>
  );
};
