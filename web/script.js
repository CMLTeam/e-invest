angular.module('root', ['rzModule'])
    .controller('InsureeCtrl', function InsureeCtrl($scope) {

        $scope.calc = calcInsurance;

        $scope.postalCode = "01067";
        $scope.apptArea = 50.0;

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
        web3Promise.then(function () {
            var insuranceData = getInsuranceDataFromBlockchain();
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
        $scope.balance = 15000;
    })
    .controller('BrokerCtrl', function BrokerCtrl($scope, $timeout) {
        $scope.claim = function (id) {
            $scope.insureeId = null;
            if (id)
                $scope.claims.push({id: id});
        };
        $scope.approve = function (result, idx) {
            $scope.claims[idx].result = result ? 'Approving' : 'Rejecting';
            $timeout(function () {
                $scope.claims.splice(idx, 1);
            }, 2000);
        };
        $scope.claims = [
            {id:'111'},
            {id:'222'},
            {id:'333'}
        ]
    })
    .controller('AboutCtrl', function AboutCtrl($scope) {

    });