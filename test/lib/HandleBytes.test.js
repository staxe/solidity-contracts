// @copyright defined in solidity-contracts/LICENSE

var HandleBytesTestProxy = artifacts.require("./HandleBytesTestProxy.sol")
var hex = require("../helper/hex");
var handleBytesCases = require("./HandleBytes.cases");

contract('HandleBytes', (accounts) => {

    beforeEach(async () => {
        this.contract = await HandleBytesTestProxy.new();
      });

    describe('Generate Bitmasks', async () => {
        it("should return a mask for the first 4 bytes in 32bytes target.", async () => {
            let result = await this.contract.get32BytesMask.call(0,4);
            result = hex.bigNumberToBytes32HexString(result);
            
            let expected = '0xFFFFFFFF00000000000000000000000000000000000000000000000000000000';
            assert.equal(result, expected, "Bitmask is incorrect.");
        });

        it("should return a mask for the last 4 bytes in 32bytes target.", async () => {
            let result = await this.contract.get32BytesMask.call(28,4);
            result = hex.bigNumberToBytes32HexString(result);
            
            let expected = '0x00000000000000000000000000000000000000000000000000000000FFFFFFFF';
            assert.equal(result, expected, "Bitmask is incorrect.");
        });

        it("should return a mask for different cases in 32bytes target.", async () => {
            const cases = handleBytesCases.bitmaskCases;
            for (let i = 0; i < cases.length; i++) {
                let testCase = cases[i];
                
                let result = await this.contract.get32BytesMask.call(testCase.position, testCase.size);
                result = hex.bigNumberToBytes32HexString(result);

                assert.equal(result, testCase.expected, testCase.msg)
            }
        });

        it ("should throw revert error if exceeds 32 bytes.", async () => {
            try {
                await this.contract.get32BytesMask.call(28,5);
                assert.fail('it should fail before');
            } catch (error) {
                assert.ok(isErrorRevert(error));
            }
        });

        it ("should throw revert error if negative arguments.", async () => {
            try {
                await this.contract.get32BytesMask.call(-1,-1);
                assert.fail('it should fail before');
            } catch (error) {
                assert.ok(isErrorRevert(error));
            }
        });
    });

    describe('Get chunk of 4 bytes by index', async () => {
        it("should return a mask for the first 4 bytes in 32bytes target.", async () => {
            const cases = handleBytesCases.bytes4ChunkCases.cases;
            const testData = handleBytesCases.bytes4ChunkCases.testData;

            for (let i = 0; i < cases.length; i++) {
                let testCase = cases[i];
                
                let result = await this.contract.get4BytesChunkFromBytes32.call(testData, testCase.index);
                result = hex.bigNumberToBytes32HexString(result);

                assert.equal(result, testCase.expected, testCase.msg)
            }
        });

        it("should throw revert error if index is negative.", async () => {
            try {
                const dummyData = '0x40';
                await this.contract.get4BytesChunkFromBytes32.call(dummyData, -1);
                assert.fail('it should fail before');
            } catch (error) {
                assert.ok(isErrorRevert(error));
            }
        });

        it("should throw revert error if index is out of range.", async () => {
            try {
                const dummyData = '0x40';
                await this.contract.get4BytesChunkFromBytes32.call(dummyData, 8);
                assert.fail('it should fail before');
            } catch (error) {
                assert.ok(isErrorRevert(error));
            }
        });
    });

});

function isErrorRevert(error) {
    return error.message.search("revert") > -1;
}