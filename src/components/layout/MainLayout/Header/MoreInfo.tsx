import { useRef, useState } from "react";
import { FaCode, FaEllipsisH, FaTwitter } from "react-icons/fa";

import appInfo from "../../../../app.json";
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
      <button
        ref={targetRef}
        onClick={() => {
          setShow(!show);
        }}
      >
        <div tw="text-xl">
          <FaEllipsisH />
        </div>
      </button>
      <Drop
        placement="bottom-end"
        show={show}
        onDismiss={() => setShow(false)}
        target={targetRef.current}
      >
        <div tw="flex flex-col flex-nowrap p-2 bg-white shadow border rounded dark:(bg-warmGray-850 border-warmGray-800)">
          {MORE_ITEMS.map((item) => (
            <a
              href={item.href}
              type="button"
              key={item.slug}
              target="_blank"
              rel="noopener noreferrer"
              tw="space-x-3 text-gray-900 hover:text-primary p-2 font-medium flex items-center appearance-none dark:(text-white hover:text-primary)"
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
