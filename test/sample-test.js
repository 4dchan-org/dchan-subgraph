const { expect } = require("chai");
const { ethers } = require("hardhat");




const getTokenReserves = async (pair) => {
  let quickSwapPair = await ethers.getContractAt("IUniswapV2Pair", pair);
  let connectedPair = quickSwapPair.connect(ethers.provider.getSigner(0));
  let reserves = await connectedPair.getReserves();
  let res1 = ethers.utils.formatUnits(reserves.reserve0.toString(), "ether").toString();
  let res2 = ethers.utils.formatUnits(reserves.reserve1.toString(), 9).toString();
  console.log("Reserve0: ", res1);
  console.log("Reserve1: ", res2);
  return {res1: res1, res2: res2};
}

const getDChanBalances = async (accounts, contract) => {
  let account0 = await contract.balanceOf(accounts[0].address);
  let account1 = await contract.balanceOf(accounts[1].address);
  let account2 = await contract.balanceOf(accounts[2].address);
  console.log("Balance of Account 0: ", ethers.utils.formatUnits(account0.toString(), 9));
  console.log("Balance of Account 1: ", ethers.utils.formatUnits(account1.toString(), 9));
  console.log("Balance of Account 2: ", ethers.utils.formatUnits(account2.toString(), 9));
}

const getQueryPayerBalance = async (connectedDChan, connectedGrtBilling) => {
  queryPayer = await connectedDChan.queryPayer();
  balance = (await connectedGrtBilling.userBalances(queryPayer)).toString();
  decimals = parseInt("18");
  console.log("GRT Billing Contract Balance of Query Payer", queryPayer, ": ", ethers.utils.formatUnits(balance, decimals ));
}







describe("==== dChanToken ====", function () {
  it("Should do something", async function () {
    const accounts = await ethers.getSigners();
    console.log("Account 0: ", accounts[0].address)
    console.log("Account 1: ", accounts[1].address)
    console.log("Account 2: ", accounts[2].address)
    const Token = await ethers.getContractFactory("dChanToken");
    const token = await Token.deploy();
    await token.deployed();

    console.log("dChan Token Address: ", token.address);
    const dChanAddress = token.address;

    const quickSwap = await ethers.getContractAt("IUniswapV2Router02", "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff")
    const quickSwapFactory = await ethers.getContractAt("IUniswapV2Factory", "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32")
    const grtTokenContract = await ethers.getContractAt('IGRTToken', "0x5fe2B58c013d7601147DcdD68C143A77499f5531");
    const grtBillingContract = await ethers.getContractAt('IGRTBilling', "0xa382f75b375D6a07bfD1af99D4383C6e1D1C4004");

    await quickSwap.deployed();
    await quickSwapFactory.deployed();
    await grtTokenContract.deployed();

    let connectedDChan = token.connect(ethers.provider.getSigner(0));
    const connectedQuickswap = quickSwap.connect(ethers.provider.getSigner(0));
    const connectedQuickswapFactory = quickSwapFactory.connect(ethers.provider.getSigner(0));
    const connectedGrtToken = grtTokenContract.connect(ethers.provider.getSigner(0));
    const connectedGrtBilling = grtBillingContract.connect(ethers.provider.getSigner(0));
    const weth = await connectedQuickswap.WETH();
    const pair = await connectedDChan.uniswapV2Pair();

    console.log("WETH Address: ", weth);
    console.log("Constructor-Created Liquidity Pair: ", pair);
    console.log("================================================================================");

    // Now that we have a liquidity pair, let's check the reserves
    await getTokenReserves(pair)


    // Let's try to add liquidity to the MATIC(WETH) <--> DCHAN pair
    const DCHAN_TOKENS_TO_ADD = 1000000000000;
    const ETH_TO_ADD = ethers.utils.parseEther('10.0');

    // First we have to approve quickswap to spend the tokens
    let tx0 = await connectedDChan.approve(quickSwap.address, DCHAN_TOKENS_TO_ADD);

    // Then we can add the liquidity
    let tx1 = await connectedQuickswap.addLiquidityETH(
                          dChanAddress,
                          DCHAN_TOKENS_TO_ADD,
                          0,
                          0,
                          accounts[0].address,
                          ~~((Date.now() + 1000*24*60*60) / 1000),
                          {value: ETH_TO_ADD}
                        )
    
      
    console.log("\n====\n");    

    // By this point, the transaction likely succeeded. Let's check the liquidity pool:
    let pair2 = await connectedQuickswapFactory.getPair(dChanAddress, weth);
    expect(pair).to.equal(pair2);

    // And check the reserves again
    let reserves = await getTokenReserves(pair)
    //expect(reserves.res1).to.equal("10.0");
    //expect(reserves.res2).to.equal("96.0");

    console.log("\n====\n");  


    await getQueryPayerBalance(connectedDChan, connectedGrtBilling);


    console.log("\n===============================BEFORE=====================================\n");    
    // Send tokens from account 0 to account 1
    await getDChanBalances(accounts, connectedDChan);
    console.log("Sending ", 100000, " tokens from account 0 to account 1....");
    let tx2 = await connectedDChan.transfer(accounts[1].address, 100000000000000, {value: ETH_TO_ADD});
    console.log("\n=================================AFTER===================================\n");    

    await getDChanBalances(accounts, connectedDChan);

    console.log("\n===============================BEFORE=====================================\n");    
    connectedDChan = token.connect(ethers.provider.getSigner(1));
    console.log("Sending ", 10000, " tokens from account 1 to account 2....");
    let tx3 = await connectedDChan.transfer(accounts[2].address, 10000000000000);
    console.log("\n=================================AFTER===================================\n");    

    console.log("\n===============================BEFORE=====================================\n");    
    connectedDChan = token.connect(ethers.provider.getSigner(1));
    console.log("Sending ", 1000, " tokens from account 1 to account 2....");
    let tx4 = await connectedDChan.transfer(accounts[2].address, 1000000000000);
    console.log("\n=================================AFTER===================================\n"); 

    await getDChanBalances(accounts, connectedDChan);

    await getQueryPayerBalance(connectedDChan, connectedGrtBilling);


  });
});










