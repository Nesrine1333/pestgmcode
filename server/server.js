// TODO connect frontend,

const User = require("./models/user");
let electionEndtime = 0;
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const routes = require("./routes");
const Web3 = require("web3");

const ENERGY_ABI = require("./energyMarketConfig");
const ENERGY_ADDRESS = require("./energyMarketConfig");
const bodyParser = require("body-parser");
const { ethers } = require("ethers");

const contracts = require("@truffle/contract");

const mongoose = require("mongoose");

try {
	mongoose.connect("mongodb://127.0.0.1:27017/energyMarket");
	console.log("connecteed to db succ :)");
} catch (error) {
	console.error("not connected :(");
}

const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

if (typeof web3 !== "undefined") {
	var web3 = new Web3(web3.currentProvider);
} else {
	var web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
}

const EnergyMarketArtifact = require("./build/contracts/EnergyMarket.json");
const EnergyMarket = contracts(EnergyMarketArtifact);
EnergyMarket.setProvider(web3.currentProvider);
console.log(ENERGY_ABI.abi);
let contract;

async function connectWeb3() {
	accounts = await web3.eth.getAccounts();

	contract = new web3.eth.Contract(
		ENERGY_ABI.ENERGY_ABI,
		ENERGY_ADDRESS.ENERGY_ADDRESS
	);
}
connectWeb3();







app.get("/providerInfo", async (req, res) => {
	try {
		const accounts = await web3.eth.getAccounts();
		const consumerAddress = accounts[1]; // Assuming the second account is the consumer

		// Get contract instance
		const instance = await EnergyMarket.deployed();

		// Fetch the provider's price per unit
		const providerAddress = accounts[0];
		const providerInfo = await contract.getProviderInfo(providerAddress);
		res.send({ providerInfo });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
});

app.post("/signup", async (req, res) => {
	const { email, password, name, location } = req.body;

	if (!email || !password || !name || !location) {
		return res.status(400).json({ error: "Invalid request parameters" });
	}

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: "Email already registered" });
		}

		const accounts = await web3.eth.getAccounts();
		console.log("Accounts fetched from Ganache:", accounts);

		let assignedAccount;

		for (let i = 0; i < accounts.length; i++) {
			try {
				const instance = await EnergyMarket.deployed();
				const isRegistered = await instance.isProviderRegistered(accounts[i]);

				console.log(
					"Checking account:",
					accounts[i],
					"Is registered:",
					isRegistered
				);

				if (!isRegistered) {
					assignedAccount = accounts[i];
					console.log("Assigned Account:", assignedAccount); // Log the assigned account
					break;
				}
			} catch (error) {
				console.error(
					"Error checking provider registration for account",
					accounts[i],
					":",
					error
				);
				return res
					.status(500)
					.json({ error: "Error checking provider registration" });
			}
		}

		if (!assignedAccount) {
			return res
				.status(500)
				.json({ error: "No available accounts in Ganache" });
		}

		// Create the new user
		const user = new User({
			email,
			password,
			name,
			location,
		});

		// Deploy the EnergyMarket instance
		const instance = await EnergyMarket.deployed();

		// Register the provider on the blockchain
		const energyAvailable = 1000; // Default energy available
		const pricePerUnit = web3.utils.toWei("0.01", "ether"); // Default price per unit in Wei

		await instance.registerProvider(
			email,
			location,
			energyAvailable,
			pricePerUnit,
			{
				from: assignedAccount,
				gas: 3000000, // Ensure enough gas limit
			}
		);
		console.log(
			`Registered provider ${assignedAccount} with energy ${energyAvailable} and price ${pricePerUnit}`
		);

		// Register the consumer on the blockchain
		await instance.registerConsumer(email, {
			from: assignedAccount,
			gas: 3000000, // Ensure enough gas limit
		});
		console.log(`Registered consumer ${assignedAccount} with email ${email}`);

		// Save the user to MongoDB
		await user.save();

		return res
			.status(200)
			.json({
				message: "Provider and consumer registered successfully",
				address: assignedAccount,
			});
	} catch (error) {
		console.error("Error during signup:", error);
		return res.status(500).json({ error: "Signup failed" });
	}
});

app.post("/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		// Check if the user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Validate password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid password" });
		}

		// Password is correct, handle successful login
		return res
			.status(200)
			.json({
				message: "Login successful",
				user: { name: user.name, email: user.email },
			});
	} catch (error) {
		console.error("Error during login:", error);
		return res.status(500).json({ error: "Login failed" });
	}
});

