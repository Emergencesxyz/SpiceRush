const ethers = require("ethers");
const axios = require("axios");
const AWS = require("aws-sdk");
require("dotenv").config();

const consts = require("./consts.js");

const {
  AWS_ACCESS_KEY_,
  SECRET_ACCESS_KEY_,
  API_URL,
  RPC_URL,
  WSS_URL,
  GAMEPLAY_CONTRACT_ADDRESS,
  APINATOR_CONTRACT_ADDRESS,
} = process.env;

const provider = new ethers.providers.WebSocketProvider(WSS_URL);

const gameplayContract = new ethers.Contract(
  GAMEPLAY_CONTRACT_ADDRESS,
  consts.gameplayABI,
  provider
);

(async function main() {
  //let characters_ = (await axios.get(API_URL + `/character`)).data.result;

  console.log("gameplay", await gameplayContract.apinator());
})();

gameplayContract.on(
  "moving",
  (tokenId, _x, _y, _energy, _xp, _nextActionTime) => {
    console.log("[EVENT] moving");
    console.log("tokenId", tokenId);
    console.log("(x,y) ", _x, _y);

    axios
      .post(API_URL + `/map`, {
        x: _x.toString(),
        y: _y.toString(),
        tokenId: tokenId.toString(),
      })
      .then((result) => {})
      .catch((e) => {
        console.log("[ERROR] Axios:", e.toString());
      });
  }
);
// filterGameplay = {
//   address: GAMEPLAY_CONTRACT_ADDRESS,
//   topics: [ethers.utils.id("moving(uint256,Chara)")],
// };

// provider.on(filterGameplay, (e, log) => {
//   // do whatever you want here
//   // I'm pretty sure this returns a promise, so don't forget to resolve it
//   console.log("new Gameplay event!\n", e);
// });
