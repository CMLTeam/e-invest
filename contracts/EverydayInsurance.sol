pragma solidity 0.4.15;

// EverydayInsurance defines a typical contract between an insurer, investor and insured
contract EverydayInsurance {
	// insured specific contract data
	struct ContractDetails {

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

	mapping(address => uint) investors;
	mapping(address => ContractDetails) insured;

	function EverydayInsurance() {
	}

	// client entrance (insured)
	// sign of an insurance contract
	// (buying an insurance product)
	function insure() payable {
		// perform validations
		assert(now < offset); // main period didn't start yet

		// call sender gracefully, an insured
		address insured = msg.sender;

		// TODO: implement logic
	}

	// client entrance (insured)
	// submit a claim
	function claim() {
		// perform validations
		assert(now >= offset && now < offset + length); // main period

		// call sender gracefully, an insured
		address insured = msg.sender;

		// TODO: implement logic
	}


	// insurer entrance
	// approve a claim
	function approve() {
		// perform validations
		assert(now >= offset && now < offset + length); // main period

		// TODO: implement logic
	}

	// insurer entrance
	// decline a claim
	function decline() {
		// perform validations
		assert(now >= offset && now < offset + length); // main period

		// TODO: implement logic
	}


	// investor entrance
	// make an investment
	function invest() {
		// perform validations
		assert(now < offset); // main period didn't start yet

		// TODO: implement logic
	}

	// investor entrance
	// take an investment and profit back
	function pick() {
		// perform validations
		assert(now >= offset + length); // main period ended

		// TODO: implement logic
	}

}
