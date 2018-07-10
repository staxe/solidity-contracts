// @copyright defined in solidity-contracts/LICENSE

pragma solidity ^0.4.18;

import "./lib/HandleBytes.sol";

interface StaxeTokenT {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract StaxeTicketing {
    StaxeTokenT public staxeToken;
    bool public closed;
    Tickets[] public tickets;

    struct Tickets {
        uint128 typeID;
        uint128 available;
        uint256 cost;
        mapping(address => uint256) balances;
    }

    event Bought(uint ticketID, uint amount, uint owned, uint available, address buyer);

    // Tickets Cost comes as 2 decimal places int, ticketCost * (10 ** 2)
    function StaxeTicketing(address _staxeToken, uint128[] ticketTypesID, uint128[] ticketTypesAvailable, uint256[] ticketTypesCost) public {
        //require( arrays length match );
        staxeToken = StaxeTokenT(_staxeToken);
        for(uint i = 0; i < ticketTypesID.length;i++) {
            uint256 ticketID = tickets.length++;
            tickets[ticketID] = Tickets({
                typeID: ticketTypesID[i],
                available: ticketTypesAvailable[i],
                cost: ticketTypesCost[i]
            });
        }
    }

    function buyWithEther(uint256 _ticketID, uint256 _amount) public payable returns (bool) {
        require(tickets[_ticketID].available >= _amount);
        //require((tickets[_ticketID].cost * _amount) == msg.value);
        uint256 fakeCost = 0.01 * (10 ** 18);
        require(msg.value >= (fakeCost * _amount));

        _buyWithStaxeToken(msg.sender, _ticketID, _amount);
    }

    function _buyWithStaxeToken(address _buyer, uint256 _amount, uint256 ticketTypeID) internal {
        tickets[ticketTypeID].balances[_buyer] += _amount;
        tickets[ticketTypeID].available = uint128(tickets[ticketTypeID].available - _amount);
        Bought(ticketTypeID, _amount, tickets[ticketTypeID].balances[_buyer], tickets[ticketTypeID].available, _buyer);
    }

    function receiveApproval(
        address _sender,
        uint256 _value,
        StaxeTokenT _staxeToken,
        bytes _data
    )
        public returns (bool) 
    {
        require(!closed);

        uint256 ticketsData;
        assembly {
            ticketsData := mload(add(_data, 0x20))
        }
        uint256 ticketTypeID = HandleBytes.get4BytesChunkFromBytes32(ticketsData, 0);
        uint256 ticketAmount = HandleBytes.get4BytesChunkFromBytes32(ticketsData, 1);
        uint256 totalCost = ticketsCost(ticketTypeID) * ticketAmount;

        require(ticketAmount <= ticketsAvailable(ticketTypeID));
        require(_value >= totalCost);
        require(staxeToken == address(_staxeToken));
        require(staxeToken.transferFrom(_sender, address(this), totalCost));

        _buyWithStaxeToken(_sender, ticketAmount, ticketTypeID);
        return true;
    }

    function ticketTypesCount() public view returns (uint) {
        return tickets.length;
    }

    function ticketsAvailable(uint256 ticketID) public view returns (uint) {
        return tickets[ticketID].available;
    }

    function ticketsCost(uint256 ticketID) public view returns (uint) {
        return tickets[ticketID].cost;
    }

    function ticketsOwnedOfTypeID(address someone, uint256 ticketID) public view returns (uint) {
        return tickets[ticketID].balances[someone];
    }
}