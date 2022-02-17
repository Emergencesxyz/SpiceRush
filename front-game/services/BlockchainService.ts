import consts from "../consts";
import Web3 from "web3";

export default class BlockchainService {
  account: any;
  web3: any;

  apinatorContract: any;
  gameplayContract: any;
  constructor(_account: any) {
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

  async getCharacterInfo(nftId: number) {
    try {
      const info = await this.gameplayContract.methods.charas(nftId).call();
      return {
        lvl: info.lvl,
        nextActionTime: info.nextActionTime,
        stats: {
          energy: parseInt(info.stats.energy),
          energyMax: parseInt(info.stats.energyMax),
          hp: parseInt(info.stats.hp),
          hpMax: parseInt(info.stats.p),
          mining: parseInt(info.stats.mining),
          miningMax: parseInt(info.stats.miningMax),
        },
        x: parseInt(info.x),
        y: parseInt(info.y),
        xp: info.xp,
      };
    } catch (e) {
      return null;
    }
  }

  async getMapChunk(x0: number, y0: number, chunkSize: number) {
    let tiles: any = [];
    try {
      for (let x = 0; x < chunkSize; x++) {
        let row = [];
        for (let y = 0; y < chunkSize; y++) {
          const _tile = await this.gameplayContract.methods.map(x, y).call();

          row.push({
            foesAmount: _tile.foesAmount,
            isExplored: _tile.isExplored,
            level: _tile.level,
            spiceAmount: _tile.spiceAmount,
            x: x,
            y: y,
          });
        }
        tiles.push(row);
      }
      return tiles;
    } catch (e) {
      return null;
    }
  }

  async moveCharacter(x: number, y: number, library: any) {
    const txParams = {
      from: this.account,
      value: "0",
    };

    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      consts.gameplayAddress
    );

    await this.gameplayContract.methods
      .move("0", x, y)
      .send(txParams)
      .on("transactionHash", function (hash: any) {
        let audio = new Audio("./sounds/success.mp3");
        audio.play();
      });
  }

  async spawn(nftId: number, library: any) {
    const txParams = {
      from: this.account,
      value: "0",
    };

    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      consts.gameplayAddress
    );

    await this.gameplayContract.methods
      .spawn(nftId)
      .send(txParams)
      .on("transactionHash", function (hash: any) {
        let audio = new Audio("./sounds/success.mp3");
        audio.play();
      });
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
