const {ethers, JsonRpcProvider} = require("ethers");

let fs= require('fs');
const fsPromise = fs.promises;

const ALCHEMY_RPC_URL = ""
const privateKey = ""

const vaultProxyabipath = "../out/SubstakeVaultProxy.sol/SubstakeVaultProxy.json";
const vaultProxyAddress = "";

const vaultImplementationabipath = "";

const scrollSepoliaRPC = ""

const provider = new JsonRpcProvider(scrollSepoliaRPC);
const signer = new ethers.Wallet(privateKey, provider);

async function getAbi(path){
    const data = await fsPromise.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;
}

const main = async () =>{
//_deposit();
}

const _deposit = async () => {
    const IMPLEMENTATION_ABI = await getAbi(vaultImplementationabipath);
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

main();