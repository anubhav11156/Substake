const {ethers, JsonRpcProvider} = require("ethers");

let fs= require('fs');
const fsPromise = fs.promises;

const ALCHEMY_RPC_URL = ""
const privateKey = ""

const substakeL2configProxyabipath = "../out/SubstakeL2ConfigProxy.sol/SubstakeL2ConfigProxy.json";
const substakeL2configProxyAddress = "";

const scrollSepoliaRPC = ""

const provider = new JsonRpcProvider(scrollSepoliaRPC);
const signer = new ethers.Wallet(privateKey, provider);

async function getAbi(path){
    const data = await fsPromise.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;substake
}

const main = async () =>{

}

