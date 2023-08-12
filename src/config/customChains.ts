import { Chain } from "@rainbow-me/rainbowkit";

export const modeNetwork = {
  id: 919,
  name: "Mode",
  network: "mode",
  iconUrl: "/modeLogo.svg",
  iconBackground: "#000",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://sepolia.mode.network"] },
    default: { http: ["https://sepolia.mode.network"] },
  },
  blockExplorers: {
    etherscan: {
      name: "Mode Blockscout",
      url: "https://sepolia.explorer.mode.network/",
    },
    default: {
      name: "Mode Blockscount",
      url: "https://sepolia.explorer.mode.network/",
    },
  },
  testnet: true,
} as const satisfies Chain;
