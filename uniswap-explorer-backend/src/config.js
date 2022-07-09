const {config} = require('dotenv');
config();
// RPC for mainnet and testnet
const rpcM = `https://mainnet.infura.io/v3/${process.env.KEY}`
const rpcR = `https://ropsten.infura.io/v3/${process.env.KEY}`

module.exports={rpcM, rpcR}