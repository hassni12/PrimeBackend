// const Web3 = require("web3");
// const web3 = new Web3(
//   "https://eth-mainnet.g.alchemy.com/v2/RjSInvJc-YEUUH2M1_wevtj29b6WjO21"
// );

// //const Tx = require("ethereumjs-tx").Transaction;
// const usdtAbi = [
//   {
//     constant: true,
//     inputs: [],
//     name: "name",
//     outputs: [{ name: "", type: "string" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ name: "_upgradedAddress", type: "address" }],
//     name: "deprecate",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "_spender", type: "address" },
//       { name: "_value", type: "uint256" },
//     ],
//     name: "approve",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "deprecated",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ name: "_evilUser", type: "address" }],
//     name: "addBlackList",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "totalSupply",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "_from", type: "address" },
//       { name: "_to", type: "address" },
//       { name: "_value", type: "uint256" },
//     ],
//     name: "transferFrom",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "upgradedAddress",
//     outputs: [{ name: "", type: "address" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [{ name: "", type: "address" }],
//     name: "balances",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "decimals",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "maximumFee",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "_totalSupply",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [],
//     name: "unpause",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [{ name: "_maker", type: "address" }],
//     name: "getBlackListStatus",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [
//       { name: "", type: "address" },
//       { name: "", type: "address" },
//     ],
//     name: "allowed",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "paused",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [{ name: "who", type: "address" }],
//     name: "balanceOf",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [],
//     name: "pause",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "getOwner",
//     outputs: [{ name: "", type: "address" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "owner",
//     outputs: [{ name: "", type: "address" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "symbol",
//     outputs: [{ name: "", type: "string" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "_to", type: "address" },
//       { name: "_value", type: "uint256" },
//     ],
//     name: "transfer",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [
//       { name: "newBasisPoints", type: "uint256" },
//       { name: "newMaxFee", type: "uint256" },
//     ],
//     name: "setParams",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ name: "amount", type: "uint256" }],
//     name: "issue",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ name: "amount", type: "uint256" }],
//     name: "redeem",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [
//       { name: "_owner", type: "address" },
//       { name: "_spender", type: "address" },
//     ],
//     name: "allowance",
//     outputs: [{ name: "remaining", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "basisPointsRate",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [{ name: "", type: "address" }],
//     name: "isBlackListed",
//     outputs: [{ name: "", type: "bool" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ name: "_clearedUser", type: "address" }],
//     name: "removeBlackList",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: true,
//     inputs: [],
//     name: "MAX_UINT",
//     outputs: [{ name: "", type: "uint256" }],
//     payable: false,
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ name: "newOwner", type: "address" }],
//     name: "transferOwnership",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     constant: false,
//     inputs: [{ name: "_blackListedUser", type: "address" }],
//     name: "destroyBlackFunds",
//     outputs: [],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       { name: "_initialSupply", type: "uint256" },
//       { name: "_name", type: "string" },
//       { name: "_symbol", type: "string" },
//       { name: "_decimals", type: "uint256" },
//     ],
//     payable: false,
//     stateMutability: "nonpayable",
//     type: "constructor",
//   },
//   {
//     anonymous: false,
//     inputs: [{ indexed: false, name: "amount", type: "uint256" }],
//     name: "Issue",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [{ indexed: false, name: "amount", type: "uint256" }],
//     name: "Redeem",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [{ indexed: false, name: "newAddress", type: "address" }],
//     name: "Deprecate",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: false, name: "feeBasisPoints", type: "uint256" },
//       { indexed: false, name: "maxFee", type: "uint256" },
//     ],
//     name: "Params",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: false, name: "_blackListedUser", type: "address" },
//       { indexed: false, name: "_balance", type: "uint256" },
//     ],
//     name: "DestroyedBlackFunds",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [{ indexed: false, name: "_user", type: "address" }],
//     name: "AddedBlackList",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [{ indexed: false, name: "_user", type: "address" }],
//     name: "RemovedBlackList",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, name: "owner", type: "address" },
//       { indexed: true, name: "spender", type: "address" },
//       { indexed: false, name: "value", type: "uint256" },
//     ],
//     name: "Approval",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, name: "from", type: "address" },
//       { indexed: true, name: "to", type: "address" },
//       { indexed: false, name: "value", type: "uint256" },
//     ],
//     name: "Transfer",
//     type: "event",
//   },
//   { anonymous: false, inputs: [], name: "Pause", type: "event" },
//   { anonymous: false, inputs: [], name: "Unpause", type: "event" },
// ];

// const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; //for MAINNET ETHEREUM
// const USDT_DECIMALS = 6;
// const USDT_CONTRACT = new web3.eth.Contract(usdtAbi, USDT_ADDRESS);

// //SENDER ACCOUNT ADDRESS AND PRIVATE KEY
// const accountFrom = "";                         //enter user wallet address a.k.a from
// const privateKey = "";                          //enter user pvt key a.k.a from

// //RECEIVER ADDRESS AND AMOUNT TO SEND
// const accountTo = "";                           //enter receipient address
// let amountToSend ; //                    //enter the amount which you want to send

// async function sendUSDT() {
//   const nonce = await web3.eth.getTransactionCount(accountFrom, "latest");
//   const gasPrice = await web3.eth.getGasPrice();
//   const gasLimit = 300000; // adjust this value as needed

//   const usdtAmount = (amountToSend * 10 ** USDT_DECIMALS).toString();
//   const txParams = {
//     nonce: web3.utils.toHex(nonce),
//     gasPrice: web3.utils.toHex(gasPrice),
//     gasLimit: web3.utils.toHex(gasLimit),
//     to: USDT_ADDRESS,
//     value: "0x00",
//     data: USDT_CONTRACT.methods.transfer(accountTo, usdtAmount).encodeABI(),
//   };

  
//   console.log(web3.utils.fromWei(gasPrice));
//   const signedTx = await web3.eth.accounts.signTransaction(txParams, privateKey);
//   const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

//   console.log("Transaction hash:", txReceipt);
// }

// sendUSDT();