const Blockchain = require("./blockchain");
const blockchain = new Blockchain();

blockchain.addBlock({ data: "new data}" }); // so that avg can reduce
let prevTimestamp, nextTimestamp, nextBlock, timeDiff, averageTime;

const times = []; //array

for (let i = 0; i < 1000; i++) {
  prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
  blockchain.addBlock({ data: `block${i}` });
  nextBlock = blockchain.chain[blockchain.chain.length - 1];
  nextTimestamp = nextBlock.timestamp; // current formed block timestamp

  timeDiff = nextTimestamp - prevTimestamp;
  times.push(timeDiff); // we are doing this so that we can calculate average
  const avg = times.reduce((total, num) => total + num, 0); // reduce function is calculate whole sum in times array
  averageTime = avg / times.length || 0;
  console.log(
    `Time to mine block : ${timeDiff}ms,Difficulty:${nextBlock.difficulty}, Average time : ${averageTime}ms`
  );
}
