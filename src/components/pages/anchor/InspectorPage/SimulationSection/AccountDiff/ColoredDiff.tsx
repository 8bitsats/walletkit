import type * as Diff from "diff";
import tw from "twin.macro";

interface Props {
  parsed: {
    prevStr: string;
    nextStr: string;
    diff: Diff.Change[] | null;
  };
}

export const ColoredDiff: React.FC<Props> = ({ parsed }: Props) => {
  return (
    <div tw="grid font-mono py-4 w-full">
      {parsed.prevStr && !parsed.nextStr && (
        <pre tw="bg-red-500 bg-opacity-20 text-red-500 px-8 py-4">
          {parsed.prevStr}
        </pre>
      )}
      {!parsed.prevStr && parsed.nextStr && (
        <pre tw="bg-primary-500 bg-opacity-20 text-primary px-8 py-4">
          {parsed.nextStr}
        </pre>
      )}
      {parsed.diff && (
        <pre tw="w-full py-4">
          {parsed.diff.map((line, i) => {
            return (
              <div
                key={i}
                css={[
                  tw`w-full px-8`,
                  line.added && tw`bg-primary-500 bg-opacity-20 text-primary`,
                  line.removed && tw`bg-red-500 bg-opacity-20 text-red-500`,
                ]}
              >
                {line.added && "+ "}
                {line.removed && "- "}
                {line.value}
              </div>
            );
          })}
        </pre>
      )}
    </div>
  );
};
