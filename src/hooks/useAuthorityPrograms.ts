import { utils } from "@project-serum/anchor";
import { u64 } from "@saberhq/token-utils";
import { useSolana } from "@saberhq/use-solana";
import { PublicKey } from "@solana/web3.js";
import { useQueries, useQuery } from "react-query";
import invariant from "tiny-invariant";

const BPF_UPGRADEABLE_LOADER_ID = new PublicKey(
  "BPFLoaderUpgradeab1e11111111111111111111111"
);

const ACCOUNT_TYPE_SIZE = 4;
const SLOT_SIZE = 8; // size_of::<u64>();
const OPTION_SIZE = 1;
const PUBKEY_LEN = 32;

export interface ProgramInfo {
  programID: PublicKey;
  programData: PublicKey;
  programDataLamports: number;
  lastDeploySlot: number;
  upgradeAuthority: PublicKey;
}

export const useAuthorityPrograms = (address: PublicKey | null | undefined) => {
  const { connection } = useSolana();
  const programData = useQuery(
    ["programDataForAuthority", address?.toString()],
    async () => {
      invariant(address, "address");
      // https://github.com/solana-labs/solana/blob/master/cli/src/program.rs#L1191
      const raw = await connection.getProgramAccounts(
        BPF_UPGRADEABLE_LOADER_ID,
        {
          dataSlice: {
            offset: 0,
            length: ACCOUNT_TYPE_SIZE + SLOT_SIZE + OPTION_SIZE + PUBKEY_LEN,
          },
          filters: [
            {
              memcmp: {
                offset: ACCOUNT_TYPE_SIZE + SLOT_SIZE,
                bytes: utils.bytes.bs58.encode(
                  Buffer.from(new Uint8Array([1]))
                ),
              },
            },
            {
              memcmp: {
                offset: ACCOUNT_TYPE_SIZE + SLOT_SIZE + OPTION_SIZE,
                bytes: address.toBase58(),
              },
            },
          ],
        }
      );
      return await Promise.all(
        raw.map(({ pubkey, account }) => {
          const slot = u64
            .fromBuffer(
              account.data.slice(
                ACCOUNT_TYPE_SIZE,
                ACCOUNT_TYPE_SIZE + SLOT_SIZE
              )
            )
            .toNumber();
          return {
            pubkey,
            lastDeploySlot: slot,
            lamports: account.lamports,
            upgradeAuthority: address,
          };
        })
      );
    },
    {
      enabled: !!address,
    }
  );

  return useQueries(
    programData.data?.map(
      ({
        pubkey,
        lamports: programDataLamports,
        lastDeploySlot,
        upgradeAuthority,
      }) => ({
        queryKey: ["programForProgramData", pubkey.toString()],
        queryFn: async (): Promise<ProgramInfo | null> => {
          // https://github.com/solana-labs/solana/blob/master/cli/src/program.rs#L1191
          const raw = await connection.getProgramAccounts(
            BPF_UPGRADEABLE_LOADER_ID,
            {
              filters: [
                {
                  memcmp: {
                    offset: 0,
                    bytes: utils.bytes.bs58.encode(
                      Buffer.from(
                        new Uint8Array([2, 0, 0, 0, ...pubkey.toBytes()])
                      )
                    ),
                  },
                },
              ],
            }
          );
          if (raw.length > 1) {
            throw new Error(
              `Multiple program accounts found for program data account ${pubkey.toString()}`
            );
          }
          const account = raw[0];
          if (!account) {
            return null;
          }
          return {
            programID: account.pubkey,
            programData: pubkey,
            programDataLamports,
            lastDeploySlot,
            upgradeAuthority,
          };
        },
      })
    ) ?? []
  );
};
