import { Module } from "../../common/Module";

/**
 * https://www.typewolf.com/lookbooks
 */
export const IndexView: React.FC = () => {
  return (
    <div tw="grid gap-4 w-[704px] max-w-full mx-auto justify-between">
      <Module>
        <div tw="prose">
          <h1 tw="text-6xl! font-bold mb-0!">Goki Protocol</h1>
          <p tw="text-3xl! text-secondary! leading-9 my-4!">
            Launch staking derivatives for the protocols you're already
            integrating with, redirecting yield to a different address.
          </p>
          <p>
            Building a community is hard enough. Protocol integrations can be
            repetitive and time consuming. Arrow tokenizes your yield-generating
            assets into a staking derivative so you can focus on attracting
            liquidity, not integrating obscure IDLs.
          </p>
          <p>Potential use cases include:</p>
          <ul>
            <li>
              <strong>Lending protocols.</strong> A lender may take{" "}
              <a
                href="https://saber.so"
                target="_blank"
                rel="noreferrer noopener"
              >
                Saber
              </a>{" "}
              LPs as collateral. By using Arrow, the lending protocol only needs
              to accept their Arrow for the corresponding LP token as
              collateral, and earns Saber and Sunny tokens for doing so.
            </li>
            <li>
              <strong>Crates.</strong> As{" "}
              <a
                href="https://crate.so"
                target="_blank"
                rel="noopener noreferrer"
              >
                Crates
              </a>{" "}
              may only hold tokens, they cannot directly integrate with farming
              pools. This tokenization allows the yields of underlying assets to
              get redirected to the creator of the Crate, or to the Crate
              itself, allowing for extremely composable yield aggregation.
            </li>
            <li>
              <strong>Community fundraising.</strong> A community can pool its
              yield-generating assets via an Arrow to help fund its operations.
              As these derivatives are tokens, the community has a very simple
              cap table they can use to ensure that its members are staking a
              minimum amount.
            </li>
            <li>
              <strong>Charitable organizations.</strong> One could create an
              Arrow which redirects yield to a charity, allowing users to donate
              to a cause without needing to spend any money. Notable prior work
              in this space includes{" "}
              <a
                href="https://rtrees.dappy.dev/"
                target="_blank"
                rel="noreferrer noopener"
              >
                rTrees
              </a>
              , a DAO which plants trees from DAI yield.
            </li>
          </ul>
          <p>
            Arrow's first integration is with the{" "}
            <a
              href="https://sunny.ag"
              target="_blank"
              rel="noreferrer noopener"
            >
              Sunny Aggregator
            </a>
            . As Sunny is built on top of Quarry, we expect Sunny to integrate
            with any future{" "}
            <a href="https://quarry.so" target="_blank" rel="noreferrer">
              Quarry
            </a>{" "}
            pools. At the time of writing, this will allow users to redirect
            Sunny and Saber yields.
          </p>
          <div tw="border-t border-t-gray-200 pt-3 w-32">
            <span role="img" aria-label="Up only">
              🔼 🏹
            </span>
          </div>
        </div>
      </Module>
    </div>
  );
};
