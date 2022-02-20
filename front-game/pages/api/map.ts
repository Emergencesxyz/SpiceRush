// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import DatabaseService from "../../services/DatabaseService";

type Data = {
  result: string;
};

const databaseService = new DatabaseService();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //get params
  const { x, y, range } = req.query;

  let params = {
    TableName: "MapTiles",
    FilterExpression: "#x = :x and #y = :y",
    ExpressionAttributeNames: { "#x": "x", "#y": "y" },
    ExpressionAttributeValues: {
      ":x": parseInt(x as string),
      ":y": parseInt(y as string),
    },
  };

  if (req.method === "GET") {
    // Process a POST request
    let result = databaseService.dynamo
      .scan(params)
      .promise()
      .then((result: any) => {
        return res.status(200).send({ result: JSON.stringify(result) });
      })
      .catch((e: any) => {
        return res.status(400).send({ result: "error" });
      });
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
