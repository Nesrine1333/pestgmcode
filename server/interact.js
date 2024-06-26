const Web3 = require('web3');
const contract = require('@truffle/contract');
const EnergyMarketArtifact = require('./build/contracts/EnergyMarket.json');

const web3 = new Web3('http://127.0.0.1:7545'); // Ensure this matches your Ganache UI RPC server URL
const EnergyMarket = contract(EnergyMarketArtifact);
EnergyMarket.setProvider(web3.currentProvider);

async function interact() {
  const accounts = await web3.eth.getAccounts();
  const instance = await EnergyMarket.deployed();

  // Fetch provider information
  const providerAddress = accounts[0]; // Assuming the first account is the provider
  const providerInfo = await instance.getProviderInfo(providerAddress);
  console.log(`Provider Name: ${providerInfo[0]}`);
  console.log(`Energy Available: ${providerInfo[1]}`);
  console.log(`Price Per Unit: ${providerInfo[2]}`);

  // Fetch consumer balance
  const consumerBalance = await instance.getConsumerBalance(accounts[1]);
  console.log(`Consumer Balance: ${consumerBalance}`);
}

interact().catch(error => {
  console.error('Error interacting with contract:', error);
})