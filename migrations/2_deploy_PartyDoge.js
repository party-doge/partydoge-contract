var fs = require('fs');

var PartyDoge = artifacts.require("../contracts/PartyDoge.sol");


const configs = require("../config.json");

module.exports = async function(deployer, network, accounts) {
  try {
    let dataParse = {};
    console.log("Debug Args")
    console.log("Network:", network);
    console.log("Accounts:", accounts);
    
    if (!configs.PartyDoge) {
      await deployer.deploy(PartyDoge, {
        gas: 4000000
      });
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
