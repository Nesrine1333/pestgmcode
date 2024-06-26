pragma solidity ^0.8.0;

contract EnergyMarket {
    address public owner;

    struct Provider {
        string email;
        string location;
        uint256 energyAvailable;
        uint256 pricePerUnit;
        bool registered;
    }

    mapping(address => Provider) public providers;
    mapping(address => uint256) public consumerBalances;
    mapping(string => address) private consumerEmailToAddress;
    address[] public providerList;

    event ProviderRegistered(
        address indexed provider,
        string email,
        string location,
        uint256 energyAvailable,
        uint256 pricePerUnit
    );
    event EnergyPurchased(
        address indexed consumer,
        address indexed provider,
        uint256 energyAmount,
        uint256 totalCost
    );
    event ProviderUpdated(
        address indexed provider,
        uint256 energyAvailable,
        uint256 pricePerUnit
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyRegisteredProvider() {
        require(
            providers[msg.sender].registered,
            "Only registered providers can perform this action"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerProvider(
        string memory email,
        string memory location,
        uint256 energyAvailable,
        uint256 pricePerUnit
    ) public {
        require(!providers[msg.sender].registered, "Provider already registered");
        providers[msg.sender] = Provider(
            email,
            location,
            energyAvailable,
            pricePerUnit,
            true
        );
        providerList.push(msg.sender);
        emit ProviderRegistered(
            msg.sender,
            email,
            location,
            energyAvailable,
            pricePerUnit
        );
    }

    function registerConsumer(string memory email) public {
        require(consumerEmailToAddress[email] == address(0), "Consumer already registered");
        consumerEmailToAddress[email] = msg.sender;
        consumerBalances[msg.sender] = 0; // Initialize the energy balance
    }

    function isProviderRegistered(
        address providerAddress
    ) public view returns (bool) {
        return providers[providerAddress].registered;
    }

    function updateProvider(
        uint256 energyAvailable,
        uint256 pricePerUnit
    ) public onlyRegisteredProvider {
        providers[msg.sender].energyAvailable = energyAvailable;
        providers[msg.sender].pricePerUnit = pricePerUnit;
        emit ProviderUpdated(msg.sender, energyAvailable, pricePerUnit);
    }

    function getConsumerInfoByEmail(string memory email) public view returns (address consumerAddress, uint256 energyBalance, uint256 etherBalance) {
        consumerAddress = consumerEmailToAddress[email];
        require(consumerAddress != address(0), "Consumer not found");

        energyBalance = consumerBalances[consumerAddress];
        etherBalance = consumerAddress.balance; // Ether balance in Wei
    }

    event EnergyPurchaseCompleted(
    address indexed consumerAddress,
    uint256 energyAmount,
    uint256 totalCost
);


function buyEnergy(
     string memory consumerEmail,
    uint256 energyAmount,
   address consumerAddress
) public payable {
    require(msg.sender == consumerAddress, "Unauthorized");

    uint256 remainingEnergy = energyAmount;
    uint256 totalCost = 0;

    while (remainingEnergy > 0) {
        address providerAddress = findCheapestProvider(remainingEnergy,consumerAddress);
        require(providerAddress != address(0), "No provider available with sufficient energy");

        Provider storage provider = providers[providerAddress];
        uint256 energyToBuy = remainingEnergy;

        if (provider.energyAvailable < remainingEnergy) {
            energyToBuy = provider.energyAvailable;
        }

        uint256 cost = energyToBuy * provider.pricePerUnit;
        require(msg.value >= totalCost + cost, "Insufficient payment");

        provider.energyAvailable -= energyToBuy;
        consumerBalances[consumerAddress] += energyToBuy;
        totalCost += cost;
        remainingEnergy -= energyToBuy;

        // Emit event for each purchase
        emit EnergyPurchased(
            consumerAddress,
            providerAddress,
            energyToBuy,
            cost
        );
    }

    // Ensure the consumer's email is mapped to their address
    consumerEmailToAddress[consumerEmail] = consumerAddress;

    // Send any excess payment back to the consumer
    if (msg.value > totalCost) {
        payable(consumerAddress).transfer(msg.value - totalCost);
    }

    // Emit event for the overall transaction
    emit EnergyPurchaseCompleted(
        consumerAddress,
        energyAmount,
        totalCost
    );
}
function findCheapestProvider(uint256 energyAmount, address consumerAddress) public view returns (address) {
    address cheapestProvider ;
    uint256 lowestPrice = type(uint256).max;
    bool foundCheapestProvider = false;

    for (uint256 i = 0; i < providerList.length; i++) {
        address providerAddress = providerList[i];
        Provider storage provider = providers[providerAddress];

        // Skip the consumer's address
        if (providerAddress == consumerAddress) {
            continue;
        }

        if (
            provider.registered &&
            provider.energyAvailable >= energyAmount &&
            provider.pricePerUnit < lowestPrice
        ) {
            cheapestProvider = providerAddress;
            lowestPrice = provider.pricePerUnit;
            foundCheapestProvider = true;
        }
    }

    // If no other provider was found and the consumer cannot act as a provider, return address(0)
    if (!foundCheapestProvider && !(providers[consumerAddress].registered && providers[consumerAddress].energyAvailable >= energyAmount)) {
        return address(0); // No suitable provider found
    }

    return cheapestProvider;
}

function getProviderInfo(
        address providerAddress
    )
        public
        view
        returns (string memory name, uint256 energyAvailable, uint256 pricePerUnit)
    {
        Provider storage provider = providers[providerAddress];
        return (provider.email, provider.energyAvailable, provider.pricePerUnit);
    }


    function getAllProviders() public view returns (address[] memory) {
        return providerList;
    }

}
