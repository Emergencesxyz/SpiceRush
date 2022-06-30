module.exports = {
  reactStrictMode: false,
  env: {
    AWS_ACCESS_KEY_: process.env.AWS_ACCESS_KEY_,
    SECRET_ACCESS_KEY_: process.env.SECRET_ACCESS_KEY_,

    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    POLYGON_URL: process.env.POLYGON_URL,
    MUMBAI_URL: process.env.MUMBAI_URL,
    RINKEBY_URL: process.env.RINKEBY_URL,
    KOVAN_URL: process.env.KOVAN_URL,
    RPC_URL: process.env.RPC_URL,
    WSS_URL: process.env.WSS_URL,

    APINATOR_CONTRACT_ADDRESS: process.env.APINATOR_CONTRACT_ADDRESS,
    GAMEPLAY_CONTRACT_ADDRESS: process.env.GAMEPLAY_CONTRACT_ADDRESS,
    TILES_CONTRACT_ADDRESS: process.env.TILES_CONTRACT_ADDRESS,
    SPICE_CONTRACT_ADDRESS: process.env.SPICE_CONTRACT_ADDRESS,

    DEFAULT_MAP_SIZE: process.env.DEFAULT_MAP_SIZE,
    DEFAULT_CHUNK_SIZE: process.env.DEFAULT_CHUNK_SIZE, //has to be odd for centering

    API_URL: process.env.API_URL,
  },
};
