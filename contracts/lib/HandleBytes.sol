// @copyright defined in solidity-contracts/LICENSE

pragma solidity ^0.4.19;

library HandleBytes {
    
    function get4BytesChunkFromBytes32(uint256 _data, uint256 _index) internal pure returns (uint256){
        require(_index <= 7);
        require(_index >= 0);
        return (_data & get32BytesMask((_index * 4), 4) ) >> (256 - (_index * 32 + 32));
    }

    function get32BytesMask(uint256 _position, uint256 _size) internal pure returns (uint256){
        require((_position + _size) <= 32);
        require(_position >= 0);
        require(_size >= 0);
        uint256 mask = (256 ** _size) - 1;
        return  mask << (256 - (_position * 8 + (_size * 8) ));
    }
}