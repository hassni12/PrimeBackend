
const Web3 = require("web3")

const web3 = new Web3("https://bsc-dataseed.binance.org/")  //FYCE_APP_INFURA API_KEY


//SENDER PUBLIC ADDRESSs

web3.eth.getBalance("<USER WALLET ADDRESS>", function(err, result) {
  if (err) {
    console.log(err)
  } else {
    console.log(web3.utils.fromWei(result, "ether") + " BNB")
  }
})

