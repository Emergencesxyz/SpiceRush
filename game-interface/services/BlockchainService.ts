import consts from "../consts";
import Web3 from "web3";

var RPC_URL = process.env.RPC_URL;
var APINATOR_CONTRACT_ADDRESS = process.env.APINATOR_CONTRACT_ADDRESS;
var GAMEPLAY_CONTRACT_ADDRESS = process.env.GAMEPLAY_CONTRACT_ADDRESS;

export default class BlockchainService {
  account: any;
  web3: any;

  apinatorContract: any;
  gameplayContract: any;

  constructor(_account: any) {
    const provider = RPC_URL;
    this.web3 = new Web3(provider as string);
    this.account = _account;

    this.apinatorContract = new this.web3.eth.Contract(
      consts.apinatorABI as any,
      APINATOR_CONTRACT_ADDRESS
    );

    this.gameplayContract = new this.web3.eth.Contract(
      consts.gameplayABI as any,
      GAMEPLAY_CONTRACT_ADDRESS
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

  async nftPrice() {
    try {
      return await this.apinatorContract.methods.NFTPrice().call();
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

  async canLevelUp(nftId: number | null) {
    try {
      let charas = await this.gameplayContract.methods.charas(nftId).call();

      const xp = parseInt(charas.xp);
      const lvl = parseInt(charas.lvl);

      return 100 * (lvl ** 2 + lvl) + 100 < xp;
    } catch (e) {
      return false;
    }
  }

  async mintExceedsMax(nftId: number | null) {
    try {
      const userBalance = await this.gameplayContract.methods.charas(nftId).call();
      const maxPerUser = await this.gameplayContract.methods.charas(nftId).call();

      return userBalance <= maxPerUser;
    } catch (e) {
      return false;
    }
  }

  async getSpiceMined(nftId: number | null) {
    try {
      return parseInt(await this.gameplayContract.methods.bank(nftId).call());
    } catch (e) {
      return null;
    }
  }
  async getCharacterInfo(nftId: number) {
    try {
      let info = await this.gameplayContract.methods.charas(nftId).call();
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
        id: nftId,
        spiceMined: await this.getSpiceMined(nftId),
      };
    } catch (e) {
      return null;
    }
  }

  async getAllCharacters() {
    try {
      const totalSupply = await this.apinatorContract.methods
        .totalSupply()
        .call();

      let characters = [];
      for (let i = 0; i < parseInt(totalSupply); i++) {
        let info: any = await this.getCharacterInfo(i);
        characters.push(info);
      }
      characters.sort((a: any, b: any) => b.spiceMined - a.spiceMined);
      return characters;
    } catch (e) {
      return null;
    }
  }

  async getMapChunk(x0: number, y0: number, chunkSize: number) {
    let tiles: any = [];
    try {
      if (chunkSize === 0) {
        let _tile = await this.gameplayContract.methods.map(x0, y0).call();

        return [
          {
            foesAmount: parseInt(_tile.foesAmount),
            isExplored: _tile.isExplored,
            level: parseInt(_tile.level),
            spiceAmount: parseInt(_tile.spiceAmount),
            x: x0,
            y: y0,
          },
        ];
      }

      for (let x = x0; x <= x0 + chunkSize; x++) {
        for (let y = y0; y <= y0 + chunkSize; y++) {
          const _tile = await this.gameplayContract.methods.map(x, y).call();

          tiles.push({
            foesAmount: parseInt(_tile.foesAmount),
            isExplored: _tile.isExplored,
            level: parseInt(_tile.level),
            spiceAmount: parseInt(_tile.spiceAmount),
            x: x,
            y: y,
          });
        }
      }
      return tiles;
    } catch (e) {
      return null;
    }
  }

  async getMapPlayer(x0: number, y0: number, chunkSize: number) {
    let tiles: any = [];
    try {
      // TODO: Get Map dictionary from contract
      const mapDictionary = {
        '0': {
          '0': { isExplored: true, level: 11, spiceAmount: 900, foesAmount: 4 }
        },
        '1': {
          '1': { isExplored: true, level: 11, spiceAmount: 1500, foesAmount: 10 }
        },
        '2': {
          '2': { isExplored: true, level: 9, spiceAmount: 1000, foesAmount: 7 }
        },
        '3': {
          '3': { isExplored: true, level: 3, spiceAmount: 0, foesAmount: 0 }
        },
        '4': {
          '4': { isExplored: true, level: 2, spiceAmount: 100, foesAmount: 0 }
        },
        '5': {
          '5': { isExplored: true, level: 6, spiceAmount: 800, foesAmount: 2 }
        },
        '6': {
          '6': { isExplored: true, level: 9, spiceAmount: 800, foesAmount: 4 }
        },
        '7': {
          '7': { isExplored: true, level: 0, spiceAmount: 0, foesAmount: 0 }
        },
        '8': {
          '8': { isExplored: true, level: 2, spiceAmount: 600, foesAmount: 1 }
        },
        '9': {
          '9': { isExplored: true, level: 6, spiceAmount: 800, foesAmount: 9 }
        },
        '10': {
          '10': { isExplored: true, level: 6, spiceAmount: 600, foesAmount: 15 }
        },
        '11': {
          '11': { isExplored: true, level: 2, spiceAmount: 200, foesAmount: 6 }
        },
        '12': {
          '12': { isExplored: true, level: 0, spiceAmount: 0, foesAmount: 0 }
        },
        '13': {
          '13': { isExplored: true, level: 6, spiceAmount: 600, foesAmount: 5 }
        },
        '14': {
          '14': { isExplored: true, level: 8, spiceAmount: 800, foesAmount: 6 }
        },
        '15': {
          '15': { isExplored: true, level: 5, spiceAmount: 400, foesAmount: 6 }
        },
        '16': {
          '16': { isExplored: true, level: 2, spiceAmount: 100, foesAmount: 0 }
        },
        '17': {
          '17': { isExplored: true, level: 0, spiceAmount: 0, foesAmount: 0 }
        },
        '18': {
          '18': { isExplored: true, level: 7, spiceAmount: 600, foesAmount: 6 }
        },
        '19': {
          '19': { isExplored: true, level: 7, spiceAmount: 600, foesAmount: 0 }
        },
        '20': {
          '20': { isExplored: true, level: 15, spiceAmount: 1600, foesAmount: 12 }
        },
        '21': {
          '21': { isExplored: true, level: 18, spiceAmount: 2200, foesAmount: 16 }
        },
        '22': {
          '22': { isExplored: true, level: 19, spiceAmount: 2300, foesAmount: 19 }
        },
        '23': {
          '23': { isExplored: true, level: 11, spiceAmount: 1100, foesAmount: 15 }
        },
        '24': {
          '24': { isExplored: true, level: 17, spiceAmount: 1400, foesAmount: 20 }
        },
        '25': {
          '25': { isExplored: true, level: 12, spiceAmount: 1600, foesAmount: 13 }
        },
        '26': {
          '26': { isExplored: true, level: 21, spiceAmount: 1400, foesAmount: 13 }
        },
        '27': {
          '27': { isExplored: true, level: 28, spiceAmount: 3000, foesAmount: 29 }
        },
        '28': {
          '28': { isExplored: true, level: 27, spiceAmount: 2400, foesAmount: 22 }
        },
        '29': {
          '29': { isExplored: true, level: 28, spiceAmount: 2900, foesAmount: 35 }
        },
        '30': {
          '30': { isExplored: true, level: 35, spiceAmount: 3000, foesAmount: 37 }
        },
        '31': {
          '31': { isExplored: true, level: 27, spiceAmount: 3400, foesAmount: 33 }
        },
        '32': {
          '32': { isExplored: true, level: 27, spiceAmount: 3000, foesAmount: 28 }
        },
        '33': {
          '33': { isExplored: true, level: 30, spiceAmount: 2900, foesAmount: 33 }
        },
        '34': {
          '34': { isExplored: true, level: 30, spiceAmount: 2500, foesAmount: 30 }
        },
        '35': {
          '35': { isExplored: true, level: 34, spiceAmount: 3000, foesAmount: 33 }
        },
        '36': {
          '36': { isExplored: true, level: 32, spiceAmount: 2900, foesAmount: 34 }
        },
        '37': {
          '37': { isExplored: true, level: 34, spiceAmount: 3400, foesAmount: 37 }
        },
        '38': {
          '38': { isExplored: true, level: 32, spiceAmount: 3400, foesAmount: 26 }
        },
        '39': {
          '39': { isExplored: true, level: 30, spiceAmount: 3000, foesAmount: 32 }
        },
        '-1': {
          '-1': { isExplored: true, level: 20, spiceAmount: 2100, foesAmount: 22 }
        },
        '-2': {
          '-2': { isExplored: true, level: 13, spiceAmount: 1400, foesAmount: 14 }
        },
        '-3': {
          '-3': { isExplored: true, level: 20, spiceAmount: 1500, foesAmount: 18 }
        },
        '-4': {
          '-4': { isExplored: true, level: 8, spiceAmount: 1200, foesAmount: 9 }
        },
        '-5': {
          '-5': { isExplored: true, level: 22, spiceAmount: 2100, foesAmount: 28 }
        },
        '-6': {
          '-6': { isExplored: true, level: 28, spiceAmount: 2500, foesAmount: 24 }
        },
        '-7': {
          '-7': { isExplored: true, level: 42, spiceAmount: 4200, foesAmount: 36 }
        },
        '-8': {
          '-8': { isExplored: true, level: 43, spiceAmount: 3700, foesAmount: 40 }
        },
        '-9': {
          '-9': { isExplored: true, level: 49, spiceAmount: 5200, foesAmount: 46 }
        },
        '-10': {
          '-10': { isExplored: true, level: 55, spiceAmount: 4900, foesAmount: 52 }
        },
        '-11': {
          '-11': { isExplored: true, level: 53, spiceAmount: 5400, foesAmount: 48 }
        },
        '-12': {
          '-12': { isExplored: true, level: 57, spiceAmount: 6400, foesAmount: 56 }
        }
      }

      for (let y = y0 + chunkSize; y > y0 - chunkSize; y--) {
        for (let x = x0 - chunkSize; x < x0 + chunkSize; x++) {
          // const _tile = await this.gameplayContract.methods.map(x, y).call();
          if(mapDictionary[x][y]) {
            tiles.push({
              foesAmount: parseInt(mapDictionary[x][y].foesAmount),
              isExplored: mapDictionary[x][y].isExplored,
              level: parseInt(mapDictionary[x][y].level),
              spiceAmount: parseInt(mapDictionary[x][y].spiceAmount),
              x: x,
              y: y,
            });
          } else {
            tiles.push({
              foesAmount: 0,
              isExplored: false,
              level: 0,
              spiceAmount: 0,
              x: x,
              y: y,
            });
          }
        }
      }
      return tiles;
    } catch (e) {
      return null;
    }
  }

  async getMapChunkRect(x0: number, y0: number, x1: number, y1: number) {
    let tiles = [];
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        const _tile = await this.gameplayContract.methods.map(x, y).call();

        tiles.push({
          foesAmount: parseInt(_tile.foesAmount),
          isExplored: _tile.isExplored,
          level: parseInt(_tile.level),
          spiceAmount: parseInt(_tile.spiceAmount),
          x: x,
          y: y,
        });
      }
    }
  }

  async moveCharacter(nftId: number, x: number, y: number, library: any) {
    const txParams = {
      from: this.account,
      value: "0",
    };

    let succes = false;

    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      GAMEPLAY_CONTRACT_ADDRESS
    );

    await this.gameplayContract.methods
      .move(nftId, x, y)
      .send(txParams)
      .on("transactionHash", function (hash: any) {
        // const audioSuccess = new Audio("./sounds/success.mp3");
        // audioSuccess.play();
        succes = true;
      });

    return succes;
  }

