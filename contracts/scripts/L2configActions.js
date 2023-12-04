const {ethers, JsonRpcProvider} = require("ethers");
let fs= require('fs');
const fsPromise = fs.promises;

const scrollSepoliaRPC = process.env.SCROLL_RPC;
const privateKey = process.env.PV_KEY

const substakeL2configProxyabipath = "../out/SubstakeL2ConfigProxy.sol/SubstakeL2ConfigProxy.json";
const substakeL2configProxyAddress = "0x7BCaa65E6cAceF4FB7F2852488829bd92090667a";


const provider = new JsonRpcProvider(scrollSepoliaRPC);
const signer = new ethers.Wallet(privateKey, provider);

async function getAbi(path){
    const data = await fsPromise.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;
}

const main = async () =>{
    
}

