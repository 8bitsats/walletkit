import type { ProgramDeployBuffer } from "../../../../../../../hooks/useAuthorityPrograms";
import {
  truncateShasum,
  useSha256Sum,
} from "../../../../../../../hooks/useSha256Sum";
import { displayAddress } from "../../../../../../../utils/programs";

interface Props {
  buffer: ProgramDeployBuffer;
}

export const BufferOption: React.FC<Props> = ({ buffer }: Props) => {
  const { data: shasum } = useSha256Sum(buffer.executableData);
  return (
    <option key={buffer.pubkey.toString()} value={buffer.pubkey.toString()}>
      {displayAddress(buffer.pubkey.toString())}
      {shasum ? ` (SHA256: ${truncateShasum(shasum)})` : ""}
    </option>
  );
};
