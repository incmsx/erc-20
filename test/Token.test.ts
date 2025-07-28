import { ethers } from "hardhat";
import { parseUnits } from "ethers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("SomeToken", function(){
    async function deploy() {
        const [owner, user2, user3, user4] = await ethers.getSigners();
        const initialArray = [owner.address, user2.address, user3.address, user4.address];
        const ownerAddress = owner.address;

        const Factory = await ethers.getContractFactory("SomeToken");
        const token = await Factory.deploy(initialArray);
        token.waitForDeployment();

        return { initialArray, token, ownerAddress }
    }

    it("should be deployed", async function() {
        const { token } = await loadFixture(deploy);

        console.log(token.target);
    });

    describe("Constructor", function(){

        it("should be proper array of adresses", async function() {
            const { initialArray } = await loadFixture(deploy);

            for(const signer of initialArray){
                expect(signer).to.be.properAddress;
            }
        }); 

        it("should be the right owner", async function () {
            const { token, ownerAddress } = await loadFixture(deploy);

            const owner = await token.owner();
            expect(owner).to.equal(ownerAddress);
        });

        it("should be the correct minted amount", async function () {
            const { token, initialArray } = await loadFixture(deploy);
            
            const initialMint = await token.INITIAL_MINT();
            const totalSupply = await token.totalSupply();
            expect(totalSupply).to.equal(initialMint * BigInt(initialArray.length));
        });

        it("should be minted for each signer", async function () {
            const { token, initialArray } = await loadFixture(deploy);
            const initialMint = await token.INITIAL_MINT();

            for (const signer of initialArray){
                const signerBalance = await token.balanceOf(signer);
                expect(signerBalance).to.equal(initialMint);
            }
        });

    });

    describe("Mint", function(){
        async function mint() {
            const {token, ownerAddress } = await loadFixture(deploy); 

            const owner = await ethers.getSigner(ownerAddress); 
            const amount = parseUnits("105000", 18);
            await token.connect(owner).mint(ownerAddress, amount);

            return { token, owner, amount }
        }

        it("should mint tokens to the specified address", async function(){
            const { token, owner, amount } = await loadFixture(mint); 
            
            // проверить можно ли оставить просто овнера
            const ownerBalance = await token.balanceOf(owner.address);
            const inititalMint = await token.INITIAL_MINT();
            expect(ownerBalance).to.equal(BigInt(amount) + inititalMint);
        });

        it("should revert with MaxSupplyExceeded error", async function(){
            const { token, ownerAddress } = await loadFixture(deploy); 
            
            const owner = await ethers.getSigner(ownerAddress); 
            const amount = parseUnits("1000000", 18)
            await expect(
                token.connect(owner).mint(ownerAddress,amount)
            ).to.be.revertedWithCustomError(token, "MaxSupplyExceeded");
        });
    });
});