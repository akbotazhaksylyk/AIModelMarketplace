// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    struct Model {
        uint256 id;
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint256 totalRating;
        uint256 numRatings;
    }

    mapping(uint256 => Model) public models;
    mapping(address => mapping(uint256 => bool)) public purchases;
    uint256 public modelCount;

    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    event ModelListed(uint256 indexed modelId, string name, uint256 price);
    event ModelPurchased(uint256 indexed modelId, address buyer);
    event ModelRated(uint256 indexed modelId, uint8 rating);

    function listModel(
        string memory name,
        string memory description,
        uint256 price
    ) public {
        modelCount++;
        models[modelCount] = Model(
            modelCount,
            name,
            description,
            price,
            payable(msg.sender),
            0,
            0
        );
        emit ModelListed(modelCount, name, price);
    }

    function purchaseModel(uint256 modelId) public payable {
        Model storage model = models[modelId];
        require(msg.value >= model.price, "Insufficient payment");
        purchases[msg.sender][modelId] = true;
        // Деньги остаются на контракте вместо немедленной отправки создателю
        emit ModelPurchased(modelId, msg.sender);
    }

    function rateModel(uint256 modelId, uint8 rating) public {
        require(
            purchases[msg.sender][modelId],
            "You must purchase the model before rating"
        );
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        Model storage model = models[modelId];
        model.totalRating += rating;
        model.numRatings++;
        emit ModelRated(modelId, rating);
    }

    function getModelDetails(uint256 modelId)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            address,
            uint256
        )
    {
        Model storage model = models[modelId];
        uint256 avgRating = model.numRatings > 0
            ? model.totalRating / model.numRatings
            : 0;
        return (
            model.name,
            model.description,
            model.price,
            model.creator,
            avgRating
        );
    }

    function withdrawFunds() public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner).transfer(balance);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }
}
