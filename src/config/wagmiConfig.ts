import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import {
  baseGoerli,
  foundry,
  mainnet,
  optimism,
  optimismGoerli,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const walletConnectProjectId = "5a15d63a58a0b96cb0d6fbcc539ec46e";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    optimism,
    ...(process.env.NODE_ENV === "development"
      ? [baseGoerli, optimismGoerli, foundry]
      : []),
  ],
  [publicProvider()]
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
