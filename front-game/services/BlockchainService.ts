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

  async totalSupply() {
    try {
      return await this.apinatorContract.methods.totalSupply().call();
    } catch (e) {
      return null;
    }
  }

  async ownerOf(nftId: number) {
    try {
      return await this.apinatorContract.methods.ownerOf(nftId).call();
    } catch (e) {
      return null;
    }
  }

  async getSpiceMined(nftId: number | null) {
    try {
      return await this.gameplayContract.methods.bank(nftId).call();
    } catch (e) {
      return null;
    }
  }
  async getCharacterInfo(nftId: number) {
    try {
      const info = await this.gameplayContract.methods.charas(nftId).call();
      return {
        lvl: parseInt(info.lvl),
        nextActionTime: parseInt(info.nextActionTime),
        stats: {
          energy: parseInt(info.stats.energy),
          energyMax: parseInt(info.stats.energyMax),
          hp: parseInt(info.stats.hp),
          hpMax: parseInt(info.stats.hpMax),
          mining: parseInt(info.stats.mining),
          miningMax: parseInt(info.stats.miningMax),
        },
        x: parseInt(info.x),
        y: parseInt(info.y),
        xp: parseInt(info.xp),
      };
    } catch (e) {
      return null;
    }
  }

  async getMapChunk(x0: number, y0: number, chunkSize: number) {
    let tiles: any = [];
    try {
      for (
        let x = x0 - Math.floor(chunkSize / 2);
        x <= Math.ceil(chunkSize / 2) + x0;
        x++
      ) {
        let row = [];
        for (
          let y = y0 - Math.floor(chunkSize / 2);
          y <= Math.ceil(chunkSize / 2) + y0;
          y++
        ) {
          const _tile = await this.gameplayContract.methods.map(x, y).call();

          row.push({
            foesAmount: parseInt(_tile.foesAmount),
            isExplored: _tile.isExplored,
            level: parseInt(_tile.level),
            spiceAmount: parseInt(_tile.spiceAmount),
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

  async moveCharacter(nftId: number, x: number, y: number, library: any) {
    const txParams = {
      from: this.account,
      value: "0",
    };

    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      consts.gameplayAddress
    );

    await this.gameplayContract.methods
      .move(nftId, x, y)
      .send(txParams)
      .on("transactionHash", function (hash: any) {
        const audioSuccess = new Audio("./sounds/success.mp3");
        audioSuccess.play();
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
        const audioSuccess = new Audio("./sounds/success.mp3");
        audioSuccess.play();
      });
  }

  async mintNft(amount: number, library: any) {
    console.log("mintNft", library);
    try {
      const txParams = {
        from: this.account,
        value: consts.nftPrice,
      };

      this.apinatorContract = new library.eth.Contract(
        consts.apinatorABI as any,
        consts.apinatorAddress
      );

      await this.apinatorContract.methods
        .mintNFT(amount)
        .send(txParams)
        .on("transactionHash", function (hash: any) {});
    } catch (e: any) {
      console.log("[ERROR] mintNft", e.toString());
    }
  }

  async rest(nftId: number, actionNb: number, library: any) {
    const txParams = {
      from: this.account,
      value: "0",
    };

    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      consts.gameplayAddress
    );

    await this.gameplayContract.methods
      .rest(nftId, actionNb)
      .send(txParams)
      .on("transactionHash", function (hash: any) {
        const audioSuccess = new Audio("./sounds/success.mp3");
        audioSuccess.play();
      });
  }

  async mine(nftId: number, actionNb: number, library: any) {
    const txParams = {
      from: this.account,
      value: "0",
    };
    console.log("mine", nftId);
    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      consts.gameplayAddress
    );

    await this.gameplayContract.methods
      .mine(nftId, actionNb)
      .send(txParams)
      .on("transactionHash", function (hash: any) {
        const audioCoins = new Audio("./sounds/coins.mp3");
        audioCoins.play();
      });
  }

  async levelUp(tokenId: number, statId: number, library: any) {
    const txParams = {
      from: this.account,
      value: "0",
    };

    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      consts.gameplayAddress
    );

    await this.gameplayContract.methods
      .levelUp(tokenId, statId)
      .send(txParams)
      .on("transactionHash", function (hash: any) {
        const audioCoins = new Audio("./sounds/coins.mp3");
        audioCoins.play();
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
