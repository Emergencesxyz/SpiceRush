const AWS = require("aws-sdk");
const { PRIVATE_KEY } = process.env;
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";


const { AWS_ACCESS_KEY, SECRET_ACCESS_KEY } = process.env
type Data = {
  name: string;
};

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: "us-east-2",
  endpoint: "https://dynamodb.us-east-2.amazonaws.com",
});
const dynamo = new AWS.DynamoDB.DocumentClient();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let params2 = {
    TableName: "SellOrders",
    FilterExpression: "#user = :nam",
    ExpressionAttributeNames: { "#user": "user" },
    ExpressionAttributeValues: { ":nam": "Bob" },
  };

  let result = dynamo
    .scan(params2)
    .promise()
    .then((result: any) => {
      return res.status(200).send({ name: JSON.stringify(result) });
    })
    .catch((e: any) => {
      return res.status(400).send({ name: "error" });
    });
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
