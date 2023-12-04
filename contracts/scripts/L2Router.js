const {ethers, JsonRpcProvider} = require("ethers");
let fs= require('fs');
require('dotenv').config();
const fsPromise = fs.promises;

const scrollSepoliaRPC = process.env.SCROLL_RPC;
const privateKey = process.env.PV_KEY

const substakeL2routerProxyabipath = "../out/SubstakeL2RouterProxy.sol/SubstakeL2RouterProxy.json";
const substakeL2routerProxyAddress = "0x4ceBC071291125dffc07Fb2b57d2B96c9FB32bCD";
const substakeL2routerImplementationabipath = "../out/SubstakeL2Router.sol/SubstakeL2Router.json";


const provider = new JsonRpcProvider(scrollSepoliaRPC);
const signer = new ethers.Wallet(privateKey, provider);

async function getAbi(path){
    const data = await fsPromise.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;
}

const main = ()=> {
    // _upgradeImplementation()
    // _initialize()
}

const _upgradeImplementation = async () => {
    const PROXY_ABI = await getAbi(substakeL2routerProxyabipath);
    const contract = new ethers.Contract(substakeL2routerProxyAddress, PROXY_ABI.abi, signer);
    const substakeL2routerImplementation = "0xe5e3d9C31e17C0bEa714e93fC103488aa7EF100c";
    console.log("Updating implementaion.........................");
    let tx = await contract.upgradeImplementation(substakeL2routerImplementation)
    await tx.wait()
    .then(() => {
        console.log("SubstakeL2router Implementation Updated!");
    })
    .catch((error) => {
        console.log("Failed to update implementation.");
        console.log(error);
    })
}

const _initialize = async () => {
    const IMPLEMENTATION_ABI = await getAbi(substakeL2routerImplementationabipath);
    const contract = new ethers.Contract(substakeL2routerProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    const admin = "0x55d9a0d367866a102eD85EA76CE46B11E62b3E88";
    const L2config ="0x7BCaa65E6cAceF4FB7F2852488829bd92090667a";
    console.log("Initializing substakeL2router.................................");
    let tx = await contract.initialize(admin, L2config);
    await tx.wait()
    .then(() => {
        console.log("substakeL2router Initialized!");
    })
    .catch((error) => {
        console.log("Failed to initialize substakeL2router!");
        console.log(error);
    })
}

main();
