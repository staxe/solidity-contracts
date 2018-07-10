// @copyright defined in solidity-contracts/LICENSE

const bitmaskCases = [
    {
        msg: "last 2 bytes.",
        position: 30,
        size: 2,
        expected: '0x000000000000000000000000000000000000000000000000000000000000FFFF'
    },
    {
        msg: "5 bytes after second byte.",
        position: 2,
        size: 5,
        expected: '0x0000FFFFFFFFFF00000000000000000000000000000000000000000000000000'
    },
    {
        msg: "first 16 bytes.",
        position: 0,
        size: 16,
        expected: '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000000000000000000000000000'
    },
    {
        msg: "last 16 bytes.",
        position: 16,
        size: 16,
        expected: '0x00000000000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
    },
    {
        msg: "32 bytes.",
        position: 0,
        size: 32,
        expected: '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
    },
    {
        msg: "0 bytes at position 0.",
        position: 0,
        size: 0,
        expected: '0x0000000000000000000000000000000000000000000000000000000000000000'
    },
    {
        msg: "1 byte after 5 bytes.",
        position: 5,
        size: 1,
        expected: '0x0000000000FF0000000000000000000000000000000000000000000000000000'
    }
];

const bytes4ChunkCases = {
    testData: '0x123456789AABCDEF0123456789ABBCDEF0123456789ABCCDEF0123456789ABCD',
    cases: [
        {
            msg: "first 4 bytes.",
            index: 0,
            expected: '0x0000000000000000000000000000000000000000000000000000000012345678'
        },
        {
            msg: "second 4 bytes.",
            index: 1,
            expected: '0x000000000000000000000000000000000000000000000000000000009AABCDEF'
        },
        {
            msg: "third 4 bytes.",
            index: 2,
            expected: '0x0000000000000000000000000000000000000000000000000000000001234567'
        },
        {
            msg: "fourth 4 bytes.",
            index: 3,
            expected: '0x0000000000000000000000000000000000000000000000000000000089ABBCDE'
        },
        {
            msg: "fifth 4 bytes.",
            index: 4,
            expected: '0x00000000000000000000000000000000000000000000000000000000F0123456'
        },
        {
            msg: "sixth 4 bytes.",
            index: 5,
            expected: '0x00000000000000000000000000000000000000000000000000000000789ABCCD'
        },
        {
            msg: "seventh 4 bytes.",
            index: 6,
            expected: '0x00000000000000000000000000000000000000000000000000000000EF012345'
        },
        {
            msg: "LAST 4 bytes.",
            index: 7,
            expected: '0x000000000000000000000000000000000000000000000000000000006789ABCD'
        }
    ]
};

module.exports = {
    bitmaskCases,
    bytes4ChunkCases
}