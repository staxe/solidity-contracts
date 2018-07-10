// @copyright defined in solidity-contracts/LICENSE

var StaxeToken = artifacts.require("StaxeToken");
var StaxePlatform = artifacts.require("StaxePlatform");

module.exports = function (deployer) {
    deployer.deploy(StaxeToken)
        .then(() => deployer.deploy(StaxePlatform, StaxeToken.address));
};