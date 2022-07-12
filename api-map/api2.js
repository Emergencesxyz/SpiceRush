opts = {
	timestampFormat:'YYYY-MM-DD HH:mm:ss'
}
const MongoClient = require('mongodb').MongoClient
const log = require('simple-node-logger').createSimpleLogger(opts);
const express = require('express')
const https = require("https");
const fs = require("fs");
const cors = require('cors')
const app = express()
app.use(cors())
const port = 3000

app.get('/gamedata', async (req, res) => {
	MongoClient.connect("mongodb://spicerushapi:zbizbizbi!12!@spicerush-mongo:27017/", async function(err, db) {
		if (err) throw err
		var data = {}
		var dbo = db.db("spicerush")
		const map = dbo.collection("map")
		const charas = dbo.collection("charas")
		var result = await map.findOne({"_id":0})
		delete result["_id"]
		data["map"] = result
		var result = await charas.findOne({"_id":0})
		delete result["_id"]
		data["charas"] = result
		res.send(data)
		log.info("successful call")
	})
  })

// app.listen(port, () => {
//     log.info(`Gamedata api listening on port ${port}`)
//   })

https
  .createServer(
    {
		key: fs.readFileSync('privkey.pem'),
		cert: fs.readFileSync('cert.pem'),
		ca: fs.readFileSync('chain.pem'),
    },
    app
  )
  .listen(3000, function () {
    log.info(`Gamedata api listening on port ${port}`)
  });