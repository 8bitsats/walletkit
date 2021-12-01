import { useRef, useState } from "react";
import { FaCode, FaEllipsisH, FaTwitter } from "react-icons/fa";

import appInfo from "../../../../app.json";
import { StyledButton } from "../../../common/Button";
import { Drop } from "../../../common/Drop";

export const MoreInfo: React.FC = () => {
  const [show, setShow] = useState(false);
  const targetRef = useRef(null);
  const MORE_ITEMS = [
    // {
    //   label: "Medium",
    //   slug: "medium",
    //   href: `https://medium.com/${appInfo.socials.medium}`,
    //   icon: <FaMedium />,
    // },
    {
      label: "Twitter",
      slug: "twitter",
      href: `https://twitter.com/${appInfo.socials.twitter}`,
      icon: <FaTwitter />,
    },
    // {
    //   label: "Chat",
    //   href: `https://keybase.io/team/${appInfo.socials.keybase}`,
    //   slug: "chat",
    //   icon: <IoMdChatboxes />,
    // },
    {
      label: "Code",
      href: appInfo.code,
      slug: "code",
      icon: <FaCode />,
    },
  ];

  return (
    <>
      <StyledButton
        variant="outline"
        ref={targetRef}
        onClick={() => {
          setShow(!show);
        }}
      >
        <div tw="text-xl">
          <FaEllipsisH />
        </div>
      </StyledButton>

      <Drop
        placement="bottom-end"
        show={show}
        onDismiss={() => setShow(false)}
        target={targetRef.current}
      >
        <div tw="flex flex-col flex-nowrap p-2 bg-gray-100 rounded-lg">
          {MORE_ITEMS.map((item) => (
            <a
              href={item.href}
              type="button"
              key={item.slug}
              target="_blank"
              rel="noopener noreferrer"
              tw="space-x-3 text-gray-900 hover:text-primary p-2 font-medium flex items-center appearance-none"
            >
              <div>{item.icon}</div>
              <div>{item.label}</div>
            </a>
          ))}
        </div>
      </Drop>
    </>
  );
};
