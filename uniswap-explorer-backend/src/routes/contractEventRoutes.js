const express = require("express")
const router = express.Router()

// Redis client
const { createClient } = require("redis");
const client = createClient({
    url: process.env.REDIS_URL
});
// connect to Caching DB
require("../startup/db")(client)

// authentication token 
const { auth } = require("../middlewares/auth")

// Blockchain Provider and Contract Initializers 
const { providers, Contract } = require("ethers");


// ABIs
const { uniswapFactoryABI } = require("../abis/uniswapFactoryABI");
const { uniswapPairABI } = require("../abis/uniswapPairABI");


// RPCs
const { rpcM, rpcR } = require("../config");

// Providers
const providerM = new providers.JsonRpcProvider(rpcM);
const providerR = new providers.JsonRpcProvider(rpcR);

// Debuggers
const trackingRopstenData = require("debug")("App:ropsten");
const trackingMainnetData = require("debug")("App:mainnet");

// uniswap router v2 address
// let uniSwapRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"

// factory contract
let uniSwapFactoryAddress = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f";

// pair
// let uniSwapPairAddress = "0x3356c9A8f40F8E9C1d192A4347A76D18243fABC5" 

// uniswap mainnet and ropsten contracts initialization
const uniM = new Contract(uniSwapFactoryAddress, uniswapFactoryABI, providerM);
const uniR = new Contract(uniSwapFactoryAddress, uniswapFactoryABI, providerR);


router.get("/ropsten/data", auth, async (req, res) => {
    try {
        // this variable is used to get the previous block number from which we'll get events
        let difference = 1000;
        const fromBlock = Number(req.query.fromBlock);
        if (!fromBlock) return res.status(400).send("Block Number Is Required")

        trackingRopstenData("1 fromBlock", fromBlock);
        // this variable will store all pairCreated events emit by uniswap factory contract
        let pairCreatedEvents = [];
        // getting pairCreated events from Cache if already this range is of events requested 
        let pairCreated = await client.get(
            String(fromBlock - difference, fromBlock)
        );
        // if this range exists in cache
        // than load it from cache
        if (pairCreated) {
            trackingRopstenData("2 Serving from cache");
            pairCreatedEvents = JSON.parse(pairCreated);
        } else {
            // otherwise get pairCreated events from blockchain
            pairCreatedEvents = await uniR.queryFilter(
                "PairCreated",
                fromBlock - difference,
                fromBlock
            );
            // logging the total number of events
            trackingRopstenData(
                "3 Getting pair contract addresses",
                pairCreatedEvents.length
            );
            // saving these in cache for 10000 seconds
            client.setEx(
                String(fromBlock - difference, fromBlock),
                10000,
                JSON.stringify(pairCreatedEvents)
            );
        }

        // getting all pair addresses, these are actually contract addresses that are generated at run time. using these addresses we'll get all the Swap events
        const pairs = pairCreatedEvents.map((event) => event.args[2]);
        trackingRopstenData("4 got pair contract addresses", pairs.length);
        // this array of pair addresses will behave like contract addresses

        // variable to store all the final transactions
        let allEventsOfPairContract = [];
        for (let i = 0; i < pairs.length; i++) {
            const address = pairs[i];
            // checking if this transaction is already saved in Cache or not
            const data = await client.get(address.toString());
            if (data) {
                trackingRopstenData("5 Getting Events from Cache");
                allEventsOfPairContract = [
                    ...allEventsOfPairContract,
                    ...JSON.parse(data),
                ];
            } else {
                // if not present in cache than get it from blockchain
                const pairContract = new Contract(address, uniswapPairABI, providerR);
                trackingRopstenData("Getting transactions from blockchain");
                // Getting all the Swap events from blockchain
                let events = await pairContract.queryFilter("Swap", 0, "latest");
                allEventsOfPairContract = [
                    ...allEventsOfPairContract,
                    ...events,
                ];
                // caching it for later requests
                client.setEx(address.toString(), difference, JSON.stringify(events));
            }
        }
        trackingRopstenData(
            "6 allEventsOfPairContract",
            allEventsOfPairContract.length
        );
        // sending all got events
        res.status(200).send(allEventsOfPairContract);
    } catch (error) {
        console.log("error", error);
        res.status(500).send(error);
    }
}
)

router.get("/mainnet/data", auth, async (req, res) => {
    try {
        // this variable is used to get the previous block number from which we'll get events
        let difference = 1000;
        const fromBlock = Number(req.query.fromBlock);
        if (!fromBlock) return res.status(400).send("Block Number Is Required")

        trackingMainnetData("1 fromBlock", fromBlock);
        // this variable will store all pairCreated events emit by uniswap factory contract
        let pairCreatedEvents = [];
        // getting pairCreated events from Cache if already this range is of events requested 
        let pairCreated = await client.get(
            String(fromBlock - difference, fromBlock)
        );
        // if this range exists in cache
        // than load it from cache
        if (pairCreated) {
            trackingMainnetData("2 Serving from cache");
            pairCreatedEvents = JSON.parse(pairCreated);
        } else {
            // otherwise get pairCreated events from blockchain
            pairCreatedEvents = await uniM.queryFilter(
                "PairCreated",
                fromBlock - difference,
                fromBlock
            );
            trackingMainnetData(
                "3 Getting pair contract addresses",
                pairCreatedEvents.length
            );
            // saving these in cache for 10000 seconds
            client.setEx(
                String(fromBlock - difference, fromBlock),
                10000,
                JSON.stringify(pairCreatedEvents)
            );
        }

        // getting all pair addresses, these are actually contract addresses that are generated at run time. using these addresses we'll get all the Swap events
        const pairs = pairCreatedEvents.map((event) => event.args[2]);
        trackingMainnetData("4 got pair contract addresses", pairs.length);
        // this array of pair addresses will behave like contract addresses

        // variable to store all the final transactions
        let allEventsOfPairContract = [];
        for (let i = 0; i < pairs.length; i++) {
            const address = pairs[i];
            // checking if this transaction is already saved in Cache or not
            const data = await client.get(address.toString());
            if (data) {
                trackingMainnetData("5 Getting Events from Cache");
                allEventsOfPairContract = [
                    ...allEventsOfPairContract,
                    ...JSON.parse(data),
                ];
            } else {
                // if not present in cache than get it from blockchain
                const pairContract = new Contract(address, uniswapPairABI, providerM);
                trackingMainnetData("Getting transactions from blockchain");
                // Getting all the Swap events from blockchain
                let events = await pairContract.queryFilter("Swap", 0, "latest");
                // caching it for later requests
                client.setEx(address.toString(), difference, JSON.stringify(events));
                allEventsOfPairContract = [
                    ...allEventsOfPairContract,
                    ...events,
                ];
            }
        }
        trackingMainnetData(
            "6 allEventsOfPairContract",
            allEventsOfPairContract.length
        );

        // sending all got events
        res.status(200).send(allEventsOfPairContract);
    } catch (error) {
        console.log("error", error);
        res.status(500).send(error);
    }
}
)

module.exports = router