// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//zbi
import type { NextApiRequest, NextApiResponse } from "next";
import DatabaseService from "../../services/DatabaseService";
import BlockchainService from "../../services/BlockchainService";
import { ethers } from "ethers";
import consts from "../../consts";

const WSS_URL = process.env.WSS_URL;
const DEFAULT_MAP_SIZE = parseInt(process.env.DEFAULT_MAP_SIZE as string);
const DEFAULT_CHUNK_SIZE = parseInt(process.env.DEFAULT_CHUNK_SIZE as string);
const GAMEPLAY_CONTRACT_ADDRESS = process.env.GAMEPLAY_CONTRACT_ADDRESS;

type Data = {
  result: string;
};

const databaseService = new DatabaseService();
const blockchainService = new BlockchainService(null);

let cachedCharacters: any = null;

//listener
const provider = new ethers.providers.WebSocketProvider(WSS_URL as string);

const gameplayContract = new ethers.Contract(
  GAMEPLAY_CONTRACT_ADDRESS as string,
  consts.gameplayABI,
  provider
);

// gameplayContract.on(
//   "moving",
//   async (_tokenId, x, y, energy, xp, nextActionTime) => {
//     const x_int = parseInt(x.toString());
//     const y_int = parseInt(y.toString());
//     const tokenId = parseInt(_tokenId.toString());

//     console.log("[API] moving", tokenId, x_int, y_int);

//     //update all characters
//     cachedCharacters = await blockchainService.getAllCharacters();

//     //update just 1 character
//     // let new_character = await blockchainService.getCharacterInfo(tokenId);

//     // let old_character = cachedCharacters.filter(
//     //   (c: any) => c.id === tokenId
//     // )[0];

//     // if (old_character)
//     //   cachedCharacters[cachedCharacters.indexOf(old_character)] = new_character;
//   }
// );

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const id = parseInt(req.query.id as string);
    console.log("/character id=", id);
    console.log("isCached", cachedCharacters !== null);

    let result: any = [];
    if (!cachedCharacters) {
      console.log("- putting characters in cache");
      cachedCharacters = await blockchainService.getAllCharacters();
      console.log("- characters cached!");
    }
    result = cachedCharacters;

    //filter
    if (Number.isInteger(id)) {
      result = result.filter((c: any, i: number) => i === id)[0];
    }

    return res.status(200).json({ result: result });
  } catch (e: any) {
    return res.status(400).json({ result: e.toString() });
  }
}
