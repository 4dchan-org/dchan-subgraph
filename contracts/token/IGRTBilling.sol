// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.7;

interface IGRTBilling {
  function acceptOwnership (  ) external;
  function add ( uint256 _amount ) external;
  function addTo ( address _to, uint256 _amount ) external;
  function gateway (  ) external view returns ( address );
  function governor (  ) external view returns ( address );
  function pendingGovernor (  ) external view returns ( address );
  function pull ( address _user, uint256 _amount, address _to ) external;
  function pullMany ( address[] calldata _users, uint256[] calldata _amounts, address _to ) external;
  function remove ( address _user, uint256 _amount ) external;
  function rescueTokens ( address _to, address _token, uint256 _amount ) external;
  function setGateway ( address _newGateway ) external;
  function transferOwnership ( address _newGovernor ) external;
  function userBalances ( address ) external view returns ( uint256 );
}
