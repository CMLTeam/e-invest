angular.module('root', ['rzModule'])
    .controller('InsureeCtrl', function InsureeCtrl($scope) {

        $scope.calc = calcInsurance;

        $scope.postalCode = "01067";
        $scope.apptArea = 50.0;

        $scope.insure = function(area, zoneId) {
            var premium = eurToWei($scope.price);
            var coverage = eurToWei($scope.coveredAmt);

            var contract = getContract();
            contract.insure(1, area, zoneId, premium, coverage, {value: premium, gasPrice: 10000000000}, function(e, r) {
                if(!e) {
                    console.log(r);
                    $scope.ins_clicked=true;
                    $scope.$apply();
                }
                else {
                    console.error(e);
                }
            });
        };

        function calcInsurance(postalCode, apptArea) {
            var startDate = '2017-11-01';
            var endDate = '2018-11-01';
            var producerCode = '727461350';

            console.info('calcInsurance', postalCode, apptArea);
            apptArea = Number(apptArea);
            // var postalCode = "01067";
            // var apptArea = 50.0;

            var payLoad = {
                "PolicyPeriod":
                    {
                        "EffectiveDatedFields":
                            {
                                "PaymentPeriod_ZDE":
                                    "tc_yearly",
                                "RateType_ZDE":
                                    "tc_normal"
                            }
                        ,
                        "PolicyStartDate":
                        startDate,
                        "TermEndDate_ZDE":
                        endDate,
                        "Policy":
                            {
                                "ProductCode":
                                    "NPLPL_NewPersonalProduct",
                                "Account":
                                    {
                                        "ProducerCodes":
                                            [{
                                                "ProducerCode": {
                                                    "Code": producerCode
                                                }
                                            }]
                                    }
                            }
                        ,
                        "HRLine":
                            {
                                "HRRiskLocations":
                                    [{
                                        "Location": {
                                            "PostalCode": postalCode
                                        },
                                        "HRApartments": [{
                                            "Apartment": {
                                                "ApptmntOrOfficeArea": apptArea
                                            },
                                            "CoverageConcept": "tc_silver",
                                            "RiskCategory": "tc_household_elem_glass",
                                            "Coverages": [{
                                                "Pattern": {
                                                    "PublicID": "HR_BuiltInGlassSDHCov"
                                                },
                                                "CovTerms": [{
                                                    "ValueAsString": "tc_noLimit",
                                                    "Pattern": {
                                                        "PublicID": "HR_LimitBuiltInGlassSDHTerm"
                                                    }
                                                }]
                                            }, {
                                                "Pattern": {
                                                    "PublicID": "HR_GlassMobileBuiltInCov"
                                                },
                                                "CovTerms": [{
                                                    "ValueAsString": "tc_noLimit",
                                                    "Pattern": {
                                                        "PublicID": "HR_LimitGlassMobileBuiltInTerm"
                                                    }
                                                }]
                                            }],
                                            "HRCoverableAnswers": [{
                                                "BooleanAnswer": true,
                                                "Question": {
                                                    "PublicID": "ApartmentPermanentlyOccupied"
                                                }
                                            }]
                                        }]
                                    }]
                            }
                    }
            };

            $.ajax({
                url: 'https://api.insurhack.com/gi/PolicyPeriod_Set/zde.actions.GetRating',
                beforeSend: function (request) {
                    request.setRequestHeader("KeyId", "451fc4df-52e8-419c-977d-e6bd26af8dd5");
                },
                method: "POST",
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                data: JSON.stringify(payLoad)
            }).done(function (data) {
                console.log('res:', data);
                $scope.price = data.CostsSummary.GrossPremium.Amount;
                $scope.coveredAmt = apptArea * 250;
                $scope.$apply();
            });
        }
    })
    .controller('InvestCtrl', function InvestCtrl($scope, $filter) {
        var df = $filter('date');
        $scope.invest = function (pf) {
            $scope.inv = {};
            $scope.inv.period = 12;
            $scope.inv.startDate = df(new Date(), 'yyyy-MM-dd');
            $scope.inv.dueDate = df(new Date(new Date().getTime() + $scope.inv.period + 365 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
            $scope.inv.pf = pf;
            $scope.inv.invAmount = 0;
            $scope.slider = {
                options: {
                    floor: 0,
                    ceil: $scope.balance,
                    translate: function(value) {
                        return '€' + value;
                    }
                }
            }
        };

        $scope.investBlockchain = function() {
            var value = eurToWei($scope.inv.invAmount);
            var contract = getContract();
            contract.invest({value: value, gasPrice: 10000000000}, function(e, r) {
                if(!e) {
                    console.log(r);
                    $scope.ins_clicked=true;
                    $scope.$apply();
                }
                else {
                    console.error(e);
                }
            });
        };



        web3Promise.then(function () {
            getInsuranceDataFromBlockchain(function(insuranceData) {
                var defInsData = {
                    insureeCount: 130,
                    avgHouseArea: 62,
                    avgPremium: 400,
                    avgCoverage: 20000,
                    totalPremium: 2300000,
                    totalCoverage: 53700000
                };
                $scope.portfolios = [
                    angular.extend({title: "Portfolio A", descr: "Low Risk - Low Profit"}, insuranceData),
                    angular.extend({title: "Portfolio B", descr: "Balanced Risk - Profit"}, defInsData),
                    angular.extend({title: "Portfolio C", descr: "Increased Risk - High Profit"}, defInsData)
                ];
                $scope.$apply();
            });

            console.log("default account: " + web3.eth.defaultAccount);
            web3.eth.getBalance(web3.eth.defaultAccount, function(e, r) {
                if(!e) {
                    console.log("ETH: " + r);
                    $scope.balance = weiToEur(r);
                    $scope.$apply();
                }
                else {
                    console.error(e);
                }
            });
        });
    })
    .controller('BrokerCtrl', function BrokerCtrl($scope, $timeout) {
        web3Promise.then(function () {
            $scope.insureeId = web3.eth.defaultAccount;
            $scope.$apply();
        });

        $scope.claim = function (id) {
            var contract = getContract();
            contract.claimOnBehalf(id, 1, 1, function(e, r) {
                if(!e) {
                    console.log(r);
                    $scope.insureeId = null;
                    if (id) {
                        $scope.claims.push({id: id});
                    }
                    $scope.ins_clicked=true;
                    $scope.$apply();
                }
                else {
                    console.error(e);
                }
            });
        };
        $scope.approve = function(result, idx) {
            var address = $scope.claims[idx].id;
            var contract = getContract();
            if(result) {
                contract.approve(address, function(e, r) {
                    if(!e) {
                        console.log(r);
                        $scope.claims.splice(idx, 1);
                    }
                    else {
                        console.error(e);
                        $scope.claims[idx].result = "Error";
                    }
                    $scope.$apply();
                });
            }
            else {
                contract.decline(address, 1, function(e, r) {
                    if(!e) {
                        console.log(r);
                        $scope.claims.splice(idx, 1);
                    }
                    else {
                        console.error(e);
                        $scope.claims[idx].result = "Error";
                    }
                    $scope.$apply();
                });
            }
            $scope.claims[idx].result = result ? 'Approving' : 'Rejecting';
        };
        $scope.claims = []
    })
    .controller('AboutCtrl', function AboutCtrl($scope) {

    });