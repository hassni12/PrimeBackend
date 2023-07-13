const ethers = require("ethers");
require("dotenv").config();
const { User_Logs } = require("../models/user_logs");
const { Wallet } = require("../models/wallet");
const { Op } = require('sequelize');
const IERC20ABI = require("./IERC20.json");
const walletAddress = process.env.PUBLIC_ADDRESS;
const tokenContractAddress = process.env.TOKEN_ADDRESS;
const toAccountAddress = "0x1783C397F5d6D208A78cfCE5A8BF00F856154117"; // Main Wallet For Funds
const listenForTokenTransfers = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.g.alchemy.com/v2/ygr7LtSKFk58AuJAyGp06WIhqhCCIb3v"
  );
  const tokenContract = new ethers.Contract(
    tokenContractAddress,
    IERC20ABI,
    provider
  );
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const keystoreJson = await signer.encrypt("password");
  console.log("keystoreJson", keystoreJson);

  const currentBlockNumber = await provider.getBlockNumber();
  console.log("line 18");
  // Listen for Transfer events from the token contract
  tokenContract.on("Transfer", async (from, to, value, event) => {
    const blockNumber = event.blockNumber;

    if (blockNumber > currentBlockNumber) {
      if (to.toLowerCase() === walletAddress.toLowerCase()) {
        console.log("Token Transfer Received:");
        console.log("From:", from);
        console.log("To:", to);
        console.log("Value:", value.toString());
        // Transfer Tokens to Another Account
        // const response = await tokenContract.connect(signer).transfer(toAccountAddress, value.toString());
        // const reciept =  await response.wait();
        // console.log(reciept);
        console.log("TX HASH", event.transactionHash);
        if (value<50) {
          return res.status(400).send("value must be greater than 50");
        }
        const walletData = await Wallet.findAll({
          where: {
            [Op.or]: [
              { ethereum_wellet: to },
              { tron_wellet: to},
              { bsc_wellet: to }
            ]
          }
        }); 
        console.log(walletData,"Transaction");

        const newLog = await User_Logs.create({
          from: from,
          to: to,
          value: parseInt(value.toString()),
          user_id: walletData[0].dataValues.user_id,
          tx_hash: event.transactionHash,
        });
        console.log(newLog, "newLog");
        // console.log("line 33")
      }
    }
  });
  console.log("line 37");
};

module.exports = { listenForTokenTransfers };
