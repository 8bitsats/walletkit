import { useRef, useState } from "react";
import {
  FaBook,
  FaCode,
  FaDiscord,
  FaEllipsisH,
  FaMedium,
  FaTwitter,
} from "react-icons/fa";

import { APP_CONFIG } from "../../../../config";
import { Drop } from "../../../common/Drop";

export const MoreInfo: React.FC = () => {
  const [show, setShow] = useState(false);
  const targetRef = useRef(null);
  const MORE_ITEMS = [
    APP_CONFIG.socials.medium && {
      label: "Medium",
      slug: "medium",
      href: `https://medium.com/@${APP_CONFIG.socials.medium}`,
      icon: <FaMedium />,
    },
    APP_CONFIG.socials.twitter && {
      label: "Twitter",
      slug: "twitter",
      href: `https://twitter.com/${APP_CONFIG.socials.twitter}`,
      icon: <FaTwitter />,
    },
    // {
    //   label: "Chat",
    //   href: `https://keybase.io/team/${APP_CONFIG.socials.keybase}`,
    //   slug: "chat",
    //   icon: <IoMdChatboxes />,
    // },
    APP_CONFIG.socials.discord && {
      label: "Discord",
      href: `https://discord.gg/${APP_CONFIG.socials.discord}`,
      slug: "discord",
      icon: <FaDiscord />,
    },
    APP_CONFIG.code && {
      label: "Code",
      href: APP_CONFIG.code,
      slug: "code",
      icon: <FaCode />,
    },
    APP_CONFIG.docs && {
      label: "Docs",
      href: APP_CONFIG.docs,
      slug: "docs",
      icon: <FaBook />,
    },
  ].filter(
    (
      x
    ): x is {
      label: string;
      href: string;
      slug: string;
      icon: React.ReactElement;
    } => !!x
  );

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
