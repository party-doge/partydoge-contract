var fs = require('fs');

// var PartyDoge = artifacts.require("../contracts/PartyDoge.sol");

const configs = require("../config.json");

async function main() {
  try {
    
	const partyDogeFactory = await ethers.getContractFactory('PartyDoge');
    const PartyDoge = await (await partyDogeFactory.deploy()).deployed();

    console.log("PartDoge is deployed at: ", PartyDoge.address);

    let dataParse = {};

    if (!configs.PartyDoge) {
      dataParse['PartyDoge'] = PartyDoge.address;
    }
    else {
      dataParse['PartyDoge'] = configs.PartyDoge;
    }
  
    const updatedData = JSON.stringify(dataParse);
		await fs.promises.writeFile('contracts.json', updatedData);

  } catch (error) {
    console.log(error);
  }
};

main()
	.then(() => process.exit(0))
	.catch(error => {
			console.error(error);
			process.exit(1);
	});
