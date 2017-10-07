Number.prototype.kwei = function () {
	return web3.toWei(this, "kwei");	// 1000
};
Number.prototype.mwei = function () {
	return web3.toWei(this, "mwei");	// 10^6
};
Number.prototype.gwei = function () {
	return web3.toWei(this, "gwei");	// 10^9
};
Number.prototype.szabo = function () {
	return web3.toWei(this, "szabo");	// 10^12
};
Number.prototype.finney = function () {
	return web3.toWei(this, "finney");	// 10^15
};
Number.prototype.ether = function () {
	return web3.toWei(this, "ether");	// 10^18
};
Number.prototype.einstein = function () {
	return web3.toWei(this, "grand");	// 10^21
};

module.exports = function(deployer) {
	var InsuranceContract = artifacts.require("./HouseholdInsurance.sol");
	deployer.deploy(
		InsuranceContract,
		[
			0x01000, // zone 1
			0x02000, // zone 2
			0x03000, // zone 3
			0x04000, // zone 4
			0x05000  // zone 5
		],
		[
			11..finney(), // price for zone 1
			12..finney(), // price for zone 2
			13..finney(), // price for zone 3
			14..finney(), // price for zone 4
			15..finney()  // price for zone 5
		]
	);

};
