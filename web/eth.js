//var address = '0x662a8439045d73cfc5a7e15ce651e6b63ec24c9f';
var address = '0x810658c6bfb88f3812eccf5c11ea39b54158a888';
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
        "constant": false,
        "inputs": [],
        "name": "approve",
        "outputs": [],
        "payable": false,
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "claimsRejected",
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
        "constant": false,
        "inputs": [],
        "name": "pick",
        "outputs": [],
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
        "constant": false,
        "inputs": [],
        "name": "decline",
        "outputs": [],
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
        "inputs": [],
        "name": "invest",
        "outputs": [],
        "payable": true,
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

function getInsuranceDataFromBlockchain() {
// Total Insurees

    var insureeCount = 0;

    var smartContract = web3.eth.contract(abi).at(address);
    smartContract.totalInsurees(function (e, r) {
        if (!e) {
            insureeCount = r.toString(10);
        }
        else {
            console.error(e);
        }
    });

// Avg House Area

    var avgHouseArea = 0;
    var totalArea = 0;

    smartContract.totalArea(function (e, r) {
        if (!e) {
            totalArea = r.toString(10);
        } else {
            console.error(e);
        }
    });

// Average Premium

    var totalPremium = 0;
    var avgPremium = 0;

    smartContract.totalPremium(function (e, r) {
        if (!e) {
            totalPremium = ethToEuro * r.toString(10);
        } else {
            console.error(e);
        }
    });

// Average Coverage

    var avgCoverage = 0;
    var totalCoverage = 0;

    smartContract.totalCoverage(function (e, r) {
        if (!e) {
            totalCoverage = ethToEuro * r.toString(10);
        } else {
            console.error(e);
        }
    });

    if (insureeCount > 0) {
        avgHouseArea = totalArea / insureeCount;
        avgPremium = totalPremium / insureeCount;
        avgCoverage = totalCoverage / insureeCount;
    }

    console.log(insureeCount);
    console.log(avgHouseArea);
    console.log(avgPremium);
    console.log(avgCoverage);
    console.log(totalPremium);
    console.log(totalCoverage);
    return {
        insureeCount: insureeCount,
        avgHouseArea: avgHouseArea,
        avgPremium: avgPremium,
        avgCoverage: avgCoverage,
        totalPremium: totalPremium,
        totalCoverage: totalCoverage
    }
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
        if (typeof web3 !== 'undefined')
            resolve(web3);
        else
            reject();
    });
});