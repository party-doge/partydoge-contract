var fs = require('fs');

// var PartyDoge = artifacts.require("../contracts/PartyDoge.sol");

const configs = require("../config.json");

async function main() {
  try {
    
	const partyDogeFactory = await ethers.getContractFactory('PartyDoge');
  const presaleFactory = await ethers.getContractFactory('Presale');


  const startOfPresale = Math.floor(Date.UTC(2021, 5, 4, 0, 0, 0) / 1000);
  const endOfICO = Math.floor(Date.UTC(2021, 5, 22, 0, 0, 0) / 1000);
  const deadline1 = Math.floor(Date.UTC(2021, 5, 23, 0, 0, 0) / 1000);
  const deadline2 = Math.floor(Date.UTC(2021, 5, 23, 0, 0, 0) / 1000);
  const deadline3 = Math.floor(Date.UTC(2021, 5, 23, 0, 0, 0) / 1000);

    let dataParse = {};

    if (!configs.PartyDoge) {
      console.log("Deploying partydoge ");
      const PartyDoge = await (await partyDogeFactory.deploy({ gasPrice: 200})).deployed();

      console.log("PartDoge is deployed at: ", PartyDoge.address);

      dataParse['PartyDoge'] = PartyDoge.address;
    }
    else {
      dataParse['PartyDoge'] = configs.PartyDoge;
    }
    if (!configs.Presale) {
      console.log("Deploying presale ");
      const Presale =  await (await presaleFactory.deploy(dataParse['PartyDoge'], startOfPresale, deadline1, deadline2, deadline3, endOfICO, {
      })).deployed();
       dataParse['Presale'] = Presale.address;

       console.log("Presale is deployed at: ", Presale.address);
     }
     else {
       dataParse['Presale'] = configs.Presale;
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
