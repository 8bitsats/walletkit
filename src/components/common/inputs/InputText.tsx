import tw, { styled } from "twin.macro";

const COMMON = tw`py-1.5 px-3 border border-gray-200 rounded m-0 transition-colors appearance-none text-sm`;

export const InputText = styled.input`
  ${tw`h-8`}
  ${COMMON}
`;

export const Textarea = styled.textarea`
  ${tw`h-8`}
  ${COMMON}
`;

export const Select = styled.select`
  ${COMMON}
`;
