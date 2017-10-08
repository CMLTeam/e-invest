//var address = '0x662a8439045d73cfc5a7e15ce651e6b63ec24c9f';
var address = '0x63d3d65321e7a561745b809f61bf923f828e5b19'; // window.location.search;
var inputAddress = '0x03cdA1F3DEeaE2de4C73cfC4B93d3A50D0419C24';
var ethToEuro = 261.592;

var abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "id",
                "type": "uint256"
            },
            {
                "name": "area",
                "type": "uint256"
            },
            {
                "name": "zoneId",
                "type": "uint256"
            },
            {
                "name": "premium",
                "type": "uint256"
            },
            {
                "name": "coverage",
                "type": "uint256"
            }
        ],
        "name": "insure",
        "outputs": [],
        "payable": true,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "length",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "claimsApproved",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "balances",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalInvestors",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalInsurees",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalClaims",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalPremium",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalInvested",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "insuree",
                "type": "address"
            },
            {
                "name": "id",
                "type": "uint256"
            },
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "claimFor",
        "outputs": [],
        "payable": false,
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "insuree",
                "type": "address"
            },
            {
                "name": "reason",
                "type": "uint256"
            }
        ],
        "name": "decline",
        "outputs": [],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "stateCode",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "share",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalAmountClaimed",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "state",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "id",
                "type": "uint256"
            },
            {
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "claim",
        "outputs": [],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalArea",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalCoverage",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "offset",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "insuree",
                "type": "address"
            }
        ],
        "name": "approve",
        "outputs": [],
        "payable": false,
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "invest",
        "outputs": [],
        "payable": true,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "claimsDeclined",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_offset",
                "type": "uint256"
            },
            {
                "name": "_length",
                "type": "uint256"
            }
        ],
        "payable": false,
        "type": "constructor"
    }
];

function getContract() {
    return web3.eth.contract(abi).at(address);
}

function eurToEth(val) {
    return val / ethToEuro;
}

function ethToEur(val) {
    return val * ethToEuro;
}

function eurToWei(val) {
    var eth = eurToEth(val);
    return web3.toWei(eth, "ether");
}

function weiToEur(val) {
    var eth = web3.fromWei(val, "ether");
    return ethToEur(eth);
}

function getInsuranceDataFromBlockchain(callback) {
// Total Insurees
    var smartContract = getContract();

    smartContract.totalInsurees(function(e, r) {
        if(!e) {
            var insureeCount = r.toString(10);
            console.log("insureeCount:" + insureeCount);
            smartContract.totalArea(function(e, r) {
                if(!e) {
                    var totalArea = r.toString(10);
                    console.log("totalArea:" + totalArea);
                    smartContract.totalPremium(function(e, r) {
                        if(!e) {
                            var totalPremium = r.toString(10);
                            console.log("totalPremium:" + totalPremium);
                            smartContract.totalCoverage(function(e, r) {
                                if(!e) {
                                    var totalCoverage = r.toString(10);
                                    console.log("totalCoverage:" + totalCoverage);
                                    smartContract.totalInvested(function(e, r) {
                                        if(!e) {
                                            var totalInvested = r.toString(10);
                                            console.log("totalInvested:" + totalInvested);
                                            smartContract.totalInvestors(function(e, r) {
                                                if(!e) {
                                                    var totalInvestors = r.toString(10);
                                                    console.log("totalInvestors:" + totalInvestors);
                                                    if(insureeCount > 0) {
                                                        var avgHouseArea = totalArea / insureeCount;
                                                        var avgPremium = totalPremium / insureeCount;
                                                        var avgCoverage = totalCoverage / insureeCount;
                                                        callback({
                                                            insureeCount: insureeCount,
                                                            avgHouseArea: avgHouseArea,
                                                            avgPremium: weiToEur(avgPremium),
                                                            avgCoverage: weiToEur(avgCoverage),
                                                            totalPremium: weiToEur(totalPremium),
                                                            totalCoverage: weiToEur(totalCoverage),
                                                            totalInvestment: weiToEur(totalInvested),
                                                            totalInvestors: totalInvestors
                                                        });
                                                    }
                                                    else {
                                                        console.warn("insureeCount = 0!");
                                                    }
                                                }
                                                else {
                                                    console.error(e);
                                                }
                                            });
                                        }
                                        else {
                                            console.error(e);
                                        }
                                    });
                                }
                                else {
                                    console.error(e);
                                }
                            });
                        }
                        else {
                            console.error(e);
                        }
                    });
                }
                else {
                    console.error(e);
                }
            });
        }
        else {
            console.error(e);
        }
    });
}
/*

var balances = -1;
web3.eth.contract(abi).at(address).balances(inputAddress, function (e, r) {
    if(!e) {
        balances = r.toString(10);
        console.log(balances);
    } else {
        console.error(e);
    }
})*/

var web3Promise = new Promise(function (resolve, reject) {
    window.addEventListener('load', function() {
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
            resolve(web3);
        }
        else {
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
            reject();
        }
    });
});