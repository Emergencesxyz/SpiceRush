// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import DatabaseService from "../../services/DatabaseService";
import BlockchainService from "../../services/BlockchainService";
import consts from "../../consts";
type Data = {
  result: string;
};

const databaseService = new DatabaseService();
const blockchainService = new BlockchainService(null); //no account needed, we will only perform readonly here

const { DEFAULT_MAP_SIZE, DEFAULT_CHUNK_SIZE } = process.env;

console.log("DEFAULT_MAP_SIZE", DEFAULT_MAP_SIZE);
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    // Process a POST request

    let tiles = await blockchainService.getMapChunk(0, 0, DEFAULT_MAP_SIZE);

    for (let x = 0; x < tiles.length; x++) {
      for (let y = 0; y < tiles[x].length; y++) {
        const tile: any = tiles[x][y];
        console.log("tile", tile);
        const params: any = {
          TableName: "MapTiles",
          Item: {
            coords: x + ";" + y,
            spiceAmount: tile.spiceAmount,
            foesAmount: tile.foesAmount,
            isExplored: tile.isExplored,
            level: tile.level,
            x: tile.x,
            y: tile.y,
          },
        };

        await databaseService.dynamo.put(params).promise();
      }
    }
    return res
      .status(200)
      .send({ result: tiles.length ** 2 + " tiles loaded" });
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
