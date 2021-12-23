import { css } from "twin.macro";

const ALLIANCE = [
  ["arrow", "arrowprotocol.com"],
  ["asol", "asol.so"],
  ["cashio", "cashio.app"],
  ["clb", "clb.exchange"],
  ["crate", "crate.so"],
  ["deltaone", "deltaone.xyz"],
  ["goki", "goki.so"],
  ["pole", "pole.finance"],
  ["port", "port.finance"],
  ["quarry", "quarry.so"],
  ["saber", "saber.so"],
  ["sencha", "sencha.so"],
  ["shipcapital", "ship.capital"],
  ["sunny", "sunny.ag"],
  ["traction", "traction.so"],
] as const;

export const Alliance: React.FC = () => {
  return (
    <div tw="mx-auto w-11/12 max-w-5xl">
      <div tw="text-center">
        <h2 tw="text-white text-5xl font-semibold mb-6">
          The Tribeca Alliance
        </h2>
        <div tw="max-w-md mx-auto">
          <p tw="text-warmGray-400 text-2xl">
            Tribeca is an open source governance primitive built by an alliance
            of Solana's leading protocols.
          </p>
        </div>
      </div>
      <div tw="flex flex-wrap items-center justify-center gap-2.5 my-16">
        {ALLIANCE.map(([name, href]) => (
          <a
            key={name}
            href={`https://${href}`}
            target="_blank"
            tw="flex items-center justify-center h-44 w-44 px-4 border border-coolGray-800 rounded"
            css={css`
              background: linear-gradient(
                rgb(11, 11, 14) 0%,
                rgb(5, 5, 7) 100%
              );
              &:hover {
                background: linear-gradient(
                  rgb(22, 22, 27) 0%,
                  rgb(26, 26, 35) 100%
                );
              }
            `}
            rel="noreferrer"
          >
            <img
              tw="h-14"
              src={`/images/tribeca/alliance/${name}.svg`}
              alt={`Logo for ${name}`}
            />
          </a>
        ))}
      </div>
    </div>
  );
};
