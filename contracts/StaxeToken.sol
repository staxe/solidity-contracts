// @copyright defined in solidity-contracts/LICENSE

pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

interface TokenReceiver {
    function receiveApproval(address s, uint256 v, address r, bytes e) public returns (bool);
}

contract StaxeToken is MintableToken {
    string public constant name = "StaxeToken";
    string public constant symbol = "STXE";
    uint8 public constant decimals = 18;
    uint256 public constant INITIAL_SUPPLY = 10000000 * (10 ** uint256(decimals));

    function StaxeToken() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }

    function approveAndCall(address _spender, uint256 _value, bytes _data) public {
        require(approve(_spender, _value));
        require(TokenReceiver(_spender).receiveApproval(msg.sender, _value, this, _data));
    }
}