import { NavLink } from "react-router-dom";
import tw, { css } from "twin.macro";

type Props = React.ComponentProps<typeof NavLink>;

export const SidebarNavLink = (props: Props) => {
  return (
    <NavLink
      tw="text-gray-700 text-sm font-medium h-7 flex items-center px-5 rounded cursor-pointer hover:(bg-gray-100)"
      activeClassName="is-active"
      css={css`
        &.is-active {
          ${tw`bg-gray-100`}
        }
      `}
      {...props}
    />
  );
};
