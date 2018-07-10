// @copyright defined in solidity-contracts/LICENSE

pragma solidity ^0.4.18;

import "./StaxeSale.sol";
import "./StaxeTicketing.sol";


contract StaxePlatform {
    StaxeToken public staxeToken;
    Staxe[] public staxes;
    uint128[] public ticketTypesID;
    uint128[] public ticketTypesAvailable;
    uint256[] public ticketTypesCost;

    event StaxeCreated(uint staxeID, string eventName, address staxeSale, address staxeTicketing);

    struct Staxe {
        address owner;
        uint createdAt;
        int256 latitude;
        int256 longitude;
        string name;
        address staxeSale;
        address ticketing;
    }

    function StaxePlatform(StaxeToken _staxeToken) public {
        staxeToken = _staxeToken;
    }

    // Accept ether in contract
    function () external payable {}

    function getTokenAddress() public constant returns (address) {
        return staxeToken;
    }

    function createStaxe(
        string _name,
        uint _goal,
        uint _start,
        uint _deadline,
        int256 _latitude,
        int256 _longitude,
        uint128[] _ticketTypesID,
        uint128[] _ticketTypesAvailable,
        uint256[] _ticketTypesCost
        ) 
        public returns (uint) {
        require(_deadline > block.timestamp);
        
        ticketTypesID = _ticketTypesID;
        ticketTypesAvailable = _ticketTypesAvailable;
        ticketTypesCost = _ticketTypesCost;

        address ticketingContract = new StaxeTicketing(
            address(staxeToken),
            _ticketTypesID,
            _ticketTypesAvailable,
            _ticketTypesCost
        );

        uint256 staxeID = staxes.length++;
        address staxeSale = new StaxeSale(
            staxeToken,
            _goal,
            _start,
            _deadline
        );
        staxes[staxeID] = Staxe({
            owner: msg.sender,
            name: _name,
            createdAt: block.timestamp,
            latitude: _latitude,
            longitude: _longitude,
            staxeSale: staxeSale,
            ticketing: ticketingContract
        });
        
        StaxeCreated(staxeID, _name, staxeSale, ticketingContract);
        return staxeID;
    }

    function getStaxesCount() public constant returns (uint) {
        return staxes.length;
    }

    function getStaxeName(uint _staxeID) public constant returns (string) {
        return staxes[_staxeID].name;
    }

    function getStaxeGoal(uint _staxeID) public constant returns (uint) {
        return StaxeSale(staxes[_staxeID].staxeSale).getGoal();
    }

    function getStaxeCreationTimestamp(uint _staxeID) public constant returns (uint) {
        return staxes[_staxeID].createdAt;
    }

    function getStaxeSaleStart(uint _staxeID) public constant returns (uint) {
        return StaxeSale(staxes[_staxeID].staxeSale).getStartTime();
    }

    function getStaxeDeadline(uint _staxeID) public constant returns (uint) {
        return StaxeSale(staxes[_staxeID].staxeSale).getDeadline();
    }

    function getStaxeLocation(uint _staxeID) public constant returns (int256, int256) {
        return (staxes[_staxeID].latitude, staxes[_staxeID].longitude);
    }

    function getStaxeSaleAddress(uint _staxeID) public constant returns (address) {
        return staxes[_staxeID].staxeSale;
    }

    function getStaxeSaleAmountRaised(uint _staxeID) public constant returns (uint) {
        return StaxeSale(staxes[_staxeID].staxeSale).getAmountRaised();
    }

    function sharesOf(uint _staxeID, address _investor) public constant returns (uint) {
        return StaxeSale(staxes[_staxeID].staxeSale).balanceOf(_investor);
    }
}