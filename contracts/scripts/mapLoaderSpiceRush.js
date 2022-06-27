const ethers = require('ethers');
const fs = require('fs')
const abi = JSON.parse(fs.readFileSync('abi/gameplay.json', 'utf-8'))
const contractAddress = '0x0EE7C79D464e69A38A06F175ea0D33BBd63d449f'
// const contractAddress = '0xe42f7cB1944CC1f3094Eb4b10dFa472fF7A07b07' // new gameplay

// 0xe42f7cB1944CC1f3094Eb4b10dFa472fF7A07b07
const webSocketProvider = new ethers.providers.WebSocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/2-uzNKFzCYbSLoaFxzKd8kSQAqoRbwFl");
const contract = new ethers.Contract(contractAddress, abi, webSocketProvider);

// contract.on("Transfer", (from, to, value, event) => {
//         console.log({
//             from: from,
//             to: to,
//             value: value.toNumber(),
//             data: event
//         });
//     });



filters = contract.filters.leveledUp();

map = {"0": {"0": {"isExplored": false, "level": 0, "spiceAmount": 0, "foesAmount": 0}}}
charas = {}

getmap = async function() {
	console.log("start")
	data = await contract.queryFilter(-100000000)
    // console.log(data)
	for (var i = 0; i<data.length; i++) {
		ev = data[i]
		switch (ev["event"]) {
			case 'explored':
				if (map[ev["args"]["_x"].toString()]){
					map[ev["args"]["_x"].toString()][ev["args"]["_x"].toString()] = {"isExplored": true, "level": ev["args"]["_level"], 
					"spiceAmount": parseInt(ev["args"]["_spiceAmount"]), "foesAmount": ev["args"]["_foesAmount"]}
				}
				else{
					map[ev["args"]["_x"].toString()] = {[ev["args"]["_x"].toString()]: {"isExplored": true, "level": ev["args"]["_level"], 
					"spiceAmount": parseInt(ev["args"]["_spiceAmount"]), "foesAmount": ev["args"]["_foesAmount"]}}
				}

			// case 'moving':
			// 	console.log(ev["args"])

			// case 'leveledUp':
			// 	console.log(ev["args"])

			// case 'died':
			// 	console.log(ev["args"])

			// case 'mining':
			// 	console.log(ev["args"])

			// case 'resting':
			// 	console.log(ev["args"])

			// case 'spawned':
			// 	charas[ev["args"]["_tokenId"].toString()] = {"nextActionTime": 0, "x": parseInt(ev["args"]["_x"]), "y": parseInt(ev["args"]["_x"]), 
			// 	"hp": 10, "energy": 10, "mining": 10, "hpMax": 10, "energyMax": 10, "xp": 0, "oreBalance": 0, "lvl": 0, "name": ev["args"]["_tokenId"].toString()}

			// case 'buyLand':
			// 	console.log(ev["args"])

			// case 'changedName':
			// 	charas[ev["args"]["_tokenId"].toString()]["name"] = ev["args"]["_name"].toString()

			// case 'hit':
			// 	charas[ev["args"]["_tokenIdTo"].toString()]["hp"] -= 1

			// case 'refine':
			// 	charas[ev["args"]["_tokenId"].toString()]["oreBalance"] -= parseInt(ev["args"]["_tokenId"])

			// default:
			// 	console.log('other case', ev["event"])
		}
	}
	console.log(map)
}

getmap()