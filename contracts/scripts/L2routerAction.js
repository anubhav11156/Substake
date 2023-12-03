const {ethers, JsonRpcProvider} = require("ethers");

let fs= require('fs');
const fsPromise = fs.promises;

const ALCHEMY_RPC_URL = ""
const privateKey = ""

const substakeL2routerProxyabipath = "../out/SubstakeL2RouterProxy.sol/SubstakeL2RouterProxy.json";
const substakeL2routerProxyAddress = "";

const substakeL2routerImplementationabipath = "";

const scrollSepoliaRPC = ""

const provider = new JsonRpcProvider(scrollSepoliaRPC);
const signer = new ethers.Wallet(privateKey, provider);

async function getAbi(path){
    const data = await fsPromise.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;substake
}

const main =  () =>{
    //_sendEthAndMessage()
    //_sendOnlyMessage()
}

const _sendEthAndMessage = async () => {
    const IMPLEMENTATION_ABI =await getAbi(substakeL2routerImplementationabipath);
    const contract = new ethers.Contract(substakeL2routerProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    let tx = await contract.sendEthAndMessage()
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

const _sendOnlyMessage = async () => {
    const IMPLEMENTATION_ABI =await getAbi(substakeL2routerImplementationabipath);
    const contract = new ethers.Contract(substakeL2routerProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    let tx = await contract.sendOnlyMessage()
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