import consts from "../consts";
import Web3 from "web3";
import { BigNumber, utils } from "ethers";

var RPC_URL = process.env.RPC_URL;
var APINATOR_CONTRACT_ADDRESS = process.env.APINATOR_CONTRACT_ADDRESS;
var GAMEPLAY_CONTRACT_ADDRESS = process.env.GAMEPLAY_CONTRACT_ADDRESS;
var SPICE_CONTRACT_ADDRESS = process.env.SPICE_CONTRACT_ADDRESS;

export default class BlockchainService {
  account: any;
  web3: any;

  apinatorContract: any;
  gameplayContract: any;
  spiceContract: any;

  constructor(_account: any) {
    const provider = RPC_URL;
    this.web3 = new Web3(provider as string);
    this.account = _account;

    this.apinatorContract = new this.web3.eth.Contract(
      consts.apinatorABI as any,
      APINATOR_CONTRACT_ADDRESS,
    );

    this.gameplayContract = new this.web3.eth.Contract(
      consts.gameplayABI as any,
      GAMEPLAY_CONTRACT_ADDRESS,
    );

    this.spiceContract = new this.web3.eth.Contract(consts.spiceABI as any, SPICE_CONTRACT_ADDRESS);
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
        oreBalance: (+utils.formatEther(BigNumber.from(info.oreBalance))).toFixed(4),
        spiceBalance: +(+utils.formatEther(
          BigNumber.from(await this.spiceContract.methods.balanceOf(this.account).call()),
        )).toFixed(4),
      };
    } catch (e) {
      return null;
    }
  }

  async getRestPrice() {
    try {
      return +(+utils.formatEther(
        BigNumber.from(await this.gameplayContract.methods.restActionPrice().call()),
      )).toFixed(2);
    } catch (e) {
      return 1;
    }
  }

  async getLevelUpPrice() {
    try {
      return +(+utils.formatEther(
        BigNumber.from(await this.gameplayContract.methods.levelUpPrice().call()),
      )).toFixed(2);
    } catch (e) {
      return 1;
    }
  }

  async getAllCharacters() {
    try {
      const totalSupply = await this.apinatorContract.methods.totalSupply().call();

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

  async getRefineValues() {
    try {
      const values = {
        totalRewarded: +(+utils.formatEther(
          BigNumber.from(await this.gameplayContract.methods.totalRewarded().call()),
        )).toFixed(4),
        totalDeposit: +(+utils.formatEther(
          BigNumber.from(await this.gameplayContract.methods.totalDeposit().call()),
        )).toFixed(4),
        rewardBalancerNumerator: await this.gameplayContract.methods
          .rewardBalancerNumerator()
          .call(),
        rewardBalancerDivisor: await this.gameplayContract.methods.rewardBalancerDivisor().call(),
      };

      return values;
    } catch (e) {
      return {};
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
      const mapDictionary = await fetch("http://vps-5a1fae51.vps.ovh.net:3004/gamedata")
        .then((r) => r.json())
        .then((data) => data.map);

      for (let y = y0 + chunkSize; y > y0 - chunkSize; y--) {
        for (let x = x0 - chunkSize; x < x0 + chunkSize; x++) {
          if ((mapDictionary[x] || {})[y]) {
            tiles.push({
              foesAmount: parseInt(mapDictionary[x][y].foesAmount),
              isExplored: mapDictionary[x][y].isExplored,
              level: parseInt(mapDictionary[x][y].level),
              spiceAmount: (+utils.formatEther(
                BigNumber.from(mapDictionary[x][y].spiceAmount),
              )).toFixed(2),
              x: x,
              y: y,
              players: mapDictionary[x][y].players,
            });
          } else {
            tiles.push({
              foesAmount: 0,
              isExplored: false,
              level: 0,
              spiceAmount: 0,
              x: x,
              y: y,
              players: {},
            });
          }
        }
      }
      return tiles;
    } catch (e) {
      console.log("error", e);
      return null;
    }
  }

  async getPlayersInTile(playersInTile: string[]) {
    let players: any = [];
    try {
      const playersDictionary = await fetch("http://vps-5a1fae51.vps.ovh.net:3004/gamedata")
        .then((r) => r.json())
        .then((data) => data.charas);

      for (let p of playersInTile) {
        if (playersDictionary[p]) {
          players.push({
            ...playersDictionary[p],
            id: p,
            nextActionTime: BigNumber.from(playersDictionary[p].nextActionTime).toString(),
            oreBalance: (+utils.formatEther(
              BigNumber.from(playersDictionary[p].oreBalance),
            )).toFixed(4),
          });
        }
      }

      return players;
    } catch (e) {
      console.log("error", e);
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
      GAMEPLAY_CONTRACT_ADDRESS,
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
      GAMEPLAY_CONTRACT_ADDRESS,
    );

    await this.gameplayContract.methods
      .spawn(nftId)
      .send(txParams)
      .on("transactionHash", function (hash: any) {
        // const audioSuccess = new Audio("./sounds/success.mp3");
        // audioSuccess.play();
      });
  }

  // TODO: Option for custome amount
  async refine(nftId: number, amount: number, library: any) {
    const txParams = {
      from: this.account,
      value: "0",
    };

    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      GAMEPLAY_CONTRACT_ADDRESS,
    );

    const playerBalances = await this.gameplayContract.methods.charas(nftId).call();

    await this.gameplayContract.methods
      .refineOre(nftId, playerBalances.oreBalance)
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
        APINATOR_CONTRACT_ADDRESS,
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
    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      GAMEPLAY_CONTRACT_ADDRESS,
    );

    if (actionNb > 0) {
      const restPrice = await this.gameplayContract.methods.restActionPrice().call();
      const accountBalance = await this.spiceContract.methods.balanceOf(this.account).call();

      if (+accountBalance < +restPrice * actionNb) {
        return false;
      }
    }

    const txParams = {
      from: this.account,
      value: 0,
    };

    await this.gameplayContract.methods
      .rest(nftId, actionNb)
      .send(txParams)
      .on("transactionHash", function (hash: any) {
        // const audioSuccess = new Audio("./sounds/success.mp3");
        // audioSuccess.play();
      });
  }

  async approvedSpice(library: any) {
    const txParams = {
      from: this.account,
      value: "0",
    };

    this.spiceContract = new library.eth.Contract(consts.spiceABI as any, SPICE_CONTRACT_ADDRESS);

    try {
      const isAlreadyApproved = await this.spiceContract.methods
        .allowance(this.account, GAMEPLAY_CONTRACT_ADDRESS)
        .call();

      if (isAlreadyApproved > 0) return true;

      await this.spiceContract.methods
        .approve(GAMEPLAY_CONTRACT_ADDRESS, "1000000000000000000000000000")
        .send(txParams)
        .on("transactionHash", function (hash: any) {
          // const audioSuccess = new Audio("./sounds/success.mp3");
          // audioSuccess.play();
        });
      return true;
    } catch (e) {
      return false;
    }
  }

  async mine(nftId: number, actionNb: number, library: any) {
    const txParams = {
      from: this.account,
      value: "0",
    };

    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      GAMEPLAY_CONTRACT_ADDRESS,
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
    this.gameplayContract = new library.eth.Contract(
      consts.gameplayABI as any,
      GAMEPLAY_CONTRACT_ADDRESS,
    );

    const lvlUpPrice = await this.gameplayContract.methods.levelUpPrice().call();

    const txParams = {
      from: this.account,
      value: "0",
    };

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
