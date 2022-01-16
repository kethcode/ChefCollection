
const delay = ms => new Promise(res => setTimeout(res, ms));

const main = async () => {

    let [deployer] = await ethers.getSigners()

    const nftFactory = await hre.ethers.getContractFactory("ChefCollection");
    const nftContract =  nftFactory.attach('0x41BF205d961355C1794A2184AE89eF5A50294623');

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

    
    // console.log("Verifying on Etherscan");

    // await hre.run("verify:verify", {
    //     address: '0x41bf205d961355c1794a2184ae89ef5a50294623',
    //     constructorArguments: [
    //         deployer.address,
    //         'https://api.npoint.io/f2b5b4b8faf614437259'
    //     ],
    // });

    // console.log("Verified on Etherscan");

    // console.log("Waiting for no good reason (10sec)");
    // await delay(10000);

    // console.log("createRecipe");
    // await nftContract.createRecipe(
    //     'https://api.npoint.io/fe2d8bab3feba141f2fc',
    //     'https://pastebin.com/mwkSNSJT',
    //     17
    // );
    // console.log("  Minted a Recipe")

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
