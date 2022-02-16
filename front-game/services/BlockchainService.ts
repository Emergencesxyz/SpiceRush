import consts from "../consts";
import Web3 from "web3";

export default class BlockchainService {
  account: any;
  web3: any;
  apinatorContract: any;
  gameplayContract: any;
  constructor(_account: any, _gamingContractAddress: any) {
    const provider = consts.rinkeby_url;
    this.web3 = new Web3(provider);
    this.account = _account;

    this.apinatorContract = new this.web3.eth.Contract(
      consts.apinatorABI as any,
      consts.apinatorAddress
    );

    this.gameplayContract = new this.web3.eth.Contract(
      consts.gameplayABI as any,
      consts.gameplayAddress
    );
  }

  async getBalance() {
    if (this.account) return await this.web3.eth.getBalance(this.account);
    else return null;
  }

  async ownerOf() {
    try {
      return await this.apinatorContract.methods.ownerOf("1").call();
    } catch (e) {
      return null;
    }
  }

  async getCurrentCoords(nftId: number) {}

  async getCharacterCoords(nftId: number) {
    try {
      return await this.gameplayContract.methods.charas(nftId).call();
    } catch (e) {
      return null;
    }
  }
  //   async test() {

  //     // Use vue-resource or any other http library to send your request
  //     return await axios
  //     .get('https://api.coindesk.com/v1/bpi/currentprice.json')
  //     .then((response)=>{
  //         return response.data
  //     })
  //   }
}
