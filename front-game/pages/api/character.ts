// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import DatabaseService from "../../services/DatabaseService";
import BlockchainService from "../../services/BlockchainService";

type Data = {
  result: string;
};

const databaseService = new DatabaseService();
const blockchainService = new BlockchainService(null);

let cachedCharacters: any = null;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const id = parseInt(req.query.id as string);
    console.log("/character id=", id);
    console.log("isCached", cachedCharacters !== null);
    const totalSupply = parseInt(await blockchainService.totalSupply());

    let result: any = [];
    if (!cachedCharacters) {
      console.log("- putting characters in cache");
      for (let i = 0; i < totalSupply; i++) {
        result.push(await blockchainService.getCharacterInfo(i));
      }
      cachedCharacters = result;
      console.log("- characters cached!");
    } else {
      result = cachedCharacters;
    }

    //filter
    if (Number.isInteger(id)) {
      result = result.filter((c, i: number) => i === id)[0];
    }

    return res.status(200).json({ result: result });
  } catch (e: any) {
    return res.status(400).json({ result: e.toString() });
  }
}
