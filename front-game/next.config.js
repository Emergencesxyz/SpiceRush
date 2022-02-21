/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    AWS_ACCESS_KEY_: process.env.AWS_ACCESS_KEY_,
    SECRET_ACCESS_KEY_: process.env.SECRET_ACCESS_KEY_,

    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    POLYGON_URL: process.env.POLYGON_URL,
    MUMBAI_URL: process.env.MUMBAI_URL,
    RINKEBY_URL: process.env.RINKEBY_URL,
    KOVAN_URL: process.env.KOVAN_URL,

    DEFAULT_MAP_SIZE: process.env.DEFAULT_MAP_SIZE,
    DEFAULT_CHUNK_SIZE: process.env.DEFAULT_CHUNK_SIZE, //has to be odd for centering

    API_URL: process.env.API_URL,
  },
};
