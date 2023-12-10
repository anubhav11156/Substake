const { ethers, JsonRpcProvider } = require("ethers");
require('dotenv').config();
let fs = require('fs');
const fsPromise = fs.promises;

const ethSepoliaRpc = process.env.ETH_SEPOLIA;
const privateKey = process.env.PV_KEY

const scrollL1MessengerAbiPath = "./L1ScrollMessengerAbi.json";
const scrollL1MessengerProxy = "0x50c7d3e7f7c656493D1D76aaa1a836CedfCBB16A";

const provider = new JsonRpcProvider(ethSepoliaRpc);
const signer = new ethers.Wallet(privateKey, provider);

async function getAbi(path) {
    const data = await fsPromise.readFile(path, 'utf-8');
    const abi = JSON.parse(data);
    return abi;
}

const main = async () => {
    relayMessage();
}


const relayMessage = async () => {
    const L1ScrollMessengerAbi = await getAbi(scrollL1MessengerAbiPath);
    const contract = new ethers.Contract(scrollL1MessengerProxy, L1ScrollMessengerAbi, signer);
    const _from = "0x4ceBC071291125dffc07Fb2b57d2B96c9FB32bCD"
    const _to = "0x2e0046C22b33679925a094c90D4587941Db77066"
    const _value = "0"
    const _nonce = "333667"
    const _message = "0x00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000"
    const _proof = {
        batchIndex: 58524,
        merkleProof: "0xd226866097150337529f4e40b84cf32efcc6166456b920e77ef712a6494ac5c333ee4f3287740d9ddb7329b7f6bd51c5cc540a75d179de0f4231accb385113fc0fea446491bec9f0d599bf3f81c9ef367602ffd4110eedd527aacfd861192b4e21ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85e58769b32a1beaf1ea27375a44095a0d1fb664ce2dd358e7fcbfb78c26a193441e4cf7a2254f3d7672597c471ab9c9e5c1c48ebc35c7a89b0a0ef1b92dedade7cc376c5f05b84e415db11ea4dfffd8aa2df5c8d7bca7b3f237cbe53439ed7a6effd70157e48063fc33c97a050f7f640233bf646cc98d9524c6b92bcf3ab56f83b20151b30da0660be7a52a98a1f103bf4540bc882371871ae512d5d166e114fe07d9a2a80dd2dcb0a5e47bb394e66120bcf1bcd217f8a2b2f106e3895c30d8b9fe1a72139d50f7776b6c4f33595fa3fd3a12b0156ebf3a9ee954ba929018181ef8b13a49e282f609c317a833fb8d976d11517c571d1221a265d25af778ecf8920e08c29f79f3e359ce11fc339e8357ee32f5a5ba8ae62cfcf7e6f8e4a72a30c7c1df82d9c4b87413eae2ef048f94b4d3554cea73d92b0f7af96e0271c691e2bb5c67add7c6caf302256adedf7ab114da0acfe870d449a3a489f781d659e8beccda7bce9f4e8618b6bd2f4132ce798cdc7a60e7e1460a7299e3c6342a579626d27874b09783cef2e7750f7ea24f6090c9ce47f33cf25ca5e16a1207b4a50fda2be1d3b5c807b281e4683cc6d6315cf95b9ade8641defcb32372f1c126e398ef7a1ef973d30ca636d922d10ae577c73bc4fe92699225f30c0c2e9d6727bceb256d", // Replace with the actual merkle proof
    };
    console.log("Relaying message.......");
    let tx = await contract.relayMessageWithProof(
        _from,
        _to,
        _value,
        _nonce,
        _message,
        _proof
    )
    await tx.wait()
        .then(() => {
            console.log("relay successsful!");
        })
        .catch((error) => {
            console.log("Call failed : (");
            console.log(error);
        })
}

main();

