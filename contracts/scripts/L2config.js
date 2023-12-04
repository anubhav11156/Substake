const {ethers, JsonRpcProvider} = require("ethers");
let fs= require('fs');
const fsPromise = fs.promises;

const scrollSepoliaRPC = process.env.SCROLL_RPC;
const privateKey = process.env.PV_KEY

const substakeL2configProxyabipath = "../out/SubstakeL2ConfigProxy.sol/SubstakeL2ConfigProxy.json";
const substakeL2configProxyAddress = "0x7BCaa65E6cAceF4FB7F2852488829bd92090667a";
const substakeL2configImplementationabipath =  "../out/SubstakeL2Config.sol/SubstakeL2Config.json"


const provider = new JsonRpcProvider(scrollSepoliaRPC);
const signer = new ethers.Wallet(privateKey, provider);

async function getAbi(path){
    const data = await fsPromise.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;
}

const main = async () =>{
    // _upgradeImplementation();
    // _initialize();
}

const _upgradeImplementation = async () => {
    const PROXY_ABI = await getAbi(substakeL2configProxyabipath);
    const contract = new ethers.Contract(substakeL2configProxyAddress, PROXY_ABI.abi, signer);
    const substakeL2configImplementation = "";
    console.log("Updating implementaion.........................");
    let tx = await contract.upgradeImplementation(substakeL2configImplementation)
    await tx.wait()
    .then(() => {
        console.log("substakeL2config Implementation Updated!");
    })
    .catch((error) => {
        console.log("Failed to update implementation.");
        console.log(error);
    })
}

const _initialize = async () => {
    const IMPLEMENTATION_ABI = await getAbi(substakeL2configImplementationabipath);
    const contract = new ethers.Contract(substakeL2configProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    const admin = "0x55d9a0d367866a102eD85EA76CE46B11E62b3E88";
    const lidoExRate = 1148673760458824808;
    console.log("Initializing substakeL2config.................................");
    let tx = await contract.initialize(admin,lidoExRate);
    await tx.wait()
    .then(() => {
        console.log("SubstakeL2config Initialized!");
    })
    .catch((error) => {
        console.log("Failed to initialize SubstakeL2config!");
        console.log(error);
    })
}
