const { ethers, JsonRpcProvider } = require("ethers");
require('dotenv').config();
let fs = require('fs');
const fsPromise = fs.promises;

const scrollSepoliaRPC = process.env.SCROLL_RPC;
const privateKey = process.env.PV_KEY

const vaultProxyAddress = "0xC4374cC35CbB2a42B9C19495AD811C742dc9FAA9";
const vaultImplementationAbiPath = "../out/SubstakeVault.sol/SubstakeVault.json";

const provider = new JsonRpcProvider(scrollSepoliaRPC);
const signer = new ethers.Wallet(privateKey, provider);

async function getAbi(path) {
    const data = await fsPromise.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;
}

const main = async () => {
    //_deposit();
    // stakeDispatch();
    // unstakeDispatch();
    userDeposit();
}

const userDeposit = async () => {
    const IMPLEMENTATION_ABI = await getAbi(vaultImplementationAbiPath);
    const contract = new ethers.Contract(vaultProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    const ethAmount = ethers.parseEther("0.001");
    const receiver = "0x55d9a0d367866a102eD85EA76CE46B11E62b3E88";
    console.log("calling deposit(uint256, address)");
    try {
        let tx = await contract.deposit(ethAmount, receiver, { value: ethAmount, gasLimit: 1000000 });
        let receipt = await tx.wait();
        console.log("receipt : ", receipt);
        const shares = receipt.events[0].args.shares;
        const batchId = receipt.events[0].args.batchId;
        
        console.log("Deposit successful. Shares:", shares.toString(), "Stake Batch ID:", batchId.toString());
    } catch (error) {
        console.log("Deposit failed.");
        console.log(error);
    }
}

const stakeDispatch = async () => {
    const IMPLEMENTATION_ABI = await getAbi(vaultImplementationAbiPath);
    const contract = new ethers.Contract(vaultProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    const ethAmount = ethers.parseEther("0.001");
    console.log("calling dispatchStakeBatch()........");
    let tx = await contract.dispatchStakeBatch({
        value: ethAmount,
        gasLimit: 450000
    });
    await tx.wait()
        .then(() => {
            console.log("Call Successful!");
        })
        .catch((error) => {
            console.log("Failed to call!");
            console.log(error);
        })

}

const unstakeDispatch = async () => {
    const IMPLEMENTATION_ABI = await getAbi(vaultImplementationAbiPath);
    const contract = new ethers.Contract(vaultProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    console.log("calling dispatchUnstakeBatch()........");
    let tx = await contract.dispatchUnstakeBatch({
        gasLimit: 400000
    });
    await tx.wait()
        .then(() => {
            console.log("Call Successful!");
        })
        .catch((error) => {
            console.log("Failed to call!");
            console.log(error);
        })
}

main();