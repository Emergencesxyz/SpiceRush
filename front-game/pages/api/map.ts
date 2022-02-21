// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import DatabaseService from "../../services/DatabaseService";

type Data = {
  result: string;
};

const databaseService = new DatabaseService();

let cachedMap: any = null;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //get params

  const y = parseInt(req.query.y as string);
  const x = parseInt(req.query.x as string);
  const range = parseInt(req.query.range as string);

  console.log("params", x, y, range);
  if (req.method === "GET") {
    console.log("isCached", cachedMap !== null);
    if (!cachedMap) cachedMap = await databaseService.getMapChunk(x, y, 9);

    let chunk: any = [];
    for (let i = 0; i < cachedMap.length; i++) {
      let row = [];
      for (let j = 0; j < cachedMap[i].length; j++) {
        let tile: any = cachedMap[i][j];

        if (
          tile.y >= y - Math.floor(range / 2) &&
          tile.y < y + Math.ceil(range / 2) &&
          tile.x >= x - Math.floor(range / 2) &&
          tile.x < x + Math.ceil(range / 2)
        )
          row.push(tile);
      }
      chunk.push(row);
    }

    return res.status(200).send({ result: chunk });
  } else if (req.method === "POST") {
    // Handle any other HTTP method
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
