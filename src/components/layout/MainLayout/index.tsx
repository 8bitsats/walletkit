import styled from "@emotion/styled";
import type { ReactNode } from "react";
import React from "react";
import tw from "twin.macro";

import { Header } from "./Header";
import { PageLayout } from "./PageLayout";

interface Props {
  sideNav?: React.ReactNode;
  hideOptions?: boolean;
  children: ReactNode | ReactNode[];
}

export const MainLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <PageWrapper>
      <div tw="w-11/12 mx-auto">
        <Header />
      </div>
      <PageLayout>{children}</PageLayout>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  ${tw`relative`}
`;
