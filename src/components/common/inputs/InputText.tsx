import tw, { styled } from "twin.macro";

const COMMON = [
  tw`py-1.5 px-3 border border-gray-200 rounded m-0 transition-colors appearance-none text-sm outline-none`,
  tw`focus:(ring-1 ring-primary-300)`,
  tw`dark:(bg-gray-850 border-gray-700 focus:bg-transparent text-white)`,
];

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
  & > option {
    ${tw`text-black`}
  }
`;

export const Radio = styled.input``;
