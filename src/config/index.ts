import appConfigs from "./app.json";

/**
 * Currently loaded application.
 */
export const CURRENT_APP =
  process.env.REACT_APP_APP_CONFIG === "tribeca"
    ? "tribeca"
    : process.env.REACT_APP_APP_CONFIG === "anchor"
    ? "anchor"
    : "goki";

export const APP_CONFIG = appConfigs[CURRENT_APP];
