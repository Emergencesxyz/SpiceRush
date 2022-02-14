export default class BlockchainService {
  account: any = "test";
  gamingContract: string;
  web3: any;
  constructor(
    _web3: any,
    _account: any,
    _gamingContractAddress: any,
    _gamingContractABI: any
  ) {
    this.web3 = _web3;
    this.account = _account;
    // this.gamingContract = new this.web3.eth.Contract(
    //   _gamingContractABI as any,
    //   _gamingContractAddress
    // );
  }

  async getBalance() {
    console.log("getBalance", this.account);
    if (this.account) return await this.web3.eth.getBalance(this.account);
    else return "0";
  }
  getTileInfo() {
    let randLevel = Math.ceil(4 * Math.random());
    return { level: randLevel };
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
