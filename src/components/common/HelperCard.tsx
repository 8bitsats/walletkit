import tw from "twin.macro";

interface Props {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "muted" | "error" | "warn";
}

export const HelperCard: React.FC<Props> = ({
  children,
  variant = "primary",
  className,
}: Props) => {
  return (
    <div
      css={[
        tw`px-4 py-2 rounded border text-sm`,
        variant === "primary" &&
          tw`border-primary bg-primary bg-opacity-20 text-primary-100`,
        variant === "error" &&
          tw`border-red-500 bg-red-500 bg-opacity-20 text-red-100`,
        variant === "muted" &&
          tw`border-slate-500 bg-slate-500 bg-opacity-40 text-slate-200`,
        variant === "warn" &&
          tw`border-yellow-500 bg-yellow-500 text-yellow-500 bg-opacity-20`,
      ]}
      className={className}
    >
      {children}
    </div>
  );
};
