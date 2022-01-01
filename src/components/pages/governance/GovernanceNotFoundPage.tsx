import { FaRegQuestionCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { EmptyState } from "../../common/EmptyState";
import { Card } from "../../common/governance/Card";

export const GovernanceNotFoundPage: React.FC = () => {
  const { governor: governorStr } = useParams<{ governor: string }>();
  return (
    <div tw="w-full">
      <div tw="bg-warmGray-900 pb-24">
        <PageContainer>
          <div tw="flex flex-col gap-4 md:(gap-8 flex-row min-h-[120px]) flex-wrap items-center justify-between w-full">
            <div tw="flex flex-col self-start md:self-center">
              <h1 tw="text-2xl md:text-3xl font-bold text-white tracking-tighter">
                Not Found
              </h1>
            </div>
          </div>
        </PageContainer>
      </div>
      <PageContainer>
        <main tw="w-full -mt-16 mb-20">
          <Card title="Governance Not Found">
            <EmptyState
              icon={<FaRegQuestionCircle />}
              title="Governance Not Found"
            >
              <div tw="max-w-sm text-center mt-4">
                <p>
                  We couldn't find a DAO at {governorStr}. Please check the
                  address and try again.
                </p>
              </div>
            </EmptyState>
          </Card>
        </main>
      </PageContainer>
    </div>
  );
};

const PageContainer = styled.div(() => tw`max-w-5xl w-11/12 mx-auto`);
