const makeURL = (programID: string) =>
  `https://raw.githubusercontent.com/DeployDAO/solana-program-index/master/programs/${programID}.json`;

export interface ProgramMeta {
  label: string;
}

export const fetchProgramMeta = async (
  address: string
): Promise<ProgramMeta | null> => {
  const response = await fetch(makeURL(address));
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return (await response.json()) as ProgramMeta;
};
