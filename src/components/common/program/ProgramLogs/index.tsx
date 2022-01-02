import type { Message, ParsedMessage, PublicKey } from "@solana/web3.js";
import { darken } from "polished";
import React, { useMemo } from "react";
import invariant from "tiny-invariant";
import { css } from "twin.macro";

import { useProgramMetas } from "../../../../hooks/useProgramMeta";
import { programLabel } from "../../../../utils/programs";
import type { InstructionLogs } from "../../../pages/anchor/InspectorPage/programLogsV2";
import { styleColor } from "../../../pages/anchor/InspectorPage/programLogsV2";
import { Badge } from "../../Badge";
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
    <div tw="px-5 py-3 overflow-x-auto whitespace-nowrap">
      <table>
        {instructions.map(({ programId }, index) => {
          const programName =
            ixMetas.find((m) => m.data?.programID.equals(programId))?.data?.meta
              ?.label ??
            programLabel(programId.toBase58()) ??
            "Unknown Program";
          const programLogs: InstructionLogs | undefined = logs[index];

          let badgeColor: "white" | "warning" | "success" = "white";
          if (programLogs) {
            badgeColor = programLogs.failed ? "warning" : "success";
          }

          return (
            <tr key={index}>
              <td>
                <div tw="flex items-center gap-2 text-sm">
                  <Badge
                    css={css`
                      background-color: ${darken(0.3, styleColor(badgeColor))};
                      color: ${styleColor(badgeColor)};
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
                      return <RenderedLogEntry key={key} entry={log} />;
                    })}
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};
