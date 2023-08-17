const bodyParser = require("body-parser"); // expess is not too capable to recieve data in json file and here we need middle wear to make express capable
// in this we create node
const express = require("express");
const request = require("request"); // for syncing the blockchain

const Blockchain = require("./blockchain");
const PubSub = require("./publishsubscribe");

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });
const DEFAULT_PORT = 3000; // through this we can run a application

const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
setTimeout(() => pubsub.broadcastChain(), 1000);
app.use(bodyParser.json());
// here we perform read operation on blockchain through API

// **** HERE GET FUNCTION IS USED TO READ DATA FROM BLOCKCHAIN *****
app.get("/api/blocks", (req, res) => {
  //through get we can call API
  res.json(blockchain.chain); // blockchain data appear on screen through response function i.e, res
});

// **** NOW WE PERFORM WRITE OPERATION ON BLOCKCHAIN ****

//  **** POST FUNCTION IS USED TO PERFOM WRITE OPERATION ON BLOCKCHAIN ****

app.post("/api/mine", (req, res) => {
  const { data } = req.body; // miner who write data and add block on blockchain use req object and send data in json form and json data come through req.body statement

  blockchain.addBlock({ data });

  // **** broadcast the blockchain ****
  pubsub.broadcastChain();
  res.redirect("/api/blocks"); // so that the miners can check the data added or note
});

const synChains = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        // for eg if website doesn't exist than screen display 404 error not found
        const rootChain = JSON.parse(body);
        console.log("Replace chain on sync with", rootChain);
        blockchain.replaceChain(rootChain);
      }
    }
  );
};
//const DEFAULT_PORT = 3000; // through this we can run a application

let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === "true") {
  // here we select randomly port
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`listening to PORT:${PORT}`);
  synChains();
  //blockchain.countNode++;
});
//console.log(blockchain.countNode);
