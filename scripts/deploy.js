const hre = require("hardhat");

const delay = ms => new Promise(res => setTimeout(res, ms));

const main = async () => {
    
    let [deployer] = await ethers.getSigners()

    console.log("  Deployer:    ", deployer.address);

    const nftFactory = await hre.ethers.getContractFactory("ChefCollection");
    const nftContract = await nftFactory.deploy(
        deployer.address,
        'https://api.npoint.io/f2b5b4b8faf614437259'
    );
    await nftContract.deployed();

    console.log("  Collection Deployed:", nftContract.address);

    console.log("Waiting for bytecode to propogate (60sec)");
    await delay(60000);

    console.log("grantAdminAccess");
    await nftContract.grantAdminAccess('0x7B2D5e11AAe5bdC9C57989EADC7aA6F84aDF56DB');
    console.log("granted (probably)");

    console.log("createRecipe");
    await nftContract.createRecipe(
        'https://api.npoint.io/fe2d8bab3feba141f2fc',
        'https://pastebin.com/mwkSNSJT',
        17
    );
    console.log("  Minted a Recipe")

    console.log("Waiting for no good reason (10sec)");
    await delay(10000);

    console.log("Verifying on Etherscan");

    await hre.run("verify:verify", {
        address: nftContract.address,
        constructorArguments: [
            deployer.address,
            'https://api.npoint.io/f2b5b4b8faf614437259'
          ],
      });

    console.log("Verified on Etherscan");



    // let overrides = {
    //     value: ethers.utils.parseEther("0.01"),
    //     gasLimit: 210000
    //   };

    // await nftContract.mint(overrides);
    await nftContract.mint();
    console.log("Minted Token 0");
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
