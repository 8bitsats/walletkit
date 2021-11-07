import { NavLink } from "react-router-dom";
import tw, { css } from "twin.macro";

interface Props {
  options: readonly {
    label: string;
    path: string;
  }[];
}

export const NavTabs: React.FC<Props> = ({ options }: Props) => (
  <div tw="p-1 mx-auto flex gap-0.5 grid-flow-col bg-gray-100 rounded-2xl text-sm">
    {options.map(({ label, path }) => {
      return (
        <NavLink to={path} key={path} activeClassName="selected">
          <button
            css={css`
              ${tw`font-sans font-semibold px-4 py-2 rounded-2xl w-[120px] grid justify-items-center text-gray-700`}
              ${tw`hover:(bg-gray-800 bg-opacity-20)`}
              .selected > & {
                ${tw`bg-gray-900 text-white shadow`}
              }
            `}
          >
            <span>{label}</span>
          </button>
        </NavLink>
      );
    })}
  </div>
);
