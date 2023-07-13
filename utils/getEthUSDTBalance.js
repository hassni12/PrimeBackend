const { Web3 } = require("web3");
const web3 = new Web3(
  "https://eth-mainnet.g.alchemy.com/v2/RjSInvJc-YEUUH2M1_wevtj29b6WjO21"
);

const usdtAbi = [
  // standard ERC20 functions
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // ...
];
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; //for MAINNET ETH
const USDT_CONTRACT = new web3.eth.Contract(usdtAbi, USDT_ADDRESS);

// const accountAddress = '';                  //enter the address of the user here

const getEthUSDTBalance = async (accountAddress) => {
  console.log(accountAddress, "eth");
  const balanceRaw = await USDT_CONTRACT.methods
    .balanceOf(accountAddress)
    .call();
  const balance = parseFloat(balanceRaw) / 10 ** 6;
  console.log("USDT balance:", balance);
  return balance
};

module.exports = { getEthUSDTBalance };
