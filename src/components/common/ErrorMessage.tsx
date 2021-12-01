import { extractErrorMessage } from "@saberhq/sail";

interface Props {
  prefix?: string;
  error: unknown;
}

export const ErrorMessage: React.FC<Props> = ({ prefix, error }: Props) => {
  const message = extractErrorMessage(error);
  return (
    <div tw="text-red-500 text-sm px-3 py-2 border-accent-200">
      <span>
        {prefix ? `${prefix}: ` : ""}
        {message ?? "Unknown error"}
      </span>
    </div>
  );
};
