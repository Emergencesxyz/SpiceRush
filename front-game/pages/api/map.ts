// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import DatabaseService from "../../services/DatabaseService";
import BlockchainService from "../../services/BlockchainService";
import { ethers } from "ethers";

import consts from "../../consts";
import { TileType } from "../../types";

const WSS_URL = process.env.WSS_URL;
const DEFAULT_MAP_SIZE = parseInt(process.env.DEFAULT_MAP_SIZE as string);
const DEFAULT_CHUNK_SIZE = parseInt(process.env.DEFAULT_CHUNK_SIZE as string);
const GAMEPLAY_CONTRACT_ADDRESS = process.env.GAMEPLAY_CONTRACT_ADDRESS;

type Data = {
  result: Array<TileType> | string | any;
};

const databaseService = new DatabaseService();
const blockchainService = new BlockchainService(null);

//listener
const provider = new ethers.providers.WebSocketProvider(WSS_URL as string);

const gameplayContract = new ethers.Contract(
  GAMEPLAY_CONTRACT_ADDRESS as string,
  consts.gameplayABI,
  provider
);

//
let cachedMap: any = null;
let events: any = [];

// gameplayContract.on(
//   "moving",
//   async (tokenId, x, y, energy, xp, nextActionTime) => {
//     const x_int = parseInt(x.toString());
//     const y_int = parseInt(y.toString());

//     console.log("[API] moving", tokenId, x_int, y_int);
//     //log events
//     //events.push({ type: "moving", tokenId: tokenId, x: x_int, y: y_int });

//     //update cachedmap

//     if (!cachedMap) return;

//     let tile = cachedMap.filter(
//       (tile: any) => tile.x === x_int && tile.y === y_int
//     )[0];

//     if (tile) {
//       let newTile = (await blockchainService.getMapChunk(x_int, y_int, 0))[0];
//       cachedMap[cachedMap.indexOf(tile)] = newTile;
//     }
//   }
// );

const x0 = 0 - Math.floor(DEFAULT_MAP_SIZE / 2);
const y0 = 0 - Math.floor(DEFAULT_MAP_SIZE / 2);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //get params

  if (req.method === "GET") {
    const y = req.query.y ? parseInt(req.query.y as string) : 0;
    const x = req.query.x ? parseInt(req.query.x as string) : 0;
    const range = req.query.range
      ? parseInt(req.query.range as string)
      : DEFAULT_MAP_SIZE;

    console.log("isCached", cachedMap !== null);
    if (!cachedMap) {
      console.log("- putting map in cache");
      //cachedMap = await databaseService.getMapChunk(x, y, DEFAULT_MAP_SIZE);
      //we do not actually need DB for this
      cachedMap = await blockchainService.getMapChunk(x0, y0, DEFAULT_MAP_SIZE);
      console.log("- map cached!");
    }

    //or just a chunk from that whole map

    let chunk: any = cachedMap.filter(
      (tile: any) =>
        tile.y >= y - Math.floor(range / 2) &&
        tile.y < y + Math.ceil(range / 2) &&
        tile.x >= x - Math.floor(range / 2) &&
        tile.x < x + Math.ceil(range / 2)
    );

    return res.status(200).send({ result: chunk });
  } else if (req.method === "POST") {
    //UPDATE MAP
    console.log("POST");
    // Handle any other HTTP method
    //console.log(req.body);
    const y = parseInt(req.body.y as string);
    const x = parseInt(req.body.x as string);
    const tokenId = parseInt(req.body.tokenId as string);

    console.log("isCached", cachedMap !== null);
    if (!cachedMap) {
      console.log("- putting map in cache");
      cachedMap = await blockchainService.getMapChunk(x, y, DEFAULT_MAP_SIZE);
      console.log("- map cached!");
    } else {
      //we just update the specific tile
      //console.log("oldTile", cachedMap[x][y]);
      let newTile = await blockchainService.getMapChunk(x, y, 0);
      // console.log("newTile", newTile);
      //update cache
    }

    return res.status(200).send({ result: "method post" });
  } else {
    return res.status(200).send({ result: "method not handled" });
  }
}

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
