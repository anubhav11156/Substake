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
    stakeDispatch();
}

const _deposit = async () => {
    const IMPLEMENTATION_ABI = await getAbi(vaultImplementationAbiPath);
    const contract = new ethers.Contract(vaultProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    let tx = await contract.deposit()
    await tx.wait()
        .then(() => {
            console.log("transaction successful");
        })
        .catch((error) => {
            console.log("transaction failed.");
            console.log(error);
        })
    console.log("calling deposit(uint256, address)");
}

const stakeDispatch = async () => {
    const IMPLEMENTATION_ABI = await getAbi(vaultImplementationAbiPath);
    const contract = new ethers.Contract(vaultProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    const ethAmount = ethers.parseEther("0.001");
    console.log("calling dispatchStakeBatch()........");
    let tx = await contract.dispatchStakeBatch({
        value: ethAmount,
        gasLimit: 1000000
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