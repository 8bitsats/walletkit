import { VoteSide } from "@tribecahq/tribeca-sdk";
import { theme } from "twin.macro";

export const sideColor = (side: VoteSide) =>
  side === VoteSide.For
    ? theme`colors.primary`
    : side === VoteSide.Against
    ? theme`colors.red.500`
    : side === VoteSide.Abstain
    ? theme`colors.yellow.500`
    : theme`colors.transparent`;
