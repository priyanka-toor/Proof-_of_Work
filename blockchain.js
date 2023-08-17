// make a link with other blockchain
const Block = require("./block");
const cryptoHash = require("./crypto-hash");
let countNode;
class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }
  countNode = 1;
  // Mining
  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      prevBlock: this.chain[this.chain.length - 1],
      data,
    });
    this.chain.push(newBlock);
  }

  // **** CHECK VALIDATION ****
  // We have to check that wether the block add to the chain malicious or not

  static isValidChain(chain) {
    // """ if(chain[0]!==Block.genesis()) """ // chain is from different instance/object and block is form different instance so we can not compared both like that if we compared like this , this will definetly give false result.
    // for above to get correct result we can do like that
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }
    // if upcoming blockchain are malicious
    for (let i = 1; i < chain.length; i++) {
      const { timestamp, prevHash, hash, nonce, difficulty, data } = chain[i];
      const lastDifficulty = chain[i - 1].difficulty;
      const realLastHash = chain[i - 1].hash;

      if (prevHash !== realLastHash) return false;

      const validatedHash = cryptoHash(
        timestamp,
        prevHash,
        nonce,
        difficulty,
        data
      );

      if (hash !== validatedHash) return false;
      if (Math.abs(lastDifficulty - difficulty) > 1) return false; // if miner increase the difficulty they collapse the whole system so we set the value of differnce of difficulty -1 or 1 so that it can't increase the difficulty
      // In 2nd case if miner want that mine fastly and solve computation fastly so they want to decrease the difficulty
    }
    return true;
  }

  // **** LONGEST CHAIN ****
  // miner should  select longest chain

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain is not longer");
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain is not valid");
      return;
    }
    this.chain = chain;
  }
}

//const blockchain = new Blockchain();
//blockchain.addBlock({ data: "Block1" });
//blockchain.addBlock({ data: "Block2" });
//const result = Blockchain.isValidChain(blockchain.chain);
//console.log(result);
//console.log(blockchain.chain);

//console.log(blockchain);
//console.log(countNode);
module.exports = Blockchain;
