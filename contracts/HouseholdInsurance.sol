pragma solidity 0.4.15;

// HouseholdInsurance defines a typical contract between an insurer, investor and insuree
// for a household insurance product
contract HouseholdInsurance {
	// policy settings including property details
	struct Policy {
		// an unique id which defines this policy
		uint id;

		// area of the house/apartment in square meters
		uint area;

		// identifies location of the property, can be a zip code
		uint zoneId;

		// total premium paid according to contract
		uint premium;

		// maximum amount to be paid to ensurer if a loss occur
		uint coverage;

		// amount already claimed by insurer to insuree
		uint claimed;
	}

	// a claim, contains all the data required to approve/reject a claim
	struct Claim {
		// an unique id which defines this claim
		uint id;

		// an amount to cover, must not exceed policy coverage (optional)
		uint amount;

		// a reason id in case if a claim was rejected
		uint reason;
	}

	// insurance fees and investments are accepted
	// only before "offset" date (set-up period)
	uint public offset; // unix timestamp

	// claims from insurees are accepted
	// only after "offset" has passed and
	// only during "length" period of time (main aka claim period)
	// investors' rewards are paid after (reward period)
	uint public length; // unix timestamp

	// an insurer, owner of this contract
	address public insurer;

	// investors' balances
	mapping(address => uint) public balances;

	// insurees' contract details
	mapping(address => Policy) policies;

	// unresolved claims, nor approved, neither rejected
	mapping(address => Claim) claims;

	// total amount of wei all the investors invested
	uint public totalInvested;

	// total number of investors
	uint public totalInvestors;

	// total number of insurees
	uint public totalInsurees;

	// total insured area
	uint public totalArea;

	// total premium paid by insurees
	uint public totalPremium;

	// total coverage, total amount to claim by insurees
	uint public totalCoverage;

	// total amount of claims submitted, including approved and rejected
	uint public totalClaims;

	// total amount payed back to insurees
	uint public totalAmountClaimed;

	// number of claims approved
	uint public claimsApproved;

	// number of claims rejected
	uint public claimsDeclined;

	// during setup period contract accepts investments
	// and insurance contract signing
	modifier __setup {
		// perform validations
		// we're in setup state
		// main period didn't start yet
		assert(stateCode() == 0);

		// function execution block
		_;
	}

	// during main period contract accepts claims
	// it allows an insurer to accept / reject them
	modifier __main {
		// perform validations
		// we're in the main (claim) period
		// main period started and didn't finish yet
		assert(stateCode() == 1);

		// function execution block
		_;
	}

	// during the reward period contract allows
	// investors to get their investments and shares back
	modifier __reward {
		// perform validations
		// we're in reward period
		// main period ended
		assert(stateCode() == 2);

		// function execution block
		_;
	}

	function HouseholdInsurance(uint _offset, uint _length) {
		// validate insurance settings (inputs)
		// offset must be in the future,
		// otherwise no investment/insurance possible
		require(_offset > 0);
		// length must be positive
		require(_length > 0);

		// setup contract settings
		offset = _offset;
		length = _length;

		// set up the insurer - creator of the contract
		insurer = msg.sender;
	}

	// client entrance (insuree)
	// sign of an insurance contract
	// (buying an insurance product)
	function insure(uint id, uint area, uint zoneId, uint premium, uint coverage) __setup payable {
		// crate a policy
		Policy storage policy = __policy(id, area, zoneId, premium, coverage);

		// call sender gracefully, an insuree
		address insuree = msg.sender;

		// how much wei we've received with the message
		uint value = msg.value;

		// additional validations
		// not already insuree
		assert(policies[insuree].id == 0);
		// we should have received not less then premium specified
		require(value >= premium);

		// assign policy to a client (insuree)
		policies[insuree] = policy;

		// probably we need to return some money back, how much?
		uint delta = value - premium;

		// update status
		totalInsurees++;
		totalArea += area;
		totalPremium += premium;
		totalCoverage += coverage;

		// transfer the delta back to insuree
		insuree.transfer(delta);
	}

	// client entrance (insuree)
	// submit a claim
	function claim(uint id, uint amount) __main {
		// create a claim
		Claim storage _claim = __claim(id, amount);

		// call sender gracefully, an insuree
		address insuree = msg.sender;

		// additional validations
		// a policy exists for the insuree
		assert(policies[insuree].id != 0);
		// only one pending claim is allowed
		assert(claims[insuree].id == 0);
		// claim amount cannot exceed policy coverage
		require(amount <= policies[insuree].coverage);

		// assign claim to a client (insuree)
		claims[insuree] = _claim;

		// update status
		totalClaims++;
	}


	// insurer entrance
	// submit a claim on behalf of insuree
	function claimFor(address insuree, uint id, uint amount) __main {
		// perform validations
		// only insurer can make an approve
		assert(msg.sender == insurer);

		// create a claim
		Claim storage _claim = __claim(id, amount);

		// additional validations
		// a policy exists for the insuree
		assert(policies[insuree].id != 0);
		// only one pending claim is allowed
		assert(claims[insuree].id == 0);
		// claim amount cannot exceed policy coverage
		require(amount <= policies[insuree].coverage);

		// assign claim to a client (insuree)
		claims[insuree] = _claim;

		// update status
		totalClaims++;
	}

	// insurer entrance
	// approve a claim
	function approve(address insuree) __main {
		// perform validations
		// only insurer can make an approve
		assert(msg.sender == insurer);

		// find insuree policy
		Policy storage policy = policies[insuree];
		// calculate how much coverage to pay
		uint amount = policy.coverage - policy.claimed;

		// additional validations
		// policy for this insuree must exist
		assert(policy.id != 0);
		// unresolved claim should exist
		assert(claims[insuree].id != 0);
		// there should be enough coverage left on the policy
		assert(amount > 0);
		// overflow check
		assert(amount <= policy.coverage);

		// update policy
		policy.claimed += amount;

		// delete the claim to be satisfied
		delete(claims[insuree]);

		// update status
		claimsApproved++;
		totalAmountClaimed += amount;

		// transfer the coverage (amount)
		insuree.transfer(amount);
	}

	// insurer entrance
	// decline a claim
	function decline(address insuree, uint reason) __main {
		// perform validations
		// only insurer can make a reject
		assert(msg.sender == insurer);
		// reason must be set
		require(reason > 0);
		// policy must exist
		assert(policies[insuree].id != 0);
		// claim must exist
		assert(claims[insuree].id != 0);

		// update claim
		claims[insuree].reason = reason;

		// update status
		claimsDeclined++;
	}


	// investor entrance
	// make an investment
	function invest() __setup payable {
		// call sender gracefully, an investor
		address investor = msg.sender;

		// how much wei we've received with the message
		uint value = msg.value;

		// current investor balance
		uint current = balances[investor];

		// new balance
		uint balance = current + value;

		// new total invested
		uint total = totalInvested + value;

		// additional validations
		// overflow checks
		assert(balance > current);
		assert(total > totalInvested);

		// update investors' balance accordingly
		balances[investor] = balance;

		// update status
		totalInvested = total;
		totalInvestors++;
	}

	// investor entrance
	// take an investment and profit back
	function withdraw() __reward {
		// perform validations
		// there is still some wei on the contract
		assert(this.balance > 0);

		// call sender gracefully, an investor
		address investor = msg.sender;

		// get total amount investor invested
		uint invested = balances[investor];

		// additional validations
		// the sender is a real investor
		// and didn't picked up the wei back yet
		assert(invested > 0);

		// calculate the share
		uint share = totalInvested / invested * this.balance;

		// update investor's balance
		balances[investor] = 0;

		// transfer the share
		investor.transfer(share);
	}

	// calculates how much weir an investor can
	// get back after main period passed (reward period)
	function share() constant returns(uint) {
		// call sender gracefully, an investor
		address investor = msg.sender;

		// get total amount investor invested
		uint invested = balances[investor];

		// calculate the share
		return totalInvested / invested * this.balance;
	}

	// get current state of the contract
	function state() constant returns (string) {
		// get the state code
		uint code = stateCode();

		// setup period is where investments and insurees are welcome
		if(code == 0) {
			return "setup: accepting investments";
		}
		// main period is where investmenets are not accepted anymore
		// insurees may submit their claims and insurer may approve or reject them
		else if(code == 1) {
			return "main: accepting claims";
		}
		// reward period is where investors get their rewards
		else {
			return "reward: paying rewards to investors";
		}
	}

	/*
		// production mode
		// 0 - setup
		// 1 - main
		// 2 - reward
		function stateCode() constant returns(uint) {
			if(now < offset) {
				return 0;
			}
			else if(now - offset < length) {
				return 1;
			}
			else {
				return 2;
			}
		}
	*/

	// testing mode
	// 0 - setup
	// 1 - main
	// 2 - reward
	function stateCode() constant returns(uint) {
		if(totalInvestors == 0 || totalInsurees == 0) {
			return 0;
		}
		else if(claimsApproved == 0 && claimsDeclined == 0) {
			return 1;
		}
		else {
			return 2;
		}
	}


	// ----------------------- internal section -----------------------

	// allocates a Policy structure in storage
	function __policy(
		uint _id,
		uint _area,
		uint _zoneId,
		uint _premium,
		uint _coverage
	) internal returns(Policy storage policy) {
		// validate the settings
		// id must be set
		require(_id > 0);
		// area size must be positive
		require(_area > 0);
		// premium must be positive
		require(_premium > 0);
		// coverage must be greater then premium
		require(_coverage > _premium);


		// set up the fields
		policy.id = _id;
		policy.area = _area;
		policy.zoneId = _zoneId;
		policy.premium = _premium;
		policy.coverage = _coverage;
	}

	// allocates a Claim in storage
	function __claim(uint _id, uint _amount) internal returns(Claim storage _claim) {
		// claim id defined
		require(_id > 0);
		// amount claimed must be positive
		require(_amount > 0);

		// set up the fields
		_claim.id = _id;
		_claim.amount = _amount;
	}

	function __min(uint a, uint b) internal returns(uint min) {
		min = a < b ? a : b;
	}

	// ----------------------- internal section -----------------------

}
