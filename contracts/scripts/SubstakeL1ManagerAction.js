const {ethers, JsonRpcProvider} = require("ethers");
let fs= require('fs');
require('dotenv').config();
const fsPromises = fs.promises;


const ethSepoliaRpc = process.env.ETH_SEPOLIA;
const privateKey = process.env.PV_KEY;

const substakeL1ManagerProxyAddress = "0x2e0046C22b33679925a094c90D4587941Db77066";
const substakeL1ManagerImplementationabipath =  "../out/SubstakeL1Manager.sol/SubstakeL1Manager.json"

const provider = new JsonRpcProvider(ethSepoliaRpc);
const signer = new ethers.Wallet(privateKey, provider);


async function getAbi(path) {
    const data = await fsPromises.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;
}

const main = () => {
    // _sendStakeMessage();
    // _sendUnstakeMessage();
}

const _sendStakeMessage = async () => {
    const _stakeBatchId = 1;
    const _totalShares =  870010865189327;
    const _exRate = 9475924785;
    const _gaslimitMultiplier = 3;
    const _l2Gaslimit = 600000;


    const L1CONTRACT_ABI = await getAbi(substakeL1ManagerImplementationabipath);
    const contract = new ethers.Contract(substakeL1ManagerProxyAddress, L1CONTRACT_ABI.abi, signer);
    // const _amount = ethers.parseEther("0.005");
    const _fee = ethers.parseEther("0.021");
    // const _value = (_amount + _fee);
    // const _gaslimit = 5*28324;
    console.log("Calling sendStakeMessage().........................");
    let tx = await contract.sendStakeMessage(
        _stakeBatchId,
        _totalShares,
        _exRate,
        _gaslimitMultiplier,
        _l2Gaslimit,
        _fee,
         {
            value:_fee,
            gasLimit:1000000,
        }
    );
    await tx.wait()
    .then(() => {
        console.log("Call successfull!");
    })
    .catch((error) => {
        console.log("Failed to call!");
        console.log(error);
    })

}

// const _sendUnstakeMessage = async () => {

// }

main();