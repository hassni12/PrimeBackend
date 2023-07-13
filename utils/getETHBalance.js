
const Web3 = require("web3")

const web3 = new Web3(
    "https://eth-mainnet.g.alchemy.com/v2/RjSInvJc-YEUUH2M1_wevtj29b6WjO21"
  );


//SENDER PUBLIC ADDRESSs

const getEthBalance = (walletAddress) => {
  web3.eth.getBalance(walletAddress, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(web3.utils.fromWei(result, "ether") + " ETH");
    }
  });
};

module.exports = {getEthBalance};