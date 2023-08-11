type ChainConfigType = {
  [chainId: number]: {
    eas: `0x${string}`;
    schemaRegistry: `0x${string}`;
    covalentChain: string;
    api: string;
    easScan?: string;
  };
};

export const chainConfig: ChainConfigType = {
  // Mainet
  1: {
    eas: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
    schemaRegistry: "0xA7b39296258348C78294F95B872b282326A97BDF",
    covalentChain: "eth-mainnet",
    api: "https://easscan.org/graphql",
    easScan: "https://easscan.org",
  },

  // Base
  8453: {
    eas: "0x",
    schemaRegistry: "0x",
    covalentChain: "base-mainnet",
    api: "",
  },
  // Optimism
  10: {
    eas: "0x4200000000000000000000000000000000000021",
    schemaRegistry: "0x4200000000000000000000000000000000000020",
    covalentChain: "optimism-mainnet",
    api: "https://optimism.easscan.org/graphql",
    easScan: "https://optimism.easscan.org",
  },
  // Zora
  7777777: {
    eas: "0x",
    schemaRegistry: "0x",
    covalentChain: "zora-mainnet",
    api: "",
  },
  // Base Goerli Testnet
  84531: {
    eas: "0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A",
    schemaRegistry: "0x720c2bA66D19A725143FBf5fDC5b4ADA2742682E",
    covalentChain: "base-testnet",
    api: "https://base-goerli.easscan.org/graphql",
    easScan: "https://base-goerli.easscan.org",
  },
  // Optimism Goerli Testnet
  420: {
    eas: "0x4200000000000000000000000000000000000021",
    schemaRegistry: "0x4200000000000000000000000000000000000020",
    covalentChain: "optimism-goerli",
    api: "https://optimism-goerli-bedrock.easscan.org/graphql",
    easScan: "https://optimism-goerli-bedrock.easscan.org",
  },
  // Sepolia Testnet
  11155111: {
    eas: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    schemaRegistry: "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
    covalentChain: "eth-sepolia",
    api: "https://sepolia.easscan.org/graphql",
    easScan: "https://sepolia.easscan.org",
  },
  // Zora Goerli Testnet
  999: {
    eas: "0x086B4803d486a56bbdFAB10b839954A7542F17C0",
    schemaRegistry: "0x4C6847aF29398a55Af8F2F9e9919751A7bc31fc4",
    covalentChain: "zora-testnet",
    api: "http://localhost:4000",
  },
  919: {
    eas: "0x2FC89594E0FeDE3faB22089F815e7371e7fF289B",
    schemaRegistry: "0xc9424a090EC7eE46134eD9CACaDE29C993c01aC2",
    covalentChain: "",
    api: "http://localhost:4000",
  },
};
``;
