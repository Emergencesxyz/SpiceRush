import consts from "../consts";
import Web3 from "web3";
import { Tty } from "@mui/icons-material";

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

    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      GAMEPLAY_CONTRACT_ADDRESS
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
      GAMEPLAY_CONTRACT_ADDRESS
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
      GAMEPLAY_CONTRACT_ADDRESS
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
