const ethers = require('ethers');
const fs = require('fs')
opts = {
	timestampFormat:'YYYY-MM-DD HH:mm:ss'
}
const log = require('simple-node-logger').createSimpleLogger(opts);
const express = require('express')
const app = express()
const port = 3000
const abi = JSON.parse(fs.readFileSync('abi/gameplay.json', 'utf-8'))
const contractAddress = '0xe1A3428732b6a74F2DC8D92819595d2008cE82c1'
// const contractAddress = '0xe42f7cB1944CC1f3094Eb4b10dFa472fF7A07b07' // new gameplay

// 0xe42f7cB1944CC1f3094Eb4b10dFa472fF7A07b07
const Provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/2-uzNKFzCYbSLoaFxzKd8kSQAqoRbwFl");
const contract = new ethers.Contract(contractAddress, abi, Provider);

// contract.on("Transfer", (from, to, value, event) => {
//         log.info({
//             from: from,
//             to: to,
//             value: value.toNumber(),
//             data: event
//         });
//     });


getGameInfo = async function() {
    map = {"0": {"0": {"isExplored": false, "level": 0, "spiceAmount": 0, "foesAmount": 0}}}
    charas = {}
	data = await contract.queryFilter(-100000000)
    // log.info(data)
	for (var i = 0; i<data.length; i++) {
		ev = data[i]
		switch (ev["event"]) {
			case 'explored':
				if (map[ev["args"]["_x"].toString()]){
					map[ev["args"]["_x"].toString()][ev["args"]["_y"].toString()] = {"isExplored": true, "level": ev["args"]["_level"], 
					"spiceAmount": ev["args"]["_spiceAmount"], "foesAmount": ev["args"]["_foesAmount"]}
				}
				else{
					map[ev["args"]["_x"].toString()] = {[ev["args"]["_y"].toString()]: {"isExplored": true, "level": ev["args"]["_level"], 
					"spiceAmount": ev["args"]["_spiceAmount"], "foesAmount": ev["args"]["_foesAmount"]}}
				}
				break
				
			case 'moving':
				if (map[charas[ev["args"]["_tokenId"].toString()]["x"]][charas[ev["args"]["_tokenId"].toString()]["y"]]["players"][ev["args"]["_tokenId"].toString()]) {
					delete map[charas[ev["args"]["_tokenId"].toString()]["x"]][charas[ev["args"]["_tokenId"].toString()]["y"]]["players"][ev["args"]["_tokenId"].toString()]
					if (map[ev["args"]["_x"].toString()][ev["args"]["_y"].toString()]["players"]){
						map[ev["args"]["_x"].toString()][ev["args"]["_y"].toString()]["players"][ev["args"]["_tokenId"].toString()] = true
					}
					else{
						map[ev["args"]["_x"].toString()][ev["args"]["_y"].toString()]["players"] = {
							[ev["args"]["_tokenId"].toString()]: true
						}
					}
					charas[ev["args"]["_tokenId"].toString()]["x"] = parseInt(ev["args"]["_x"])
					charas[ev["args"]["_tokenId"].toString()]["y"] = parseInt(ev["args"]["_y"])
					charas[ev["args"]["_tokenId"].toString()]["hp"] = parseInt(ev["args"]["_hp"])
					charas[ev["args"]["_tokenId"].toString()]["energy"] = parseInt(ev["args"]["_energy"])
					charas[ev["args"]["_tokenId"].toString()]["xp"] = ev["args"]["_xp"].toString()
				}
				break

			case 'leveledUp':
				charas[ev["args"]["_tokenId"].toString()]["lvl"] += 1
				charas[ev["args"]["_tokenId"].toString()]["mining"] = ev["args"]["_mining"]
				charas[ev["args"]["_tokenId"].toString()]["hpMax"] = ev["args"]["_hpMax"]
				charas[ev["args"]["_tokenId"].toString()]["energyMax"] = ev["args"]["_energyMax"]
				break

			case 'died':
				map[charas[ev["args"]["_tokenId"].toString()]["x"]][charas[ev["args"]["_tokenId"].toString()]["y"]]["spiceAmount"] = map[charas[ev["args"]["_tokenId"].toString()]["x"]][charas[ev["args"]["_tokenId"].toString()]["y"]]["spiceAmount"].add(ev["args"]["_spiceAmount"]).mul((100 + charas[ev["args"]["_tokenId"].toString()]["mining"])/100)
				charas[ev["args"]["_tokenId"].toString()]["hp"] = 0
				break

			case 'mining':
				map[charas[ev["args"]["_tokenId"].toString()]["x"]][charas[ev["args"]["_tokenId"].toString()]["y"]]["spiceAmount"] = map[charas[ev["args"]["_tokenId"].toString()]["x"]][charas[ev["args"]["_tokenId"].toString()]["y"]]["spiceAmount"].sub(ev["args"]["_spiceAmount"])
				charas[ev["args"]["_tokenId"].toString()]["hp"] = ev["args"]["_hp"]
				charas[ev["args"]["_tokenId"].toString()]["xp"] = ev["args"]["_xp"]
				charas[ev["args"]["_tokenId"].toString()]["oreBalance"] = ev["args"]["_bank"]
				break

			case 'resting':
				charas[ev["args"]["_tokenId"].toString()]["hp"] = ev["args"]["_hp"]
				charas[ev["args"]["_tokenId"].toString()]["energy"] = ev["args"]["_energy"]
				charas[ev["args"]["_tokenId"].toString()]["nextActionTime"] = ev["args"]["_nextActionTime"]
				break

			case 'spawned':
				charas[ev["args"]["_tokenId"].toString()] = {"nextActionTime": 0, "x": parseInt(ev["args"]["_x"]), "y": parseInt(ev["args"]["_x"]), 
				"hp": 10, "energy": 10, "mining": 10, "hpMax": 10, "energyMax": 10, "xp": 0, "oreBalance": 0, "lvl": 0, "name": ev["args"]["_tokenId"].toString()}
				if (map[ev["args"]["_x"].toString()][ev["args"]["_y"].toString()]["players"]){
					map[ev["args"]["_x"].toString()][ev["args"]["_y"].toString()]["players"][ev["args"]["_tokenId"].toString()] = true
				}
				else{
					map[ev["args"]["_x"].toString()][ev["args"]["_y"].toString()]["players"] = {
						[ev["args"]["_tokenId"].toString()]: true
					}
				}
				break

			// case 'buyLand':
			// 	log.info(ev["args"])

			case 'changedName':
				charas[ev["args"]["_tokenId"].toString()]["name"] = ev["args"]["_name"].toString()
				break

			// case 'hit':
			// 	charas[ev["args"]["_tokenIdTo"].toString()]["hp"] -= 1

			case 'refine':
				charas[ev["args"]["_tokenId"].toString()]["oreBalance"] = charas[ev["args"]["_tokenId"].toString()]["oreBalance"].sub(ev["args"]["_amount"])
				break

			// default:
            //     break
		}
	}
    return {
        "map": map,
        "charas": charas
    }
}


app.get('/gamedata', async (req, res) => {
    data = await getGameInfo()
    res.send(data)
    log.info("successful call")
  })


app.listen(port, () => {
    log.info(`Map api listening on port ${port}`)
  })