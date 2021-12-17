import type { AnchorHTMLAttributes, ClassAttributes } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

type Props = ClassAttributes<HTMLAnchorElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export const ExternalLink = ({ children, ...anchorProps }: Props) => {
  return (
    <a
      tw="text-sm flex items-center gap-2 text-primary hover:text-white transition-colors"
      target="_blank"
      rel="noreferrer"
      {...anchorProps}
    >
      {children}
      <FaExternalLinkAlt />
    </a>
  );
};
