import { ErrorBoundary } from "@sentry/react";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const AnchorLayout: React.FC<Props> = ({ title, children }: Props) => {
  return (
    <div tw="w-full pb-8 px-4">
      <div tw="w-11/12 mx-auto mt-16">
        <div>
          <h1 tw="text-white text-2xl font-bold mb-1">{title}</h1>
        </div>
        <div tw="border-b w-full border-b-slate-700 my-6" />
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
