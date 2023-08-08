// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {IEAS} from "eas-contracts/IEAS.sol";
import {ISchemaRegistry} from "eas-contracts/SchemaRegistry.sol";
import {ISchemaResolver} from "eas-contracts/resolver/ISchemaResolver.sol";
import {MoshiMoshiNFT} from "../src/MoshiMoshiNFT.sol";
import {Config, ChainConfig} from "./Config.s.sol";

contract Deploy is Script {
    function run() external {
        Config config = new Config();
        ChainConfig memory chainConfig = config.getConfig();

        IEAS eas = IEAS(chainConfig.easAddress);
        ISchemaRegistry schemaRegistry = ISchemaRegistry(
            chainConfig.schemaRegistryAddress
        );

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Create schema
        schemaRegistry.register(
            "address aTestAddy, address anotherTestAddy",
            ISchemaResolver(address(0)),
            true
        );

        // Create demo NFT
        //MoshiMoshiNFT nft = new MoshiMoshiNFT();

        vm.stopBroadcast();
    }
}
