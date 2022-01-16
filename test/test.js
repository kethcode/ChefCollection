const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Recipe", function () {

    it("Should Deploy", async function () {

        let [deployer] = await ethers.getSigners()
        const nftFactory = await hre.ethers.getContractFactory("ChefCollection");

        //constructor(address collection_owner, string memory collection_uri_) public ERC1155("") {
        const nftContract = await nftFactory.deploy(
            deployer.address,
            'https://api.npoint.io/f2b5b4b8faf614437259'
        );
        await nftContract.deployed();
    
        console.log("  Deployed:", nftContract.address);

        //    function createRecipe(string memory nft_uri_, string memory recipe_uri_, uint256 amount_) public mustBeAdmin() {
        await nftContract.createRecipe(
            'https://api.npoint.io/fe2d8bab3feba141f2fc',
            'https://pastebin.com/mwkSNSJT',
            17
        );

        console.log("  Minted a Recipe")

        // nft_uri = await nftContract.uri(0);

        // console.log(" ", nft_uri)

        // describe("mint", function () {

        //     it("Should mint a token", async function () {
        //         expect(
        //             await nftContract.mint(accounts[0].address)
        //         )
        //         .to.emit(todayContract, 'Transfer')
        //         .withArgs(
        //             address(0), 
        //             accounts[0].address,
        //             0
        //             )
        //     });
        // });
    });
});