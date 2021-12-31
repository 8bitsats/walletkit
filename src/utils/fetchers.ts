import type { Idl } from "@project-serum/anchor";

export const fetchIDL = async (address: string): Promise<Idl | null> => {
  const response = await fetch(
    `https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/idls/${address}.json`
  );
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return (await response.json()) as Idl;
};
