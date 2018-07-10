// @copyright defined in solidity-contracts/LICENSE

var directions = {
    LEFT: 1,
    RIGHT: 2
}

function bigNumberToBytes32HexString(num) {
    num = toHex(num);
    num = num.toUpperCase();
    num = pad(num, 64);
    num = '0x' + num;
    return num;
}

function uint32ElementsArrayTo32BytesHexString(arrNums) {
    var result = '';
    for (let i = 0; i < arrNums.length; i++) {
        var num = arrNums[i];
        if(isUINT32(num)) {
            num = toHex(num);
            num = num.toUpperCase(num);
            num = pad(num, 8);
            result += num;
        }
    }
    result = pad(result, 64, directions.RIGHT);
    result = '0x' + result;
    return result;
}

function isUINT32(num) {
    var maxVal = 4294967295;
    if(num > maxVal) {
        throw new Error('Invalid INT32: ' + num);
    }
    return true;
}

function toHex(num) {
    return num.toString(16);
}

function pad(num, padding, direction = directions.LEFT) {
    num = '' + num;
    while (num.length < (padding || 2)) {
        if(direction == directions.LEFT){
            num = '0' + num;
        } else {
            num = num + '0';
        }
    }
    return num;
}

module.exports = {
    bigNumberToBytes32HexString,
    uint32ElementsArrayTo32BytesHexString
}