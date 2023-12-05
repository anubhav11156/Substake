const {ethers, JsonRpcProvider} = require("ethers");
let fs= require('fs');
require('dotenv').config();
const fsPromise = fs.promises;

const ethSepoliaRpc = process.env.ETH_SEPOLIA;
const privateKey = process.env.PV_KEY;

const substakeL1configProxyabipath = "../out/SubstakeL1ConfigProxy.sol/SubstakeL1ConfigProxy.json";
const substakeL1configProxyAddress = "0x24B6C8B950D964eEaF9A247a0e8539778757e449";
const substakeL1configImplementationabipath =  "../out/SubstakeL1Config.sol/SubstakeL1Config.json"


const provider = new JsonRpcProvider(ethSepoliaRpc);
const signer = new ethers.Wallet(privateKey, provider);

async function getAbi(path){
    const data = await fsPromise.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;
}

const main = async () =>{
    // _upgradeImplementation();
    _initialize();
}

const _upgradeImplementation = async () => {
    const PROXY_ABI = await getAbi(substakeL1configProxyabipath);
    const contract = new ethers.Contract(substakeL1configProxyAddress, PROXY_ABI.abi, signer);
    const substakeL1configImplementation = "0x31f156839f7543e3db75DaefBA757E7146dD4F46";
    console.log("Updating implementaion.........................");
    let tx = await contract.upgradeImplementation(substakeL1configImplementation)
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
    const IMPLEMENTATION_ABI = await getAbi(substakeL1configImplementationabipath);
    const contract = new ethers.Contract(substakeL1configProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    const admin = "0x55d9a0d367866a102eD85EA76CE46B11E62b3E88";
    console.log("Initializing substakeL2config.................................");
    let tx = await contract.initialize(admin);
    await tx.wait()
    .then(() => {
        console.log("SubstakeL1config Initialized!");
    })
    .catch((error) => {
        console.log("Failed to initialize SubstakeL1config!");
        console.log(error);
    })
}

main();