app.post("/getCustomerInfo", async (req, res) => {
	const { email } = req.body;
	console.log(email);
	if (!email) {
		return res.status(400).json({ error: "Email is required" });
	}

	try {
		const instance = await EnergyMarket.deployed();

		const { consumerAddress, energyBalance, etherBalance } = await instance.getConsumerInfoByEmail(email);

		return res.status(200).json({
			address: consumerAddress,
			energyBalance: energyBalance.toString(),
			etherBalance: web3.utils.fromWei(etherBalance.toString(), 'ether')
		});
	} catch (error) {
		console.error("Error fetching customer info:", error);
		return res.status(500).json({ error: "Failed to fetch customer info" });
	}
});




app.get("/getConsumerEtherBalance/:consumerAddress", async (req, res) => {
	try {
		const { consumerAddress } = req.params;

		// Validate consumerAddress (ensure it's a valid Ethereum address)
		if (!web3.utils.isAddress(consumerAddress)) {
			return res.status(400).json({ error: "Invalid Ethereum address" });
		}

		// Get Ether balance (in Wei) of the consumerAddress
		const balanceWei = await web3.eth.getBalance(consumerAddress);

		// Convert balance from Wei to Ether
		const balanceEther = web3.utils.fromWei(balanceWei, "ether");

		res.json({ balanceWei, balanceEther });
	} catch (error) {
		console.error("Error fetching consumer balance:", error);
		res.status(500).json({ error: "Failed to fetch consumer balance" });
	}
});


app.post("/buy-energy", async (req, res) => {
	const { userEmail, energyAmount, consumerAddress } = req.body;
	const instance = await EnergyMarket.deployed();

	if (!userEmail || !energyAmount || !consumerAddress) {
		return res.status(400).json({ error: "Invalid request parameters" });
	}

	try {
		// Fetch the user's address from their email
		const user = await User.findOne({ email: userEmail });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Validate consumerAddress
		if (!web3.utils.isAddress(consumerAddress)) {
			return res.status(400).json({ error: "Invalid consumer address" });
		}

		// Find the closest provider with sufficient energy
		const providerAddress = await instance.findCheapestProvider(energyAmount,consumerAddress);
		if (!providerAddress || providerAddress === "0x0000000000000000000000000000000000000000") {
			return res.status(404).json({ error: "No provider available with sufficient energy" });
		}

		// Get the provider's price per unit from the contract
		const providerInfo = await instance.getProviderInfo(providerAddress);
		const pricePerUnit = providerInfo[2]; // assuming pricePerUnit is the third element

		// Calculate the total cost
		const totalCost = energyAmount * pricePerUnit;

		// Check if the amount sent is sufficient
		const amountSent = parseFloat(req.body.amountSent); // assuming this is where you get the amount of ETH sent
		if (amountSent < totalCost) {
			return res.status(400).json({ error: "Insufficient payment" });
		}
		console.log(`Provider found: ${providerAddress}`);
        console.log(`Provider info:`, providerInfo);
		// Call the smart contract function to buy energy
		const transaction = await instance.buyEnergy(
			userEmail,
			energyAmount,
			consumerAddress,
			{ from: consumerAddress, value: totalCost, gas: 3000000 } // Adjust gas limit as needed
		);

		return res.status(200).json({ message: "Energy purchased successfully", transaction });
	} catch (error) {
		console.error("Error buying energy:", error);
		return res.status(500).json({ error: "Failed to buy energy" });
	}
});

async function getAllProviders() {
	const instance = await EnergyMarket.deployed();
    try {
        const providerList = await instance.providerList();
        const providers = await Promise.all(providerList.map(async (address) => {
            return await instance.providers(address);
        }));
        return providers;
    } catch (error) {
        throw error;
    }
}


app.get('/providers', async (req, res) => {
    try {
        const providers = await getAllProviders();
        res.json(providers);
    } catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// app.get('/api/providers', async (req, res) => {
// 	const instance = await EnergyMarket.deployed();
//     try {
//         const providerAddresses = await instance.getAllProviders();
//         res.json({ providers: providerAddresses });
//     } catch (error) {
//         console.error('Error fetching providers:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

app.get('/api/providers/addresses', async (req, res) => {
	const instance = await EnergyMarket.deployed();
    try {
		const providerAddresses = await instance.getAllProviders();
        res.json({ addresses: providerAddresses });
    } catch (error) {
        console.error('Error fetching provider addresses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});






const users = {};

app.get("/users", (req, res) => {
	res.status(200).json(users);
});

app.listen(process.env.PORT || 3001, () => {
	console.log("listening on port " + (process.env.PORT || 3001));
});

