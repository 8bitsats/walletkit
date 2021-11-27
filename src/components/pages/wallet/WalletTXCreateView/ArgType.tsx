import type { IdlType } from "@project-serum/anchor/dist/esm/idl";

interface Props {
  type: IdlType;
}

export const ArgType: React.FC<Props> = ({ type }: Props) => {
  if (typeof type === "string") {
    return <>{type}</>;
  }

  return <>{JSON.stringify(type)}</>;
};
