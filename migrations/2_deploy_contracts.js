module.exports = function(deployer) {
	var InsuranceContract = artifacts.require("./EverydayInsurance.sol");
	deployer.deploy(InsuranceContract);

};
