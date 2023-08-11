import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, mainnet, sepolia } from "wagmi";
import {
  base,
  baseGoerli,
  foundry,
  optimism,
  optimismGoerli,
  zora,
  zoraTestnet,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const walletConnectProjectId = "5a15d63a58a0b96cb0d6fbcc539ec46e";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    base,
    optimism,
    zora,
    ...(process.env.NODE_ENV === "development"
      ? [sepolia, optimismGoerli, baseGoerli, zoraTestnet]
      : []),
  ],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_KEY ?? "" }),
    infuraProvider({ apiKey: process.env.INFURA_KEY ?? "" }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === base.id)
          return {
            http: process.env.BASE ?? "x",
            webSocket: ``,
          };

        if (chain.id === baseGoerli.id)
          return {
            http: process.env.BASEGOERLI ?? "x",
            //webSocket: ``,
          };

        if (chain.id === zora.id)
          return {
            http: process.env.ZORA ?? "x",
            //webSocket: ``,
          };

        if (chain.id === zoraTestnet.id)
          return {
            http: process.env.ZORAGOERLI ?? "x",
            //webSocket: ``,
          };

        return null;
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Fullstack Template",
  chains,
  projectId: walletConnectProjectId,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };
