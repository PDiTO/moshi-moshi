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
import { modeNetwork } from "./customChains";

const walletConnectProjectId = "5a15d63a58a0b96cb0d6fbcc539ec46e";

export async function getStaticProps() {
  console.log(process.env.BASE);
  // ...
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    base,
    optimism,
    zora,
    sepolia,
    optimismGoerli,
    baseGoerli,
    zoraTestnet,
    modeNetwork,
    // remove this line and uncomment below for deploy
    // ...(process.env.NODE_ENV === "development"
    //   ? [sepolia, optimismGoerli, baseGoerli, zoraTestnet]
    //   : []),
  ],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY ?? "" }),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY ?? "" }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === base.id)
          return {
            http: process.env.NEXT_PUBLIC_BASE ?? "x",
            webSocket: ``,
          };

        if (chain.id === baseGoerli.id)
          return {
            http: process.env.NEXT_PUBLIC_BASEGOERLI ?? "x",
            webSocket: process.env.NEXT_PUBLIC_BASEGOERLIWS ?? "x",
          };

        if (chain.id === zora.id)
          return {
            http: process.env.NEXT_PUBLIC_ZORA ?? "x",
            //webSocket: ``,
          };

        if (chain.id === zoraTestnet.id)
          return {
            http: process.env.NEXT_PUBLIC_ZORAGOERLI ?? "x",
            webSocket: process.env.NEXT_PUBLIC_ZORAGOERLIWS ?? "x",
          };

        if (chain.id === modeNetwork.id)
          return {
            http: process.env.NEXT_PUBLIC_MODENETWORK ?? "x",
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
