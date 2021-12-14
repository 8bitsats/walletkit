export type IEnvironment = Readonly<{
  name: string;
  endpoint: string;
}>;

export const environments = {
  "mainnet-beta": {
    name: "Mainnet Beta",
    endpoint: "https://gokal.rpcpool.com",
  },
  devnet: {
    name: "Devnet",
    endpoint: "https://api.devnet.rpcpool.com/",
    // endpoint: "https://api.devnet.solana.com/",
    // endpoint: "https://sg6.rpcpool.com/",
  },
  testnet: {
    name: "Testnet",
    endpoint: "https://api.testnet.solana.com/",
  },
  localnet: {
    name: "Localnet",
    endpoint: "http://localhost:8899/",
  },
} as const;
