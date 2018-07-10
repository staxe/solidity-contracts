// @copyright defined in solidity-contracts/LICENSE

var StaxeTicketing = artifacts.require("./StaxeTicketing.sol")
var StaxeToken = artifacts.require("./StaxeToken.sol")
var hex = require('./helper/hex');
const BigNumber = web3.BigNumber;

var dummyTicketTypesID = [0,1,2];
var dummyTicketAvailable = [100,200,300]; 
var dummyTicketCost = [
    to18Decimals(10),
    to18Decimals(20),
    to18Decimals(30)
];

contract('StaxeTicketing', (accounts) => {

    beforeEach(async () => {
        this.token = await StaxeToken.new();
        this.contract = await StaxeTicketing.new(this.token.address, dummyTicketTypesID, dummyTicketAvailable, dummyTicketCost);
      });

    describe('initial state of contract', async () => {
        it("should have the address of the Staxe Token.", async () => {
            let result = await this.contract.staxeToken.call();

            let expected = this.token.address;
            assert.equal(result, expected, "Address of Staxe Token should be correct");
        });

        it("should have 3 types of tickets", async () => {
            let result = await this.contract.ticketTypesCount.call();

            let expected = 3;
            assert.equal(result, expected, "Test Contract should start with 3 types of tickets.")
        });

        it("should have tickets available on each type", async () => {
            let typeID1 = 0;
            let ticketsAvailable1 = await this.contract.ticketsAvailable.call(typeID1);
            let typeID2 = 1;
            let ticketsAvailable2 = await this.contract.ticketsAvailable.call(typeID2);
            let typeID3 = 2;
            let ticketsAvailable3 = await this.contract.ticketsAvailable.call(typeID3);

            let expected1 = dummyTicketAvailable[typeID1];
            let expected2 = dummyTicketAvailable[typeID2];
            let expected3 = dummyTicketAvailable[typeID3];
            assert.equal(ticketsAvailable1, expected1, "Test Contract first type should have 100 tickets.");
            assert.equal(ticketsAvailable2, expected2, "Test Contract first type should have 200 tickets.");
            assert.equal(ticketsAvailable3, expected3, "Test Contract first type should have 300 tickets.");
        });

        it("should have cost of tickets on each type", async () => {
            let typeID1 = 0;
            let ticketsCost1 = await this.contract.ticketsCost.call(typeID1);
            let typeID2 = 1;
            let ticketsCost2 = await this.contract.ticketsCost.call(typeID2);
            let typeID3 = 2;
            let ticketsCost3 = await this.contract.ticketsCost.call(typeID3);

            let expected1 = dummyTicketCost[typeID1];
            let expected2 = dummyTicketCost[typeID2];
            let expected3 = dummyTicketCost[typeID3];
            assert.ok(ticketsCost1.eq(expected1), "Test Contract first type should have correct cost.");
            assert.ok(ticketsCost2.eq(expected2), "Test Contract first type should have correct cost.");
            assert.ok(ticketsCost3.eq(expected3), "Test Contract first type should have correct cost.");
        });
    });

    describe('balance of tickets', async () => {
        it("should return the amount of tickets available for specific ticketTypeID", async () => {
            let available = await this.contract.ticketsOwnedOfTypeID.call(accounts[0], 0);

            let expected = 0;
            assert.equal(available, expected, "Should have 0 tickets");
        });
    });

    describe('buy', async () => {
        it("should be able to buy one ticket using Staxe Token", async () => {
            let ticketTypeID = 1;
            let ticketAmount = 1;
            let ticketData = [
                ticketTypeID,
                ticketAmount
            ]
            ticketData = hex.uint32ElementsArrayTo32BytesHexString(ticketData);
            let tokensToPay = dummyTicketCost[ticketTypeID];

            let tx = await this.token.approveAndCall(this.contract.address, tokensToPay, ticketData);
            let result = await this.contract.ticketsOwnedOfTypeID.call(accounts[0], ticketTypeID);

            let expected = 1;
            assert.equal(result, expected, "Should have 1 ticket.")
        });

        it("should be able to buy 2 ticket using 2 Staxe Token", async () => {
            let ticketTypeID = 2;
            let ticketAmount = 2;
            let ticketData = [
                ticketTypeID,
                ticketAmount
            ]
            ticketData = hex.uint32ElementsArrayTo32BytesHexString(ticketData);
            let tokensToPay = dummyTicketCost[ticketTypeID] * ticketAmount;

            let tx = await this.token.approveAndCall(this.contract.address, tokensToPay, ticketData);
            let result = await this.contract.ticketsOwnedOfTypeID.call(accounts[0], ticketTypeID);

            let expected = 2;
            assert.equal(result, expected, "Should have 2 ticket.")
        });

        it("should be able to buy one ticket using 0.01 ether", async () => {
            let ticketTypeID = 1;
            let ticketAmount = 1;

            let tx = await this.contract.buyWithEther(ticketTypeID, ticketAmount, { value: 0.01 * (10 ** 18)});
            let result = await this.contract.ticketsOwnedOfTypeID.call(accounts[0], ticketTypeID);

            let expected = 1;
            assert.equal(result, expected, "Should have 1 ticket.")
        });

        it("should not be able to buy one ticket using Staxe Token after they are sold out", async () => {
            let ticketTypeID = 0;
            let ticketsAvailable = dummyTicketAvailable[ticketTypeID];
            let buyOneCost = dummyTicketCost[ticketTypeID];
            let buyAllCost = ticketsAvailable * dummyTicketCost[ticketTypeID];
            let ticketData = [
                ticketTypeID,
                ticketsAvailable
            ]
            ticketData = hex.uint32ElementsArrayTo32BytesHexString(ticketData);

            let tx = await this.token.approveAndCall(this.contract.address, buyAllCost, ticketData);
            
            try {
                let ticketData = [
                    ticketTypeID,
                    1
                ]
                ticketData = hex.uint32ElementsArrayTo32BytesHexString(ticketData);
                await this.token.approveAndCall(this.contract.address, buyOneCost, ticketData);
                assert.fail('it should fail before');
            } catch (error) {
                assert.ok(isErrorRevert(error));
            }
        });

        it("should charge only what it costs in tokens, even if we send more tokens.", async () => {
            let ticketTypeID = 0;
            let ticketAmount = 2;
            let ticketData = [
                ticketTypeID,
                ticketAmount
            ]
            ticketData = hex.uint32ElementsArrayTo32BytesHexString(ticketData);
            let costInTokens = dummyTicketCost[ticketTypeID].times(ticketAmount);
            let tokensToPayInExcess = costInTokens.plus(to18Decimals(100));
            let previousBalance = await this.token.balanceOf.call(accounts[0]);

            let tx = await this.token.approveAndCall(this.contract.address, tokensToPayInExcess, ticketData);
            let result = await this.token.balanceOf.call(accounts[0]);

            let expected = previousBalance.minus(costInTokens);
            assert.ok(result.eq(expected), "Contract should take only the right amount, not less nor more.")
        });

        it("should match the balance of sender and StaxeTicketing contract after purchase.", async() => {
            let ticketTypeID = 0;
            let ticketAmount = 2;
            let ticketData = [
                ticketTypeID,
                ticketAmount
            ]
            ticketData = hex.uint32ElementsArrayTo32BytesHexString(ticketData);
            let costInTokens = dummyTicketCost[ticketTypeID].times(ticketAmount);
            let prevBalanceBuyer = await this.token.balanceOf.call(accounts[0]);
            let prevBalanceContract = await this.token.balanceOf.call(this.contract.address);

            let tx = await this.token.approveAndCall(this.contract.address, costInTokens, ticketData);
            let balanceBuyer = await this.token.balanceOf.call(accounts[0]);
            let balanceContract = await this.token.balanceOf.call(this.contract.address);

            let expectedBuyer = prevBalanceBuyer.minus(costInTokens).eq(balanceBuyer);
            let expectedContract = prevBalanceContract.plus(costInTokens).eq(balanceContract);
            assert.ok(expectedBuyer, "Buyer does not have the correct balance.");
            assert.ok(expectedContract, "Contract does not have the correct balance.");
        });
        
        it("should fail when trying to send less tokens than the cost.", async () => {
            let ticketTypeID = 0;
            let ticketsAmount = 3;
            let costInTokens = dummyTicketCost[ticketTypeID].times(ticketsAmount);
            let ticketData = [
                ticketTypeID,
                ticketsAmount
            ]
            ticketData = hex.uint32ElementsArrayTo32BytesHexString(ticketData);
            let minUnitOfStaxeTokens = 1;
            let lessAmountOfTokensThanRequired = costInTokens.minus(minUnitOfStaxeTokens);
            
            try {
                await this.token.approveAndCall.call(this.contract.address, lessAmountOfTokensThanRequired, ticketData);
                assert.fail('it should fail before');
            } catch (error) {
                assert.ok(isErrorRevert(error));
            }
        });
    });

    describe('transfer', async () =>{
        it('should be able to transfer ownership for 1 ticket of 1 type to another wallet.');
        it('should be able to transfer ownership for 2 tickets of 1 type to another wallet.');
        it('should throw revert error if wallet does not have enough tickets available to transfer.');
    });

});

function to18Decimals(num) {
    return new BigNumber(num * (10 ** 18));
}

function isErrorRevert(error) {
    return error.message.search("revert") > -1;
}