// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./IUniswapV2Router02.sol";
import "./IUniswapV2Factory.sol";
import "./IGRTBilling.sol";
import "./IUniswapV2Pair.sol";
import "./IERC20.sol";              // Cannot use OZ since transfers are non-payable

import "hardhat/console.sol";

/*
      _      _                 
     | |    | |                
   __| | ___| |__   __ _ _ __  
  / _` |/ __| '_ \ / _` | '_ \ 
 | (_| | (__| | | | (_| | | | |
  \__,_|\___|_| |_|\__,_|_| |_|

    Owner: The People          
 */


contract dChanToken is Context, IERC20, Ownable {
    using SafeMath for uint256;
    using Address for address;

    mapping (address => uint256) private _rOwned;
    mapping (address => uint256) private _tOwned;
    mapping (address => mapping (address => uint256)) private _allowances;

    mapping (address => bool) private _isExcludedFromFee;

    mapping (address => bool) private _isExcluded;
    address[] private _excluded;
   
    // ########################## Token Details ##########################
    uint256 private constant MAX = ~uint256(0);
    // 50m Total initial supply, based on 20m average daily 4chan users 
    uint256 private _tTotal = 5000 * 10**4 * 10**9;
    uint256 private _rTotal = (MAX - (MAX % _tTotal));
    uint256 private _tFeeTotal;
    // Set max transaction amount and query checkpoint to .5% of total supply
    uint256 public _maxTxAmount = 25 * 10**4 * 10**9;
    uint256 private numTokensSellToAddToQuery = 50 * 10**9;


    // ########################## Metadata ##########################
    string private _name = "Test Liquidity token";
    string private _symbol = "TEST";
    uint8 private _decimals = 9;
    

    // ########################## Ecosystem Details ##########################
    uint256 public _reflectFeePercent = 4;
    uint256 public _queryFeePercent = 4;
    uint256 public _faucetValue = 1;          // Denominated in gwei
    address public queryPayer;
    address public faucet;
    uint256 private _previousQueryFeePercent = _queryFeePercent;
    uint256 private _previousReflectFeePercent = _reflectFeePercent;


    // ########################## Immutable Details ##########################
    IUniswapV2Router02 public immutable uniswapV2Router;
    address public immutable uniswapV2Pair;
    IGRTBilling immutable billingContract;    
    IERC20 private immutable _grtTokenContract;
    
    
    bool inSwapAndDepositQuery;
    bool public swapAndDepositQueryEnabled = true;
    bool public faucetEnabled = true;
    
    
    // ########################## Subgraph Events ##########################
    event SwapAndDepositQueryEnabledUpdated(bool enabled);
    event SwapAndDepositQuery(uint256 tokensSwapped, uint256 grtDeposited);
    event FaucetFeeChanged(uint256 _newFeeInGwei);
    event FaucetUpdated(address _newFaucet);
    event FaucetEnabled(bool _isEnabled);
    

    modifier lockTheSwap {
        inSwapAndDepositQuery = true;
        _;
        inSwapAndDepositQuery = false;
    }

    
    constructor() {
        
        queryPayer = owner();
        _rOwned[_msgSender()] = _rTotal;
        
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);       // Mainnet Quickswap address
        _grtTokenContract = IERC20(0x5fe2B58c013d7601147DcdD68C143A77499f5531);

        // Will need to call approve() on the billing contract to spend the swapped GRT
        billingContract = IGRTBilling(0xa382f75b375D6a07bfD1af99D4383C6e1D1C4004);                     // Mainnet GRT billing address

        faucet = payable(0xa3b832e52Bc12Df5a5eeb885370Bc9b54D19BC1a);                                  // Faucet

        // Create a uniswap pair for this new token
        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory()).createPair(address(this), _uniswapV2Router.WETH());

        // Set the rest of the contract variables
        uniswapV2Router = _uniswapV2Router;
        
        // Exclude owner and this contract from fee- ownership will be renounced when the network is stable.
        _isExcludedFromFee[owner()] = true;
        _isExcludedFromFee[address(this)] = true;
        
        emit Transfer(address(0), _msgSender(), _tTotal);
        
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _tTotal;
    }

    function balanceOf(address account) public view override returns (uint256) {
        if (_isExcluded[account]) return _tOwned[account];
        return tokenFromReflection(_rOwned[account]);
    }

    function transfer(address recipient, uint256 amount) public payable override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public payable override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
        
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }

    function isExcludedFromReward(address account) public view returns (bool) {
        return _isExcluded[account];
    }

    function totalFees() public view returns (uint256) {
        return _tFeeTotal;
    }

    function deliver(uint256 tAmount) public {
        address sender = _msgSender();
        require(!_isExcluded[sender], "Excluded addresses cannot call this function");
        (uint256 rAmount,,,,,) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rTotal = _rTotal.sub(rAmount);
        _tFeeTotal = _tFeeTotal.add(tAmount);
    }

    function reflectionFromToken(uint256 tAmount, bool deductTransferFee) public view returns(uint256) {
        require(tAmount <= _tTotal, "Amount must be less than supply");
        if (!deductTransferFee) {
            (uint256 rAmount,,,,,) = _getValues(tAmount);
            return rAmount;
        } else {
            (,uint256 rTransferAmount,,,,) = _getValues(tAmount);
            return rTransferAmount;
        }
    }

    function tokenFromReflection(uint256 rAmount) public view returns(uint256) {
        require(rAmount <= _rTotal, "Amount must be less than total reflections");
        uint256 currentRate =  _getRate();
        return rAmount.div(currentRate);
    }

    function excludeFromReward(address account) public onlyOwner {
        // require(account != 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D, 'We can not exclude Uniswap router.');
        require(!_isExcluded[account], "Account is already excluded");
        if(_rOwned[account] > 0) {
            _tOwned[account] = tokenFromReflection(_rOwned[account]);
        }
        _isExcluded[account] = true;
        _excluded.push(account);
    }

    function includeInReward(address account) external onlyOwner {
        require(_isExcluded[account], "Account is already excluded");
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_excluded[i] == account) {
                _excluded[i] = _excluded[_excluded.length - 1];
                _tOwned[account] = 0;
                _isExcluded[account] = false;
                _excluded.pop();
                break;
            }
        }
    }
    
    function excludeFromFee(address account) public onlyOwner {
        _isExcludedFromFee[account] = true;
    }
    
    function includeInFee(address account) public onlyOwner {
        _isExcludedFromFee[account] = false;
    }
    
    function setTaxFeePercent(uint256 taxFee) external onlyOwner {
        _reflectFeePercent = taxFee;
    }

    function setQueryFeePercent(uint256 queryFee) public onlyOwner {
        _queryFeePercent = queryFee;
    }

    function setQueryFeePayer(address _newPayer) public onlyOwner {
        queryPayer = _newPayer;
    }
    
   
    function setMaxTxPercent(uint256 maxTxPercent) external onlyOwner {
        _maxTxAmount = _tTotal.mul(maxTxPercent).div(
            10**2
        );
    }

    function setSwapAndDepositQueryEnabled(bool _enabled) public onlyOwner {
        swapAndDepositQueryEnabled = _enabled;
        emit SwapAndDepositQueryEnabledUpdated(_enabled);
    }

    function setFaucetAddress(address _newFaucet) public onlyOwner {
        faucet = payable(_newFaucet);
        emit FaucetUpdated(_newFaucet);
    }

    function setFaucetFee(uint256 _newFeeInGwei) public onlyOwner {
        _faucetValue = _newFeeInGwei;
        emit FaucetFeeChanged(_newFeeInGwei);
    }

    function setFaucetEnabled(bool _isEnabled) public onlyOwner {
        faucetEnabled = _isEnabled;
        emit FaucetEnabled(_isEnabled);
    }

    //to recieve ETH from uniswapV2Router when swapping
    receive() external payable {}

    function _reflectFee(uint256 rFee, uint256 tFee) private {
        _rTotal = _rTotal.sub(rFee);
        _tFeeTotal = _tFeeTotal.add(tFee);
    }

    function _getValues(uint256 tAmount) private view returns (uint256, uint256, uint256, uint256, uint256, uint256) {
        (uint256 tTransferAmount, uint256 tFee, uint256 tQuery) = _getTValues(tAmount);
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee) = _getRValues(tAmount, tFee, tQuery, _getRate());
        return (rAmount, rTransferAmount, rFee, tTransferAmount, tFee, tQuery);
    }

    function _getTValues(uint256 tAmount) private view returns (uint256, uint256, uint256) {
        uint256 tFee = calculateReflectFee(tAmount);
        uint256 tQuery = calculateQueryFee(tAmount);
        uint256 tTransferAmount = tAmount.sub(tFee).sub(tQuery);
        return (tTransferAmount, tFee, tQuery);
    }

    function _getRValues(uint256 tAmount, uint256 tFee, uint256 tQuery, uint256 currentRate) private pure returns (uint256, uint256, uint256) {
        uint256 rAmount = tAmount.mul(currentRate);
        uint256 rFee = tFee.mul(currentRate);
        uint256 rQuery = tQuery.mul(currentRate);
        uint256 rTransferAmount = rAmount.sub(rFee).sub(rQuery);
        return (rAmount, rTransferAmount, rFee);
    }

    function _getRate() private view returns(uint256) {
        (uint256 rSupply, uint256 tSupply) = _getCurrentSupply();
        return rSupply.div(tSupply);
    }

    function _getCurrentSupply() private view returns(uint256, uint256) {
        uint256 rSupply = _rTotal;
        uint256 tSupply = _tTotal;      
        for (uint256 i = 0; i < _excluded.length; i++) {
            if (_rOwned[_excluded[i]] > rSupply || _tOwned[_excluded[i]] > tSupply) return (_rTotal, _tTotal);
            rSupply = rSupply.sub(_rOwned[_excluded[i]]);
            tSupply = tSupply.sub(_tOwned[_excluded[i]]);
        }
        if (rSupply < _rTotal.div(_tTotal)) return (_rTotal, _tTotal);
        return (rSupply, tSupply);
    }
    

    function _takeQuery(uint256 tQuery) private {
        uint256 currentRate =  _getRate();
        uint256 rQuery = tQuery.mul(currentRate);
        _rOwned[address(this)] = _rOwned[address(this)].add(rQuery);
        if(_isExcluded[address(this)])
            _tOwned[address(this)] = _tOwned[address(this)].add(tQuery);
    }
    
    function calculateReflectFee(uint256 _amount) private view returns (uint256) {
        return _amount.mul(_reflectFeePercent).div(
            10**2
        );
    }

    
    function calculateQueryFee(uint256 _amount) private view returns (uint256) {
        return _amount.mul(_queryFeePercent).div(
            10**2
        );
    }
    
    
    function removeAllFee() private {
        if(_reflectFeePercent == 0 && _queryFeePercent == 0) return;
        
        _previousReflectFeePercent = _reflectFeePercent;
        _previousQueryFeePercent = _queryFeePercent;
        
        _reflectFeePercent = 0;
        _queryFeePercent = 0;
    }
    
    function restoreAllFee() private {
        _reflectFeePercent = _previousReflectFeePercent;
        _queryFeePercent = _previousQueryFeePercent;
    }
    
    function isExcludedFromFee(address account) public view returns(bool) {
        return _isExcludedFromFee[account];
    }

    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _transfer (
        address from,
        address to,
        uint256 amount
    ) private {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        if(from != owner() && to != owner())
            require(amount <= _maxTxAmount, "Transfer amount exceeds the maxTxAmount.");

            // If faucet is enabled, distribute it.
            // Double check how this works with swaps.
            if (faucetEnabled && _msgSender() != address(uniswapV2Router)) {
                console.log("Message Value: ", msg.value);
                require(msg.value >= (_faucetValue * 10**9), "DCHAN: FAUCET_FEE_REQUIRED");
                payable(faucet).transfer(msg.value);
            }

        // is the token balance of this contract address over the min number of
        // tokens that we need to initiate a swap + query deposit?
        // also, don't get caught in a circular swap event.
        // also, don't swap & query if sender is quickswap pair.

        uint256 contractTokenBalance = balanceOf(address(this));

        if(contractTokenBalance >= _maxTxAmount)
        {
            contractTokenBalance = _maxTxAmount;
        }

        bool overMinTokenBalance = contractTokenBalance >= numTokensSellToAddToQuery;

        if (
            overMinTokenBalance &&
            !inSwapAndDepositQuery &&
            from != uniswapV2Pair &&
            swapAndDepositQueryEnabled
        ) {
            contractTokenBalance = numTokensSellToAddToQuery;
            // Collect query fee if we're above the threshold
            swapAndDepositQuery(calculateQueryFee(amount));
        }
        
        //indicates if fee should be deducted from transfer
        bool takeFee = true;

        
        //if any account belongs to _isExcludedFromFee account then remove the fee
        if(_isExcludedFromFee[from] || _isExcludedFromFee[to]){
            takeFee = false;
        }
        
        // Perform the actual transfer
        _tokenTransfer(from,to,amount,takeFee);
    }



    
    function swapAndDepositQuery(uint256 tokenAmount) private lockTheSwap {
        // generate the uniswap pair path of token -> weth
        address[] memory path = new address[](3);
        path[0] = address(this);                        // From token
        path[1] = uniswapV2Router.WETH();              // To MATIC
        path[2] = address(_grtTokenContract);         // to GRT (this ensures the best liquidity)

        // Approve the tokens to be swapped- the tokens are technically held in custody by this contract, and swapped at a critical mass
        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // Make the swap
        uniswapV2Router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            tokenAmount,
            0,                                                                          // accept any amount of GRT
            path,
            address(this),                                                              // Give the tokens to us for deposit      
            block.timestamp
        );
        
        // Get the GRT balance of this contract
        uint256 balance = _grtTokenContract.balanceOf(address(this));
         
        // Approve that to be transferred by the billing contract
        _grtTokenContract.approve(address(billingContract), balance);
        
        // Deposit it into the billing contract
        billingContract.addTo(queryPayer, balance);

        emit SwapAndDepositQuery(tokenAmount, balance);

    }
    



    //this method is responsible for taking all fee, if takeFee is true
    function _tokenTransfer(address sender, address recipient, uint256 amount, bool takeFee) private {
        if(!takeFee)
            removeAllFee();
        
        if (_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferFromExcluded(sender, recipient, amount);
        } else if (!_isExcluded[sender] && _isExcluded[recipient]) {
            _transferToExcluded(sender, recipient, amount);
        } else if (!_isExcluded[sender] && !_isExcluded[recipient]) {
            _transferStandard(sender, recipient, amount);
        } else if (_isExcluded[sender] && _isExcluded[recipient]) {
            _transferBothExcluded(sender, recipient, amount);
        } else {
            _transferStandard(sender, recipient, amount);
        }
        
        if(!takeFee)
            restoreAllFee();
    }

    function _transferStandard(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee, uint256 tQuery) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _takeQuery(tQuery);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferToExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee, uint256 tQuery) = _getValues(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);          
        _takeQuery(tQuery);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferFromExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee, uint256 tQuery) = _getValues(tAmount);
        _tOwned[sender] = _tOwned[sender].sub(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);   
        _takeQuery(tQuery);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }

    function _transferBothExcluded(address sender, address recipient, uint256 tAmount) private {
        (uint256 rAmount, uint256 rTransferAmount, uint256 rFee, uint256 tTransferAmount, uint256 tFee, uint256 tQuery) = _getValues(tAmount);
        _tOwned[sender] = _tOwned[sender].sub(tAmount);
        _rOwned[sender] = _rOwned[sender].sub(rAmount);
        _tOwned[recipient] = _tOwned[recipient].add(tTransferAmount);
        _rOwned[recipient] = _rOwned[recipient].add(rTransferAmount);
        _takeQuery(tQuery);
        _reflectFee(rFee, tFee);
        emit Transfer(sender, recipient, tTransferAmount);
    }


    function renounceOwnership() public override onlyOwner {
        // If renouncing ownership, query fees should be shut off, as API keys could no longer be generated from the paying account.
        setQueryFeePercent(0);
        setQueryFeePayer(address(0));
        setSwapAndDepositQueryEnabled(false);
        setFaucetEnabled(false);
        setFaucetAddress(address(0));
        setFaucetFee(0);
        super.renounceOwnership();
    }


    

}