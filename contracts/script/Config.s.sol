// SPDX License Identifier: MIT

pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
// Add mocks for EAS

struct ChainConfig {
    address easAddress;
    address schemaRegistryAddress;
}

contract Config is Script {
    ChainConfig public chainConfig;

    constructor() {
        if (block.chainid == 1) {
            chainConfig = getMainnetConfig();
        } else if (block.chainId == 84531) {
            chainConfig = getBaseGoerliConfig();
        } else if (block.chainId == 10) {
            chainConfig = getOptimismConfig();
        } else if (block.chainId == 420) {
            chainConfig = getOptimismGoerliConfig();
        } else if (block.chainId == 11155111) {
            chainConfig = getSepoliaConfig();
        } else {
            chainConfig = getLocalConfig();
        }
    }

    function getMainnetConfig() public view returns (ChainConfig memory) {
        return
            ChainConfig({
                easAddress: 0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587,
                schemaRegistryAddress: 0xA7b39296258348C78294F95B872b282326A97BDF
            });
    }

    function getBaseGoerliConfig() public view returns (ChainConfig memory) {
        return
            ChainConfig({
                easAddress: 0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A,
                schemaRegistryAddress: 0x720c2bA66D19A725143FBf5fDC5b4ADA2742682E
            });
    }

    function getOptimismConfig() public view returns (ChainConfig memory) {
        return
            ChainConfig({
                easAddress: 0x4200000000000000000000000000000000000021,
                schemaRegistryAddress: 0x4200000000000000000000000000000000000020
            });
    }

    function getOptimismGoerliConfig()
        public
        view
        returns (ChainConfig memory)
    {
        return
            ChainConfig({
                easAddress: 0x4200000000000000000000000000000000000021,
                schemaRegistryAddress: 0x4200000000000000000000000000000000000020
            });
    }

    function getSepoliaConfig() public view returns (ChainConfig memory) {
        return
            ChainConfig({
                easAddress: 0xC2679fBD37d54388Ce493F1DB75320D236e1815e,
                schemaRegistryAddress: 0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0
            });
    }

    function getLocalConfig() public returns (ChainConfig memory) {
        if (chainConfig.live) {
            return chainConfig;
        }

        vm.startBroadcast();
        MockV3Aggregator wethPriceFeedMock = new MockV3Aggregator(8, 1900e8);
        MockV3Aggregator wbtcPriceFeedMock = new MockV3Aggregator(8, 30000e8);
        ERC20Mock wethMock = new ERC20Mock();
        ERC20Mock wbtcMock = new ERC20Mock();
        wethMock.mint(msg.sender, 100e18);
        wbtcMock.mint(msg.sender, 100e8);
        vm.stopBroadcast();

        chainConfig = ChainConfig({
            wethAddress: address(wethMock),
            wbtcAddress: address(wbtcMock),
            wethPriceFeed: address(wethPriceFeedMock),
            wbtcPriceFeed: address(wbtcPriceFeedMock),
            deployerPrivateKey: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80,
            live: true
        });

        return chainConfig;
    }

    function getConfig() public view returns (ChainConfig memory) {
        return chainConfig;
    }
}
