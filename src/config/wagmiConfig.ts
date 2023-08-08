import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, sepolia } from "wagmi";
import {
  baseGoerli,
  foundry,
  mainnet,
  optimism,
  optimismGoerli,
} from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

const walletConnectProjectId = "5a15d63a58a0b96cb0d6fbcc539ec46e";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    optimism,
    sepolia,
    ...(process.env.NODE_ENV === "development" ? [optimismGoerli] : []),
  ],
  [infuraProvider({ apiKey: "5ed87f32fc4d40529b2ef2caf65f8145" })]
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
