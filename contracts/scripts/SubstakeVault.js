const {ethers, JsonRpcProvider} = require("ethers");

let fs= require('fs');
const fsPromise = fs.promises;

const ALCHEMY_RPC_URL = ""
const privateKey = ""

const vaultProxyabipath = "../out/SubstakeVaultProxy.sol/SubstakeVaultProxy.json";
const vaultProxyAddress = "";

const scrollSepoliaRPC = ""

const provider = new JsonRpcProvider(scrollSepoliaRPC);
const signer = new ethers.Wallet(privateKey, provider);

async function getAbi(path){
    const data = await fsPromise.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;
}

const main = async () =>{

}

const upgradeImplementation = async () => {
    const PROXY_ABI = await getAbi(vaultProxyabipath);
    const contract = new ethers.Contract(VaultProxyAddress, PROXY_ABI.abi, signer);
    const vaultImplementation = "";
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
    const IMPLEMENTATION_ABI = await getAbi(vaultImplementationabipath);
    const contract = new ethers.Contract(VaultProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    const admin = "0x55d9a0d367866a102eD85EA76CE46B11E62b3E88";
    const L2config ="0x7a5483542b602e130a05Db23a7E2AeC59b2F08C6";
    console.log("Initializing Vault.................................");
    let tx = await contract.initialize(admin,L2config);
    await tx.wait()
    .then(() => {
        console.log("vault Initialized!");
    })
    .catch((error) => {
        console.log("Failed to initialize vault!");
        console.log(error);
    })
}
const deposit = async () => {
    const VAULT_ABI =await getAbi(Vaultabipath);
    const contract = new ethers.Contract();
  
    console.log("calling deposit(uint256, address");


}