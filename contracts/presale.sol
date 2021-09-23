// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Presale is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

	/* the maximum amount of tokens to be sold */ 
	uint256 constant maxGoal = 140000 * (10**9) * 10**9;
	/* how much has been raised by crowdale (in ETH) */
	uint256 public amountRaised;
	/* how much has been raised by crowdale (in PartyDoge) */
	uint256 public amountRaisedPartyDoge;

	/* the start & end date of the crowdsale */
	uint256 public start;
	uint256 public deadline1;
	uint256 public endOfICO;
	uint256 public deadline2;
	uint256 public deadline3;



	/* there are different prices in different time intervals  decimal 10**9 */ 
	uint256 constant price = 66  * 10**10;

	/* the address of the token contract */
	IERC20 private tokenReward;
	
	/* the balances (in ETH) of all investors */
	mapping(address => uint256) public balanceOf;
	/* the balances (in PAYR) of all investors */
	mapping(address => uint256) public balanceOfPartyDoge;
	/* indicates if the crowdsale has been closed already */
	bool public presaleClosed = false;
	/* notifying transfers and the success of the crowdsale*/
	event GoalReached(address beneficiary, uint256 amountRaised);
	event FundTransfer(address backer, uint256 amount, bool isContribution, uint256 amountRaised);

    /*  initialization, set the token address */
    constructor(IERC20 _token, uint256 _start, uint256 _dead1, uint256 _dead2, uint256 _dead3, uint256 _end) {
        tokenReward = _token;
		start = _start;
		deadline1 = _dead1;
		deadline2 = _dead2;
		deadline3 = _dead3;
		endOfICO = _end;
	
    }

    /* invest by sending ether to the contract. */
    receive () external payable {
		if(msg.sender != owner()) //do not trigger investment if the multisig wallet is returning the funds
        	invest();
		else revert();
    }

	function checkFunds(address addr) external view returns (uint256) {
		return balanceOf[addr];
	}

	function checkPartyDogeFunds(address addr) external view returns (uint256) {
		return balanceOfPartyDoge[addr];
	}

	function getBNBBalance() external view returns (uint256) {
		return address(this).balance;
	}

    /* make an investment
    *  only callable if the crowdsale started and hasn't been closed already and the maxGoal wasn't reached yet.
    *  the current token price is looked up and the corresponding number of tokens is transfered to the receiver.
    *  the sent value is directly forwarded to a safe multisig wallet.
    *  this method allows to purchase tokens in behalf of another address.*/
    function invest() public payable {
    	uint256 amount = msg.value;
		require(presaleClosed == false && block.timestamp >= start && block.timestamp < deadline3, "Presale is closed");
		require(msg.value >= 2 * 10**8, "Fund is less than 0.2 BNB");

		balanceOf[msg.sender] = balanceOf[msg.sender].add(amount);
		//require(balanceOf[msg.sender] <= 2 * 10**8, "Fund is more than 2 BNB");
		uint256 partyDogePrice = getPresalePrice();
		amountRaised = amountRaised.add(amount);

		balanceOfPartyDoge[msg.sender] = balanceOfPartyDoge[msg.sender].add(amount.mul(partyDogePrice));
		amountRaisedPartyDoge = amountRaisedPartyDoge.add(amount.mul(partyDogePrice));

		if (amountRaisedPartyDoge >= maxGoal) {
			presaleClosed = true;
			emit GoalReached(msg.sender, amountRaised);
		}
		
        emit FundTransfer(msg.sender, amount, true, amountRaised);
    }

    modifier afterClosed() {
        require(block.timestamp >= endOfICO, "Distribution is off.");
        _;
    }

	function getPresalePrice() public view returns (uint256){
		if(block.timestamp > start && block.timestamp < deadline1 )
			return price.mul(4).div(3);   // 25% discount for first step
		if(block.timestamp > deadline1 && block.timestamp < deadline2 )
			return price.mul(5).div(4);   // 25% discount for first step
		if(block.timestamp > deadline1 && block.timestamp < deadline2 )
			return price.mul(20).div(17);   // 25% discount for first step
		return price;
	}
	function getPartyDoge() external afterClosed nonReentrant {
		require(balanceOfPartyDoge[msg.sender] > 0, "Zero BNB contributed.");
		uint256 amount = balanceOfPartyDoge[msg.sender];
		uint256 balance = tokenReward.balanceOf(address(this));
		require(balance >= amount, "Contract has less fund.");
		balanceOfPartyDoge[msg.sender] = 0;
		tokenReward.transfer(msg.sender, amount);
	}

	function withdrawETH() external onlyOwner afterClosed {
		uint256 balance = this.getBNBBalance();
		require(balance > 0, "Balance is zero.");
		address payable payableOwner = payable(owner());
		payableOwner.transfer(balance);
	}

	function withdrawPartyDoge() external onlyOwner afterClosed{
		uint256 balance = tokenReward.balanceOf(address(this));
		require(balance > 0, "Balance is zero.");
		tokenReward.transfer(owner(), balance);
	}
}