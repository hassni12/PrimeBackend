const TronWeb = require("tronweb");
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
// const fullNode = new HttpProvider("http://192.168.1.162:8090");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey =
  "7314730a1e40084fdccd5621d4cc37edf49684eeb3307256dd67a17c37eb1b59";
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

const CONTRACTADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

// const address = "<USER WALLET ADDRESS HERE>";             //ENTER USER WALLET ADDRESS HERE

const getTronUSDTBalance = async (address) => {
  console.log(address, "tron");
  const { abi } = await tronWeb.trx.getContract(CONTRACTADDRESS);
  // console.log(JSON.stringify(abi));

  const contract = tronWeb.contract(abi.entrys, CONTRACTADDRESS);

  const balance = await contract.methods.balanceOf(address).call();
  console.log("balance:", (balance / 10 ** 6).toString());
  const amount = (balance / 10 ** 6).toString();
  return amount;
  // const resp = await contract.methods.transfer(ACCOUNT, 1000).send();
  // console.log("transfer:", resp);
};
module.exports = { getTronUSDTBalance };

// getTronUSDTBalance().then(() => {
//         console.log("ok");
//     })
//     .catch((err) => {
//         console.log("error:", err);
//     });
