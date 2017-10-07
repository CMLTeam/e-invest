angular.module('root', [])
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
    .controller('InvestCtrl', function InvestCtrl($scope) {
        $scope.invest = function (pf) {
            $scope.investPf = pf;
        };
        $scope.portfolios = [
            {title: "Protfolio A", descr: "Low Risk - Low Profit"},
            {title: "Protfolio B", descr: "Balanced Risk - Profit"},
            {title: "Protfolio C", descr: "Increased Risk - High Profit"}
        ]
    });