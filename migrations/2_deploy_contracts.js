'use strict';

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

// define insurance contract settings
var offset = (Date.now() / 1000 | 0) + 120;
var length = 120;
console.log("offset: " + offset);
console.log("length: " + length);

module.exports = async function(deployer) {
	let InsuranceContract = artifacts.require("./HouseholdInsurance.sol");
	await deployer.deploy(InsuranceContract, offset, length);
/*
	let instance = InsuranceContract.at(InsuranceContract.address);
	let val = await instance.state();
	console.log("instance state:" + val);
	await instance.insure(0x01, 50, 0, 100, 5000, {value: 100});
	console.log("insurance performed");
	display_balance();
	val = await instance.state();
	console.log(val);
	await instance.invest({value: 10000});
	display_balance();
	val = await instance.state();
	console.log(val);
	instance.claim(0x01, 5000);
	val = await instance.state();
	console.log(val);
	await instance.decline('0x7e5f4552091a69125d5dfcb7b8c2659029395bdf', 0x01);
	display_balance();
	val = await instance.state();
	console.log(val);
	await instance.withdraw();
	display_balance();
	val = await instance.state();
	console.log(val);
*/

	function display_balance() {
		web3.eth.getBalance(InsuranceContract.address, function(err, val) {
			console.log("balance: " + val.toString(10));
		});
	}
};
