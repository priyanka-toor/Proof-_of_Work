// to generate hash through sha-256

const crypto = require("crypto");
const hexToBinary = require("hex-to-binary");
const cryptoHash = (...inputs) => {
  //...inputs through this we can accept arguments (jo piche se arre hai)
  const hash = crypto.createHash("sha256");
  hash.update(inputs.sort().join("")); // concatinate the whole inputs and generate a single hash
  // for eg: we give hello , world as inputs and after that it concatinate and become helloworld
  // return hexToBinary(hash.digest("hex"));
  return hash.digest("hex");
};

result = cryptoHash("hello", "world");
module.exports = cryptoHash;
//console.log(result);
