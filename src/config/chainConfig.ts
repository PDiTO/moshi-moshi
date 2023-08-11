type ChainConfigType = {
  [chainId: number]: {
    eas: `0x${string}`;
    schemaRegistry: `0x${string}`;
    covalentChain: string;
    apiPrefix: string;
  };
};

export const chainConfig: ChainConfigType = {
  // Mainet
  1: {
    eas: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
    schemaRegistry: "0xA7b39296258348C78294F95B872b282326A97BDF",
    covalentChain: "eth-mainnet",
    apiPrefix: "",
  },

  // Base
  8453: {
    eas: "0x",
    schemaRegistry: "0x",
    covalentChain: "base-mainnet",
    apiPrefix: "",
  },
  // Optimism
  10: {
    eas: "0x4200000000000000000000000000000000000021",
    schemaRegistry: "0x4200000000000000000000000000000000000020",
    covalentChain: "optimism-mainnet",
    apiPrefix: "optimism.",
  },
  // Zora
  7777777: {
    eas: "0x",
    schemaRegistry: "0x",
    covalentChain: "zora-mainnet",
    apiPrefix: "",
  },
  // Base Goerli Testnet
  84531: {
    eas: "0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A",
    schemaRegistry: "0x720c2bA66D19A725143FBf5fDC5b4ADA2742682E",
    covalentChain: "base-testnet",
    apiPrefix: "base-goerli.",
  },
  // Optimism Goerli Testnet
  420: {
    eas: "0x4200000000000000000000000000000000000021",
    schemaRegistry: "0x4200000000000000000000000000000000000020",
    covalentChain: "optimism-goerli",
    apiPrefix: "optimism-goerli-bedrock.",
  },
  // Sepolia Testnet
  11155111: {
    eas: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    schemaRegistry: "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
    covalentChain: "eth-sepolia",
    apiPrefix: "sepolia.",
  },
  // Zora Goerli Testnet
  999: {
    eas: "0x086B4803d486a56bbdFAB10b839954A7542F17C0",
    schemaRegistry: "0x4C6847aF29398a55Af8F2F9e9919751A7bc31fc4",
    covalentChain: "zora-testnet",
    apiPrefix: "",
  },
  919: {
    eas: "0x2FC89594E0FeDE3faB22089F815e7371e7fF289B",
    schemaRegistry: "0xc9424a090EC7eE46134eD9CACaDE29C993c01aC2",
    covalentChain: "",
    apiPrefix: "",
  },
};
