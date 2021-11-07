import "twin.macro";

import { ErrorBoundary } from "@sentry/react";

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export const Module: React.FC<Props> = ({ children, className }: Props) => {
  return (
    <div
      tw="px-4 py-6 md:p-12 rounded bg-white w-full shadow-2xl"
      className={className}
    >
      <ErrorBoundary
        fallback={
          <p tw="text-red-500">
            An error occurred while loading this component.
          </p>
        }
      >
        {children}
      </ErrorBoundary>
    </div>
  );
};