  async spawn(nftId: number, library: any) {
    const txParams = {
      from: this.account,
      value: "0",
    };

    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      GAMEPLAY_CONTRACT_ADDRESS
    );

    await this.gameplayContract.methods
      .spawn(nftId)
      .send(txParams)
      .on("transactionHash", function (hash: any) {
        // const audioSuccess = new Audio("./sounds/success.mp3");
        // audioSuccess.play();
      });
  }

  async mintNft(amount: number, library: any) {
    try {
      const txParams = {
        from: this.account,
        value: consts.nftPrice,
      };

      this.apinatorContract = new library.eth.Contract(
        consts.apinatorABI as any,
        APINATOR_CONTRACT_ADDRESS
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
      GAMEPLAY_CONTRACT_ADDRESS
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
      GAMEPLAY_CONTRACT_ADDRESS
    );

    await this.gameplayContract.methods
      .mine(nftId, actionNb)
      .send(txParams)
      .on("transactionHash", function (hash: any) {
        // const audioCoins = new Audio("./sounds/coins.mp3");
        // audioCoins.play();
      });
  }

  async levelUp(tokenId: number, statId: number, library: any) {
    const txParams = {
      from: this.account,
      value: "0",
    };

    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      GAMEPLAY_CONTRACT_ADDRESS
    );

    await this.gameplayContract.methods
      .levelUp(tokenId, statId)
      .send(txParams)
      .on("transactionHash", function (hash: any) {
        // const audioCoins = new Audio("./sounds/coins.mp3");
        // audioCoins.play();
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
