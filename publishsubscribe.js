const redis = require("redis");

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};
//const blockchain = new Blockchain();
class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    // **** SUBSCRIBE THE CHANNEL ****
    this.subscriber.subscribe(CHANNELS.TEST);
    this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);

    this.subscriber.on("message", (channel, message) =>
      this.handleMessage(channel, message)
    );
  }
  handleMessage(channel, message) {
    console.log(`Message recieved.channel:${channel} Message:${message}`);
    const parseMessage = JSON.parse(message);
    if (channel === CHANNELS.BLOCKCHAIN) {
      // for eg : A miner create a blockchain and publish this blockchain and After publishing the blockchain , subscriber check that
      this.blockchain.replaceChain(parseMessage); //(1). That blockchain is eligble to replace or not
    }
  }
  publish({ channel, message }) {
    this.publisher.publish(channel, message);
  }

  // **** BROADCAST THE BLOCKCHAIN ****
  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
}

//const checkPubSub = new PubSub();
/*setTimeout(
  () => checkPubSub.publisher.publish(CHANNELS.TEST, "Helloooo"),
  1000
);*/
module.exports = PubSub;
