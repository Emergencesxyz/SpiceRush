const ethers = require("ethers");
const axios = require("axios");
const AWS = require("aws-sdk");
require("dotenv").config();

const { AWS_ACCESS_KEY_, SECRET_ACCESS_KEY_, API_URL, RPC_URL } = process.env;

const provider = new ethers.providers.WebSocketProvider(RPC_URL)(
  async function main() {
    console.log("API_URL", API_URL);
    let characters_ = (await axios.get(API_URL + `/character`)).data.result;

    console.log("characters_", characters_);
  }
)();

provider.on("block", async (msg) => {
  console.log(msg);
});
