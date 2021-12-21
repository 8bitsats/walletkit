import { ErrorBoundary } from "@sentry/react";
import { Link } from "react-router-dom";

import { HelperCard } from "../HelperCard";

interface Props {
  className?: string;
  title?: React.ReactNode;
  titleStyles?: React.CSSProperties;
  children?: React.ReactNode;
  link?: {
    title: string;
    href?: string;
  };
}

export const Card: React.FC<Props> = ({
  className,
  title,
  titleStyles,
  children,
  link,
}: Props) => {
  return (
    <div
      className={className}
      tw="rounded bg-warmGray-850 shadow-xl flex flex-col"
    >
      {title && (
        <div
          tw="h-16 flex items-center px-7 w-full text-white font-bold tracking-tight border-b border-warmGray-800"
          style={titleStyles}
        >
          {typeof title === "string" ? <h2>{title}</h2> : title}
        </div>
      )}
      <ErrorBoundary
        fallback={
          <HelperCard variant="error">An unexpected error occurred.</HelperCard>
        }
      >
        <div>{children}</div>
      </ErrorBoundary>
      {link &&
        (link.href ? (
          <Link to={link.href} tw="text-white hover:text-primary">
            <div tw="flex items-center justify-center py-5 text-xs uppercase font-bold tracking-widest border-t border-warmGray-800">
              {link.title}
            </div>
          </Link>
        ) : (
          <div tw="flex items-center justify-center py-5 text-xs uppercase font-bold tracking-widest border-t border-warmGray-800 text-warmGray-600 cursor-not-allowed">
            {link.title}
          </div>
        ))}
    </div>
  );
};
