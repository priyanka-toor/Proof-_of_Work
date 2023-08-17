const hexToBinary = require("hex-to-binary");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");
class Block {
  constructor({ timestamp, prevHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
  static genesis() {
    return new this(GENESIS_DATA);
  }
  static mineBlock({ prevBlock, data }) {
    //const timestamp = Date.now();
    let hash, timestamp;
    const prevHash = prevBlock.hash;
    //const { difficulty } = prevBlock;
    let { difficulty } = prevBlock;
    let nonce = 0;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: prevBlock,
        timestamp,
      });
      hash = cryptoHash(timestamp, prevHash, data, nonce, difficulty);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    ); // it means that we have difficulty =2 so that till t he first to letter of hash become 0 till that loop run
    // For eg: hash : abcdef and difficulty = 2 so that we have to achieve that hash : 00cdef

    // if difficulty increases that no. of 0's increases and due to area become decreasing and due to this probability of finding hash decreases
    return new this({
      timestamp,
      prevHash,
      data,
      hash,
      difficulty,
      nonce,
    });
  }

  //  **** Adjust difficulty according to time ****
  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    if (difficulty < 1) return 1;
    const difference = timestamp - originalBlock.timestamp;
    if (difference > MINE_RATE) {
      return difficulty - 1;
    }
    return difficulty + 1;
  }
}

const block1 = new Block({
  hash: "0xacb",
  timestamp: "2/09/22",
  prevHash: "0xc12",
  data: "hello",
});

//console.log(block1);
// const block2 = new Block("3/09/22", "0xac12", "123", "world");
// console.log(block2);

/*const genesisBlock = Block.genesis();
console.log(genesisBlock);

const result = Block.mineBlock({ prevBlock: block1, data: "block2" });
console.log(result);*/

module.exports = Block;
