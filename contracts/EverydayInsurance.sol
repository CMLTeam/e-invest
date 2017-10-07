pragma solidity 0.4.15;

// EverydayInsurance defines a typical contract between an insurer, investor and insured
contract EverydayInsurance {
	// insured specific contract data
	struct ContractDetails {

	}

	address insurer;

	mapping(address => uint) investors;
	mapping(address => ContractDetails) insured;

	function EverydayInsurance() {
	}


}
