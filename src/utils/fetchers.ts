import type { Idl } from "@project-serum/anchor";

export const fetchIDL = async (address: string): Promise<Idl> => {
  const response = await fetch(
    `https://raw.githubusercontent.com/GokiProtocol/anchor-idl-registry/main/data/mainnet-beta/${address}/idl.json`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return (await response.json()) as Idl;
};
