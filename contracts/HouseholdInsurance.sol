pragma solidity 0.4.15;

// HouseholdInsurance defines a typical contract between an insurer, investor and insured
// for a household insurance product
contract HouseholdInsurance {
	// policy settings including property details
	struct Policy {
		// area of the house/apartment in square meters
		uint area;

		// identifies a location of the property, can be a zip code
		uint zoneId;

		// total premium payed according to contract
		uint premium;

		// maximum amount to be payed to ensurer if a loss occur
		uint coverage;
	}

	// profile of the insured:
	// policy settings, current status, etc.
	struct Insured {

	}

	// insurance fees and investments are accepted
	// only before "offset" date (set-up period)
	uint offset; // unix timestamp

	// claims from insured are accepted
	// only after "offset" has passed and
	// only during "length" period of time (main aka claim period)
	// investors' rewards are payed after (reward period)
	uint length; // unix timestamp

	address insurer;

	// list of investors with their investment values
	mapping(address => uint) public balances;

	// total amount of wei all the investors invested
	uint public totalInvested;

	// list of insured with their contract details
	mapping(address => Policy) policies;


	function HouseholdInsurance() {
		// validate insurance settings (inputs)


	}

	// client entrance (insured)
	// sign of an insurance contract
	// (buying an insurance product)
	function insure(uint _area, uint _zoneId, uint _premium, uint _coverage) payable {
		// perform validations
		// main period didn't start yet
		assert(now < offset);
		// area size must be positive
		require(_area > 0);
		// premium must be positive
		require(_premium > 0);
		// coverage must be greater then premium
		require(_coverage > _premium);

		// call sender gracefully, an insured
		address insured = msg.sender;

		// how much wei we've received with the message
		uint value = msg.value;

		// additional validations
		// not already insured
		require(policies[insured].area == 0);
		// we should have received not less then premium specified
		require(value >= _premium);

		// crate a policy
		Policy policy = __policy(_area, _zoneId, _premium, _coverage);

		// assign policy to a client (insured)
		policies[insured] = policy;

		// probably we need to return some money back, how much?
		uint delta = value - _premium;

		// transfer the delta back to insured
		insured.transfer(delta);
	}

	// client entrance (insured)
	// submit a claim
	function claim() {
		// perform validations
		// main period
		assert(now >= offset && now < offset + length);

		// call sender gracefully, an insured
		address insured = msg.sender;

		// TODO: implement logic
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

		// calculate the investor's share
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

	// fallback function
	function() payable {

	}


	// ----------------------- internal section -----------------------

	// allocates a Policy structure in storage
	function __policy(
		uint _area,
		uint _zoneId,
		uint _premium,
		uint _coverage
	) internal returns(Policy storage policy) {
		policy.area = _area;
		policy.zoneId = _zoneId;
		policy.premium = _premium;
		policy.coverage = _coverage;
	}

	// ----------------------- internal section -----------------------

}
