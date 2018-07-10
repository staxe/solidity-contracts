// @copyright defined in solidity-contracts/LICENSE

pragma solidity ^0.4.19;

import "./HandleBytes.sol";

contract HandleBytesTestProxy {
    
    function get4BytesChunkFromBytes32(uint256 _data, uint256 _index) public pure returns (uint256){
        return HandleBytes.get4BytesChunkFromBytes32(_data, _index);
    }

    function get32BytesMask(uint256 _position, uint256 _size) public pure returns (uint256){
        return HandleBytes.get32BytesMask(_position, _size);
    }
}