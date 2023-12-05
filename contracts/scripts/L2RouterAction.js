const {ethers, JsonRpcProvider, parseEther} = require("ethers");
require('dotenv').config();
let fs= require('fs');
const fsPromise = fs.promises;

const scrollSepoliaRPC = process.env.SCROLL_RPC;
const privateKey = process.env.PV_KEY

const substakeL2routerImplementationabipath = "../out/SubstakeL2Router.sol/SubstakeL2Router.json"
const substakeL2routerProxyAddress = "0x4ceBC071291125dffc07Fb2b57d2B96c9FB32bCD";



const provider = new JsonRpcProvider(scrollSepoliaRPC);
const signer = new ethers.Wallet(privateKey, provider);

async function getAbi(path){
    const data = await fsPromise.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;
}

const main =  () =>{
    // _sendEthAndMessage()
    _sendOnlyMessage()
}

const _sendEthAndMessage = async () => {
    const IMPLEMENTATION_ABI =await getAbi(substakeL2routerImplementationabipath);
    const contract = new ethers.Contract(substakeL2routerProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    const ethAmount =  ethers.parseEther("0.00090");
    const data = ethers.toUtf8Bytes("Hello");
    const l1Contract = "0xa08fDf3AA199c79a476Fbb653BB0DA3EC3C7A5Da";
    const fee = ethers.parseEther("0.006");
    console.log("calling sendEthAndMessage.......");
    let tx = await contract.sendEthAndMessage(
        ethAmount,
        data,
        l1Contract,
        fee, {
            value : ethAmount
        }
    )
    await tx.wait()
    .then(() => {
        console.log("transaction successful");
    })
    .catch((error) => {
        console.log("transaction failed.");
        console.log(error);
    })
}

const _sendOnlyMessage =  async () => {
    const IMPLEMENTATION_ABI = await getAbi(substakeL2routerImplementationabipath);
    const contract = new ethers.Contract(substakeL2routerProxyAddress, IMPLEMENTATION_ABI.abi, signer);
    const data = ethers.toUtf8Bytes("Anubhav");
    // const hexMaybe = ethers.hexlify(data);
    // console.log("data", data);
    // console.log("hex maybe : ", hexMaybe);
    // const messageHash = ethers.keccak256(hexMaybe);
    // console.log("messageHash : ", messageHash);
    const l1Contract = "0xa08fDf3AA199c79a476Fbb653BB0DA3EC3C7A5Da";
    const fee = ethers.parseEther("0.0005");
    console.log("Calling sendOnlyMessage.............");
    let tx = await contract.sendOnlyMessage(
        data,
        l1Contract,
        fee
    )
    await tx.wait()
    .then(() => {
        console.log("transaction successful");
    })
    .catch((error) => {
        console.log("transaction failed.");
        console.log(error);
    })
}

const merkleInclusionProof =  async () => {
    // https://sepolia-api-bridge.scroll.io/api/claimable?address=0x22b6dd4d6d818e2ebce3d2e009a249f8fbf4e965&page_size=10&page=1
}

main();