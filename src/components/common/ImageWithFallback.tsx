import styled from "@emotion/styled";
import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { useEffect, useState } from "react";
import tw from "twin.macro";

interface Props
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src?: string;
  size?: number;
  className?: string;
  alt: string;
}

export const ImageWithFallback: React.FC<Props> = ({
  className,
  src,
  size = 28,
  alt,
  ...imageProps
}: Props) => {
  const [invalid, setInvalid] = useState<boolean>(false);
  useEffect(() => {
    setInvalid(false);
  }, [src]);
  return (
    <Wrapper className={className} size={size}>
      {invalid || !src ? (
        <Placeholder />
      ) : (
        <img
          {...imageProps}
          src={src}
          onError={() => {
            setInvalid(true);
          }}
          alt={alt}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ size: number }>`
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  & > img {
    height: 100%;
    width: 100%;
  }
  ${tw`rounded-full overflow-hidden`}
`;

const Placeholder = styled.div`
  height: 100%;
  width: 100%;
  border: 1px dashed #ccc;
  border-radius: 100%;
`;
