import appConfigs from "./app.json";

export const APP_CONFIG =
  process.env.REACT_APP_APP_CONFIG === "tribeca"
    ? appConfigs.tribeca
    : appConfigs.goki;
