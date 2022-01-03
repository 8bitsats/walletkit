import type { ReactNode } from "react";
import { useState } from "react";
import { FiCheckCircle, FiCopy, FiXCircle } from "react-icons/fi";

type CopyState = "copy" | "copied" | "errored";

export const Copyable = ({
  text,
  children,
  replaceText,
}: {
  text: string;
  children: ReactNode;
  replaceText?: boolean;
}) => {
  const [state, setState] = useState<CopyState>("copy");

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch (err) {
      setState("errored");
    }
    setTimeout(() => setState("copy"), 1000);
  };

  function CopyIcon() {
    if (state === "copy") {
      return (
        <button tw="cursor-pointer" onClick={handleClick}>
          <FiCopy />
        </button>
      );
    } else if (state === "copied") {
      return (
        <span>
          <FiCheckCircle />
        </span>
      );
    } else if (state === "errored") {
      return (
        <span title="Please check your browser's copy permissions.">
          <FiXCircle />
        </span>
      );
    }
    return null;
  }

  let message: string | undefined;
  if (state === "copied") {
    message = "Copied";
  } else if (state === "errored") {
    message = "Copy Failed";
  }

  function PrependCopyIcon() {
    return (
      <>
        <span tw="text-xs m-2">
          <span tw="flex items-center gap-1">
            {message !== undefined && <span>{message}</span>}
            <CopyIcon />
          </span>
        </span>
        {children}
      </>
    );
  }

  function ReplaceWithMessage() {
    return (
      <span tw="flex flex-col flex-nowrap">
        <span tw="text-xs">
          <span tw="flex items-center text-primary">
            <CopyIcon />
            <span tw="mx-2">{message}</span>
          </span>
        </span>
        <span tw="hidden">{children}</span>
      </span>
    );
  }

  if (state === "copy") {
    return <PrependCopyIcon />;
  } else if (replaceText) {
    return <ReplaceWithMessage />;
  }

  return (
    <>
      <span tw="hidden lg:inline">
        <PrependCopyIcon />
      </span>
      <span tw="inline lg:hidden">
        <ReplaceWithMessage />
      </span>
    </>
  );
};
