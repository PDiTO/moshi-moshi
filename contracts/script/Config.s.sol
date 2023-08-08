// SPDX License Identifier: MIT

pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import "eas-contracts/EAS.sol";
import "eas-contracts/SchemaRegistry.sol";

struct ChainConfig {
    address easAddress;
    address schemaRegistryAddress;
    bool live;
}

contract Config is Script {
    ChainConfig public chainConfig;

    constructor() {
        if (block.chainid == 1) {
            chainConfig = getMainnetConfig();
        } else if (block.chainid == 84531) {
            chainConfig = getBaseGoerliConfig();
        } else if (block.chainid == 10) {
            chainConfig = getOptimismConfig();
        } else if (block.chainid == 420) {
            chainConfig = getOptimismGoerliConfig();
        } else if (block.chainid == 11155111) {
            chainConfig = getSepoliaConfig();
        } else {
            chainConfig = getLocalConfig();
        }
    }

    function getMainnetConfig() public pure returns (ChainConfig memory) {
        return
            ChainConfig({
                easAddress: 0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587,
                schemaRegistryAddress: 0xA7b39296258348C78294F95B872b282326A97BDF,
                live: true
            });
    }

    function getBaseGoerliConfig() public pure returns (ChainConfig memory) {
        return
            ChainConfig({
                easAddress: 0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A,
                schemaRegistryAddress: 0x720c2bA66D19A725143FBf5fDC5b4ADA2742682E,
                live: true
            });
    }

    function getOptimismConfig() public pure returns (ChainConfig memory) {
        return
            ChainConfig({
                easAddress: 0x4200000000000000000000000000000000000021,
                schemaRegistryAddress: 0x4200000000000000000000000000000000000020,
                live: true
            });
    }

    function getOptimismGoerliConfig()
        public
        pure
        returns (ChainConfig memory)
    {
        return
            ChainConfig({
                easAddress: 0x4200000000000000000000000000000000000021,
                schemaRegistryAddress: 0x4200000000000000000000000000000000000020,
                live: true
            });
    }

    function getSepoliaConfig() public pure returns (ChainConfig memory) {
        return
            ChainConfig({
                easAddress: 0xC2679fBD37d54388Ce493F1DB75320D236e1815e,
                schemaRegistryAddress: 0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0,
                live: true
            });
    }

    function getLocalConfig() public returns (ChainConfig memory) {
        if (chainConfig.live) {
            return chainConfig;
        }

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        ISchemaRegistry schemaRegistry = new SchemaRegistry();
        EAS eas = new EAS(schemaRegistry);
        vm.stopBroadcast();

        chainConfig = ChainConfig({
            easAddress: address(eas),
            schemaRegistryAddress: address(schemaRegistry),
            live: true
        });

        return chainConfig;
    }

    function getConfig() public view returns (ChainConfig memory) {
        return chainConfig;
    }
}
