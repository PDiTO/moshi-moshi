// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {SchemaRegistry} from "eas-contracts/SchemaRegistry.sol";

contract SchemaRegistryMock is SchemaRegistry {
    constructor() SchemaRegistry() {}
}
