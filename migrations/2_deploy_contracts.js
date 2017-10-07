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
	deployer.deploy(InsuranceContract);
};
