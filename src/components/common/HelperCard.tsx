import tw from "twin.macro";

interface Props {
  children?: React.ReactNode;
  variant?: "primary" | "muted" | "error";
}

export const HelperCard: React.FC<Props> = ({
  children,
  variant = "primary",
}: Props) => {
  return (
    <div
      css={[
        variant === "primary" && tw`border-primary bg-primary text-primary-100`,
        variant === "error" && tw`border-red-500 bg-red-500 text-red-100`,
        tw`px-4 py-2 rounded border bg-opacity-20  text-sm`,
      ]}
    >
      {children}
    </div>
  );
};
