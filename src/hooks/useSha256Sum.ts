import { useQuery } from "react-query";

import { generateSHA256BufferHash } from "../utils/crypto";

export const useSha256Sum = (buffer: Buffer) => {
  return useQuery(["sha256sum", buffer.toString("hex")], async () => {
    return await generateSHA256BufferHash(buffer);
  });
};
