// @copyright defined in solidity-contracts/LICENSE

var StaxeDistribution = artifacts.require("./StaxeDistribution.sol")
var hex = require('./helper/hex');
const BigNumber = web3.BigNumber;

contract('StaxeDistribution', (accounts) => {

    beforeEach(async () => {
        this.contract = await StaxeDistribution.new();
    });

    describe('Distribution', async () => {
        it("should calculate shares of 2 Staxeholders and 1 fixed provider.", async () => {
            let fundRaised = to18Decimals(125);
            let totalRaisedIncludingTickets = to18Decimals(500);
            let providersAddress = [
                accounts[0]
            ];
            let pctFixedProviders = [
                5000000000
            ];
            let investorsAddress = [
                accounts[1],
                accounts[2]
            ];
            let investorsAmountInvested = [
                to18Decimals(100),
                to18Decimals(25)
            ];
            
            let result = await this.contract.sharesStaxeHolders.call(
                fundRaised,
                totalRaisedIncludingTickets,
                providersAddress,
                pctFixedProviders,
                investorsAddress,
                investorsAmountInvested
            );

            let expected0 = {
                investorAddress: accounts[0],
                tokensToPay: to18Decimals(250)
            };
            let expected1 = {
                investorAddress: accounts[1],
                tokensToPay: to18Decimals(200)
            };
            let expected2 = {
                investorAddress: accounts[2],
                tokensToPay: to18Decimals(50)
            };
            let result0 = {
                investorAddress: '0x' + result[0][0].toString(16),
                tokensToPay: result[1][0]
            };
            let result1 = {
                investorAddress: '0x' + result[0][1].toString(16),
                tokensToPay: result[1][1]
            };
            let result2 = {
                investorAddress: '0x' + result[0][2].toString(16),
                tokensToPay: result[1][2]
            };
            assert.deepEqual(result0, expected0, "incorrect amount of tokens to pay for provider.");
            assert.deepEqual(result1, expected1, "incorrect amount of tokens to pay for investor 1.");
            assert.deepEqual(result2, expected2, "incorrect amount of tokens to pay for investor 2.");
        });

        it("should calculate share of 2 Staxeholders with 1 points of precision and 1 fixed provider.", async () => {
            let fundRaised = to18Decimals(100);
            let totalRaisedIncludingTickets = to18Decimals(200);
            let providersAddress = [
                accounts[0]
            ];
            let pctFixedProviders = [
                5000000000
            ];
            let investorsAddress = [
                accounts[1],
                accounts[2]
            ];
            let investorsAmountInvested = [
                to18Decimals(40.5),
                to18Decimals(59.5)
            ];
            
            let result = await this.contract.sharesStaxeHolders.call(
                fundRaised,
                totalRaisedIncludingTickets,
                providersAddress,
                pctFixedProviders,
                investorsAddress,
                investorsAmountInvested
            );

            let expected0 = {
                providerAddress: accounts[0],
                tokensToPay: to18Decimals(100)
            };
            let expected1 = {
                investorAddress: accounts[1],
                tokensToPay: to18Decimals(40.5)
            };
            let expected2 = {
                investorAddress: accounts[2],
                tokensToPay: to18Decimals(59.5)
            };
            let result0 = {
                providerAddress: '0x' + result[0][0].toString(16),
                tokensToPay: result[1][0]
            };
            let result1 = {
                investorAddress: '0x' + result[0][1].toString(16),
                tokensToPay: result[1][1]
            };
            let result2 = {
                investorAddress: '0x' + result[0][2].toString(16),
                tokensToPay: result[1][2]
            };

            assert.deepEqual(result0, expected0, "incorrect amount of tokens to pay for provider.");
            assert.deepEqual(result1, expected1, "incorrect amount of tokens to pay for investor 1.");
            assert.deepEqual(result2, expected2, "incorrect amount of tokens to pay for investor 2.");
        });

        it("should calculate share of 2 Staxeholders with precision 4 and 1 fixed provider with 4 points of precision on percentage.", async() =>{
            let totalRaisedIncludingTickets = to18Decimals(12458.51566);
            let providersAddress = [
                accounts[0]
            ];
            let pctFixedProviders = [
                3021230000
            ];
            let investorsAddress = [
                accounts[1],
                accounts[2]
            ];
            let investorsAmountInvested = [
                to18Decimals(107.1235),
                to18Decimals(52.2156)
            ];
            let fundRaised = investorsAmountInvested[0].plus(investorsAmountInvested[1]);
            
            console.log(investorsAmountInvested[0].toString())
            console.log(investorsAmountInvested[1].toString())
            console.log('fundRaised: ' + fundRaised.toString());
            let result = await this.contract.sharesStaxeHolders.call(
                fundRaised,
                totalRaisedIncludingTickets,
                providersAddress,
                pctFixedProviders,
                investorsAddress,
                investorsAmountInvested
            );
            console.log(JSON.stringify(result));

            let expected0 = {
                providerAddress: accounts[0],
                tokensToPay: to18Decimals(3764.004126)
            };
            let expected1 = {
                investorAddress: accounts[1],
                tokensToPay: to18Decimals(5845.310448)
            };
            let expected2 = {
                investorAddress: accounts[2],
                tokensToPay: to18Decimals(2849.201083)
            };
            let result0 = {
                providerAddress: '0x' + result[0][0].toString(16),
                tokensToPay: result[1][0]
            };
            let result1 = {
                investorAddress: '0x' + result[0][1].toString(16),
                tokensToPay: result[1][1]
            };
            let result2 = {
                investorAddress: '0x' + result[0][2].toString(16),
                tokensToPay: result[1][2]
            };
            console.log(result[1][0].toString())
            console.log(result[1][1].toString())
            console.log(result[1][2].toString())
            assert.deepEqual(result0, expected0, "incorrect amount of tokens to pay for provider.");
            assert.deepEqual(result1, expected1, "incorrect amount of tokens to pay for investor 1.");
            assert.deepEqual(result2, expected2, "incorrect amount of tokens to pay for investor 2.");
        });
        it("should throw revert error if address and pct of providers arrays does not match in length.");
        it("should throw revert error if address and investment amount of Staxeholders arrays does not match in length");


    });

});

function to18Decimals(num) {
    return new BigNumber(num).times(10 ** 18);
}

function isErrorRevert(error) {
    return error.message.search("revert") > -1;
}