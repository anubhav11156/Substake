const {ethers, JsonRpcProvider} = require("ethers");
require('dotenv').config();
let fs= require('fs');
const fsPromise = fs.promises;

const scrollSepoliaRPC = process.env.SCROLL_RPC;
const privateKey = process.env.PV_KEY

const vaultProxyabipath = "../out/SubstakeVaultProxy.sol/SubstakeVaultProxy.json";
const vaultProxyAddress = "0xC4374cC35CbB2a42B9C19495AD811C742dc9FAA9";
const vaultImplementationAbiPath = "../out/SubstakeVault.sol/SubstakeVault.json";

const provider = new JsonRpcProvider(scrollSepoliaRPC);
const signer = new ethers.Wallet(privateKey, provider);

async function getAbi(path){
    const data = await fsPromise.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;
}

const main = async () => {
    // upgradeImplementation("0x");
    // initializeVault()
}

const upgradeImplementation = async (vaultImplementation) => {
    const PROXY_ABI = await getAbi(vaultProxyabipath);
    const contract = new ethers.Contract(vaultProxyAddress, PROXY_ABI.abi, signer);
    console.log("Updating implementaion.........................");
    let tx = await contract.upgradeImplementation(vaultImplementation)
    await tx.wait()
    .then(() => {
        console.log("vault Implementation Updated!");
    })
    .catch((error) => {
        console.log("Failed to update implementation.");
        console.log(error);
    })
}

const initializeVault = async () => {
    const IMPLEMENTATION_ABI = await getAbi(vaultImplementationAbiPath);
    const contract = new ethers.Contract(vaultProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    const admin = "0x55d9a0d367866a102eD85EA76CE46B11E62b3E88";
    const L2config ="0x7BCaa65E6cAceF4FB7F2852488829bd92090667a";
    console.log("Initializing Vault.................................");
    let tx = await contract.initialize(admin, L2config);
    await tx.wait()
    .then(() => {
        console.log("vault Initialized!");
    })
    .catch((error) => {
        console.log("Failed to initialize vault!");
        console.log(error);
    })
}

const listenToEvents = async () => {
    const PROXY_ABI = await getAbi(vaultProxyabipath);
    const contract = new ethers.Contract(vaultProxyAddress, PROXY_ABI.abi, signer);
    contract.on("Upgraded", (implementation, event) => {
        console.log("Upgraded event fired!");
        console.log(implementation);
    })
}