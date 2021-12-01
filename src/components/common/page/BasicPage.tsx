import { ErrorBoundary } from "@sentry/react";

interface Props {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const BasicPage: React.FC<Props> = ({
  title,
  description,
  children,
}: Props) => {
  return (
    <div tw="w-full pb-8">
      <div tw="w-full max-w-2xl mx-auto mt-16">
        <div>
          <h1 tw="text-2xl font-medium mb-1">{title}</h1>
          <p tw="text-secondary text-sm font-medium">{description}</p>
        </div>
        <div tw="border-b w-full bg-gray-100 my-6" />
        <ErrorBoundary
          fallback={
            <p tw="text-red-500">An error occurred while loading this page.</p>
          }
        >
          {children ?? <div />}
        </ErrorBoundary>
      </div>
    </div>
  );
};
