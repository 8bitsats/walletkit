import SentryWebpackPlugin from "@sentry/webpack-plugin";
import deepMerge from "deepmerge";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";
import fs from "fs";
import type HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import invariant from "tiny-invariant";
import type { Configuration } from "webpack";
import webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

import appConfigs from "./src/config/app.json";

const now = Math.floor(new Date().getTime() / 1000);

const srcDirs = fs.readdirSync(path.resolve(__dirname, "./src"), {
  withFileTypes: true,
});

const aliases = srcDirs
  .filter((dir) => dir.isDirectory())
  .reduce(
    (acc, el) => ({
      ...acc,
      [el.name]: path.resolve(__dirname, `./src/${el.name}`),
    }),
    {}
  );

module.exports = {
  babel: {
    presets: [
      [
        "@babel/preset-react",
        { runtime: "automatic", importSource: "@emotion/react" },
      ],
    ],
    plugins: [
      "@emotion/babel-plugin",
      "babel-plugin-twin",
      "babel-plugin-macros",
      [
        "@simbathesailor/babel-plugin-use-what-changed",
        {
          active: process.env.NODE_ENV === "development", // boolean
        },
      ],
    ],
  },
  webpack: {
    alias: aliases,
    configure: (config: Configuration) => {
      invariant(config.plugins, "plugins");
      invariant(config.module?.rules, "rules");

      const maybeHtmlWebpackPlugin = config.plugins.find(
        (plugin) => plugin.constructor.name === "HtmlWebpackPlugin"
      );
      if (!maybeHtmlWebpackPlugin) {
        throw new Error("Can't find HtmlWebpackPlugin");
      }
      const htmlWebpackPlugin = maybeHtmlWebpackPlugin as HtmlWebpackPlugin;

      const appInfo =
        appConfigs[
          (process.env.REACT_APP_APP_CONFIG as keyof typeof appConfigs | "") ||
            "goki"
        ];

      config.plugins.unshift(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        })
      );

      config.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      });

      // solana wallet adapter, ledger need to be transpiled
      config.module.rules.push({
        test: /\.js/,
        loader: require.resolve("babel-loader"),
        exclude: (file) =>
          !file.includes("@solana/wallet-adapter") &&
          !file.includes("@ledgerhq/devices") &&
          !file.includes("@saberhq/use-solana"),
      });

      htmlWebpackPlugin.userOptions = deepMerge(htmlWebpackPlugin.userOptions, {
        title: appInfo.title ?? appInfo.name,
        meta: {
          viewport: "width=device-width, initial-scale=1",
          description: appInfo.description,

          "og:title": appInfo.name,
          "og:site_name": appInfo.name,
          "og:url": appInfo.url,
          "og:description": appInfo.description,
          "og:type": "website",
          "og:image": appInfo.image,

          "twitter:card": "summary_large_image",
          "twitter:site": `@${appInfo.socials.twitter}`,
          "twitter:url": appInfo.url,
          "twitter:title": appInfo.name,
          "twitter:description": appInfo.description,
          "twitter:image": appInfo.image,
          "twitter:image:alt": appInfo.imageAlt,
        },
      });

      // pushing here ensures that the dotenv is loaded
      if (process.env.ANALYZE) {
        config.plugins.push(
          new BundleAnalyzerPlugin({ analyzerMode: "server" })
        );
      }

      config.plugins.push(
        new FaviconsWebpackPlugin({
          logo: `./public${appInfo.favicon}`,
          publicPath: "/",
          favicons: {
            appName: appInfo.name,
            appShortName: appInfo.name,
            appDescription: appInfo.description,
            developerName: `${appInfo.name} Team`,
            developerURL: appInfo.url,
            theme_color: appInfo.themeColor,
          },
        })
      );

      if (process.env.SENTRY_AUTH_TOKEN) {
        config.plugins.push(
          new SentryWebpackPlugin({
            // sentry-cli configuration
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            release: process.env.REACT_APP_SENTRY_RELEASE ?? "unknown",

            // webpack specific configuration
            include: "./build/",
            ignore: ["node_modules"],
            setCommits: {
              repo: process.env.GITHUB_REPO,
              commit:
                process.env.GITHUB_SHA ??
                process.env.COMMIT_REF ??
                process.env.CF_PAGES_COMMIT_SHA,
            },
            deploy: {
              env: process.env.REACT_APP_SENTRY_ENVIRONMENT ?? "unknown",
              started: now,
            },
          })
        );
      }

      return config;
    },
  },
  eslint: {
    enable: false,
  },
  typescript: { enableTypeChecking: false },
};