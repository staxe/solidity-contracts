// @copyright defined in solidity-contracts/LICENSE

pragma solidity ^0.4.24;

contract StaxeDistribution {

    constructor() public {
    }

    function sharesStaxeHolders(
        uint fundRaised,
        uint totalRaised,
        uint[] providersAddress,
        uint[] pctProviders,
        uint[] staxeHoldersAddress,
        uint[] staxeHoldersAmountInvested
    )   
        public
        pure
        returns (uint[],uint[])
    {
        require((providersAddress.length - pctProviders.length) == 0);
        require((staxeHoldersAddress.length - staxeHoldersAmountInvested.length) == 0);
        //00.00000000%
        uint256 pctPrecision = 10 ** 8;
        uint256[] memory whoToPay = new uint256[](staxeHoldersAddress.length + providersAddress.length);
        uint256[] memory tokensToPay = new uint256[](staxeHoldersAddress.length + providersAddress.length);

        uint256 pctRemaining = 100 * pctPrecision;

        for (uint256 j = 0; j < pctProviders.length; j++) {
            //without rounding
            //tokensToPay[j] = pctProviders[j] * totalRaised / (100 * pctPrecision);
            //with Rounding 6 places
            tokensToPay[j] = pctProviders[j] * totalRaised / (100 * pctPrecision * (10 ** 12)) * (10**12);
            whoToPay[j] = providersAddress[j];
            pctRemaining -= pctProviders[j];
        }

        for (uint256 i = 0; i < staxeHoldersAddress.length; i++) {
            uint256 pctTotalShares = (staxeHoldersAmountInvested[i] * pctRemaining) / fundRaised;
            //without rounding
            //tokensToPay[i + providersAddress.length] = pctTotalShares * totalRaised / (100 * pctPrecision);
            tokensToPay[i + providersAddress.length] = pctTotalShares * totalRaised / (100 * pctPrecision * (10 ** 12)) * (10**12);
            whoToPay[i + providersAddress.length] = staxeHoldersAddress[i];
        }
        return (whoToPay, tokensToPay);
    }

    function ceil(uint a, uint m) internal pure returns (uint ) {
        return ((a + m - 1) / m) * m;
    }
}