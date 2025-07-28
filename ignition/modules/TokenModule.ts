import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenModule = buildModule("TokenModule", (m) => {
    const initialArray = ["0x8Ed494A09531a5Bc010334FC7114Fc0DB8e10aA1"];

    const token = m.contract("SomeToken", [initialArray]);

    return {token}
});

export default TokenModule;