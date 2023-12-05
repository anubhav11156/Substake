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
    const _to = "0xa08fDf3AA199c79a476Fbb653BB0DA3EC3C7A5Da"
    const _value = "6000000000000000"
    const _nonce = "333396"
    const _message = "0x48656c6c6f"
    const _proof = {
        batchIndex: 58241,
        merkleProof: "0x0000000000000000000000000000000000000000000000000000000000000000ad3228b676f7d3cd4284a5443f17f1962b36e491b30a40b2405849e597ba5fb5bc26526dd615d5586e50dbb903cdac2bcbf537bee4e841aef86516ed4b7e6ff321ddb9a356815c3fac1026b6dec5df3124afbadb485c9ba5a3e3398a04b7ba85f67940a17a2c5bfab6dd12d860f2a23bf1737ef7fb0acdd858a8bdff52b337770eb01ebfc9ed27500cd4dfc979272d1f0913cc9f66540d7e8005811109e1cf2d9408145ddc5bb350f6c3e837bf9014725dd0ae78339f25b7884b8360498dc52fffd70157e48063fc33c97a050f7f640233bf646cc98d9524c6b92bcf3ab56f839867cc5f7f196b93bae1e27e6320742445d290f2263827498b54fec539f756af07d9a2a80dd2dcb0a5e47bb394e66120bcf1bcd217f8a2b2f106e3895c30d8b9fe1a72139d50f7776b6c4f33595fa3fd3a12b0156ebf3a9ee954ba929018181ef8b13a49e282f609c317a833fb8d976d11517c571d1221a265d25af778ecf8920e08c29f79f3e359ce11fc339e8357ee32f5a5ba8ae62cfcf7e6f8e4a72a30c7c1df82d9c4b87413eae2ef048f94b4d3554cea73d92b0f7af96e0271c691e2bb5c67add7c6caf302256adedf7ab114da0acfe870d449a3a489f781d659e8beccda7bce9f4e8618b6bd2f4132ce798cdc7a60e7e1460a7299e3c6342a579626d27874b09783cef2e7750f7ea24f6090c9ce47f33cf25ca5e16a1207b4a50fda2be1d3b5c807b281e4683cc6d6315cf95b9ade8641defcb32372f1c126e398ef7a1ef973d30ca636d922d10ae577c73bc4fe92699225f30c0c2e9d6727bceb256d", // Replace with the actual merkle proof
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

