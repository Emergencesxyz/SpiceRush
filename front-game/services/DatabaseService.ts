const AWS = require("aws-sdk");
const { AWS_ACCESS_KEY_, SECRET_ACCESS_KEY_ } = process.env

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_,
    secretAccessKey: SECRET_ACCESS_KEY_,
    region: "us-east-2",
    endpoint: "https://dynamodb.us-east-2.amazonaws.com",
});


export default class DatabaseService {
    dynamo: any = new AWS.DynamoDB.DocumentClient();
}