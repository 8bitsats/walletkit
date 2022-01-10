import type { InstructionLogEntry } from "@saberhq/solana-contrib";
import { theme } from "twin.macro";

export type LogStyle = "muted" | "info" | "success" | "warning";

export const styleColor = (style: InstructionLogEntry["type"]): string => {
  switch (style) {
    case "text":
      return theme`colors.white`;
    case "cpi":
    case "system":
      return theme`colors.blue.400`;
    case "success":
      return theme`colors.primary.500`;
    case "programError":
    case "runtimeError":
      return theme`colors.accent.500`;
  }
};
