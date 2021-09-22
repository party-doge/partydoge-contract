const hre = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("BosonToken Token Deployment", async() => {
    before('', async() => {
        await initTestVariables();
    })
    it("Should verify that the token contract is deployed", async() => {
        await createContract();
        expect(BosonToken.address).to.not.equal('0x' + '0'.repeat(32));
    });
   

});