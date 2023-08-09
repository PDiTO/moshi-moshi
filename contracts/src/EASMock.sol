// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {EAS} from "eas-contracts/EAS.sol";
import {ISchemaRegistry} from "eas-contracts/SchemaRegistry.sol";

contract EASMock is EAS {
    constructor()
        EAS(ISchemaRegistry(0x4C6847aF29398a55Af8F2F9e9919751A7bc31fc4))
    {}
}
