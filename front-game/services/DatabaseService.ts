const AWS = require("aws-sdk");
const AWS_ACCESS_KEY_ = process.env.AWS_ACCESS_KEY_;
const SECRET_ACCESS_KEY_ = process.env.SECRET_ACCESS_KEY_;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_,
  secretAccessKey: SECRET_ACCESS_KEY_,
  region: "us-east-2",
  endpoint: "https://dynamodb.us-east-2.amazonaws.com",
});

export default class DatabaseService {
  dynamo: any;
  constructor() {
    this.dynamo = new AWS.DynamoDB.DocumentClient();
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getMapChunk(x: number, y: number, range: number) {
    let tiles = [];

    for (
      let x_ = x - Math.floor(range / 2);
      x_ < Math.ceil(range / 2) + x;
      x_++
    ) {
      let row = [];
      for (
        let y_ = y - Math.floor(range / 2);
        y_ < Math.ceil(range / 2) + y;
        y_++
      ) {
        const params = {
          TableName: "MapTiles",
          FilterExpression: "#x = :x and #y = :y",
          ExpressionAttributeNames: { "#x": "x", "#y": "y" },
          ExpressionAttributeValues: {
            ":x": x_,
            ":y": y_,
          },
        };

        const _tile = (await this.dynamo.scan(params).promise()).Items[0];

        row.push({
          foesAmount: parseInt(_tile.foesAmount),
          isExplored: _tile.isExplored,
          level: parseInt(_tile.level),
          spiceAmount: parseInt(_tile.spiceAmount),
          x: x,
          y: y,
        });
        await this.sleep(200); //to respect aws dynamo max throughput
      }
      tiles.push(row);
    }

    return tiles;
  }
}
