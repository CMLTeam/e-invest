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

		// identifies a location of the property, can be a zip code
		uint zoneId;

		// total premium paid according to contract
		uint premium;

		// maximum amount to be paid to ensurer if a loss occur
		uint coverage;
	}

	// a claim, contains all the data required to approve/reject a claim
	struct Claim {
		// an unique id which defines this claim
		uint id;

		// an amount to cover, must not exceed policy coverage (optional)
		uint amount;
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
	address insurer;

	// investors' balances
	mapping(address => uint) public balances;

	// insurees' contract details
	mapping(address => Policy) policies;

	// unresolved claims, nor approved, neither rejected
	mapping(address => Claim) claims;

	// total amount of wei all the investors invested
	uint public totalInvested;

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
	uint public claimsRejected;

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
	function insure(uint id, uint area, uint zoneId, uint premium, uint coverage) payable {
		// perform validations
		// main period didn't start yet
		assert(now < offset);

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
	function claim(uint id, uint amount) {
		// perform validations
		// main period
		assert(now >= offset && now < offset + length);

		// create a claim
		Claim storage claim = __claim(id, amount);

		// call sender gracefully, an insuree
		address insuree = msg.sender;

		// additional validations
		// a policy exists for the insuree
		assert(policies[insuree].id != 0);
		// only one pending claim is allowed
		assert(claims[insuree].id == 0);

		// assign claim to a client (insuree)
		claims[insuree] = claim;
	}


	// insurer entrance
	// approve a claim
	function approve() {
		// perform validations
		assert(now >= offset && now < offset + length); // main period
		require(msg.sender == insurer); // only insurer can make an approve
		// TODO: implement logic
	}

	// insurer entrance
	// decline a claim
	function decline() {
		// perform validations
		assert(now >= offset && now < offset + length); // main period
		require(msg.sender == insurer); // only insurer can make a reject

		// TODO: implement logic
	}


	// investor entrance
	// make an investment
	function invest() payable {
		// perform validations
		// main period didn't start yet
		assert(now < offset);

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

		// update total investments counter
		totalInvested = total;
	}

	// investor entrance
	// take an investment and profit back
	function pick() {
		// perform validations
		// main period ended
		assert(now >= offset + length);
		// there is still some wei on the contract
		assert(this.balance > 0);

		// call sender gracefully, an investor
		address investor = msg.sender;

		// get total amount investor invested
		uint invested = balances[investor];

		// additional validations
		// the sender is a real investor
		// and didn't picked up the wei back yet
		require(invested > 0);

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
		// setup period is where investments and insurees are welcome
		if(now < offset) {
			return "setup: accepting investments";
		}
		// main period is where investmenets are not accepted anymore
		// insurees may submit their claims and insurer may approve or reject them
		else if(now < offset + length) {
			return "main: accepting claims";
		}
		// reward period is where investors get their rewards
		else {
			return "reward: paying rewards to investors";
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
	function __claim(uint _id, uint _amount) internal returns(Claim storage claim) {
		// claim id defined
		require(_id > 0);
		// amount claimed must be positive
		require(_amount > 0);

		// set up the fields
		claim.id = _id;
		claim.amount = _amount;
	}

	// ----------------------- internal section -----------------------

}
