const {ethers, JsonRpcProvider} = require("ethers");
let fs= require('fs');
require('dotenv').config();
const fsPromise = fs.promises;

const ethSepoliaRpc = process.env.ETH_SEPOLIA;
const privateKey = process.env.PV_KEY;

const substakeL1ManagerProxyabipath = "../out/SubstakeL1ManagerProxy.sol/SubstakeL1ManagerProxy.json";
const substakeL1ManagerProxyAddress = "0x2e0046C22b33679925a094c90D4587941Db77066";
const substakeL1ManagerImplementationabipath =  "../out/SubstakeL1Manager.sol/SubstakeL1Manager.json"


const provider = new JsonRpcProvider(ethSepoliaRpc);
const signer = new ethers.Wallet(privateKey, provider);

async function getAbi(path){
    const data = await fsPromise.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;
}

const main = async () =>{
    _upgradeImplementation();
    // _initialize();
}

const _upgradeImplementation = async () => {
    const PROXY_ABI = await getAbi(substakeL1ManagerProxyabipath);
    const contract = new ethers.Contract(substakeL1ManagerProxyAddress, PROXY_ABI.abi, signer);
    const substakeL1ManagerImplementation = "0xf68b2f562Eba6D0c5521120e252e959038C2573c";
    console.log("Updating implementaion.........................");
    let tx = await contract.upgradeImplementation(substakeL1ManagerImplementation)
    await tx.wait()
    .then(() => {
        console.log("Implementation Updated!");
    })
    .catch((error) => {
        console.log("Failed to update Implementation.");
        console.log(error);
    })
}

const _initialize = async () => {
    const IMPLEMENTATION_ABI = await getAbi(substakeL1ManagerImplementationabipath);
    const contract = new ethers.Contract(substakeL1ManagerProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    const admin = "0x55d9a0d367866a102eD85EA76CE46B11E62b3E88";
    const l1Config = "0x24B6C8B950D964eEaF9A247a0e8539778757e449";
    console.log("Initializing substakeL2config.................................");
    let tx = await contract.initialize(admin, l1Config);
    await tx.wait()
    .then(() => {
        console.log("SubstakeL1Manager Initialized!");
    })
    .catch((error) => {
        console.log("Failed to initialize SubstakeL1Manager!");
        console.log(error);
    })
}

main();
