
var myApp = angular.module("myApp", []);

function AjaxLoad($http, url, type, data, async, callback){
    $http({
        url: url,
        method: type,
        data: data,
        async: async,
    }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            callback(response);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.error = response.statusText;
    });
}

(function(app){
	"use strict";
    app.controller("navCtrl", function($scope){
        $scope.name = "bi an";
        $.ajax({
            type: 'POST',
            url: "/user/checktoken",
            data: {
                token : curtoken
            },
            //dataType: "text",
            success: function(resultData) { 
                if(resultData.status == true){
                    logined = true;
                    $(".logined").show();
                    $(".not-login").hide();
                    $("#chat-input").removeAttr("disabled");
                }else{
                    logined = false;
                } 
            }
        });
    });
    
    app.controller("marketCtrl", function($scope, $http){
        $scope.listBase = ['BTC','ETH','USDT'];
        var datapost = {
            url: 'https://poloniex.com/public?command=returnTicker'
        };
        AjaxLoad($http, '/api/geturljson','POST', datapost, false, function(result){
            allTickerData = result.data.data;
            writeMarketTable('BTC');
            writeMarketTable('ETH');
            writeMarketTable('USDT');
            InitDataTable();
        })
    });

    app.controller("exchangeCtrl", function($scope, $http){
        var currencyPairQuery = $.urlParam('currency');
        if(currencyPairQuery == null || currencyPairQuery ==''){
            var currencyPairQuery = primaryCurrency + '_' + secondaryCurrency;
            if(settingData.currencyPairQuery){
                currencyPairQuery = settingData.currencyPairQuery;
            }
            window.location.href = '/market/exchange?currency=' + currencyPairQuery;
        }

    });

    app.controller("orderBookCtl", function($scope, $http){
        var currencyPairQuery = $.urlParam('currency');
        if(currencyPairQuery != null && currencyPairQuery != ''){
            var datapost = {
                url : 'https://poloniex.com/public',
                command : 'returnOrderBook',
                currencyPair : currencyPairQuery,
                depth : 50
            };

            AjaxLoad($http, '/api/geturlcommand','POST', datapost, true, function(result){
                var data = JSON.parse(result.data);
                var asks = data.asks;
                var bids = data.bids;
                // console.log(asks, bids);
                writeOrderbookTable(asks, 'buy');
                writeOrderbookTable(bids, 'sell');
            })
        }
        
    });

    app.controller("tradeHistoryCtl", function($scope, $http){
        var currencyPairQuery = $.urlParam('currency');
        if(currencyPairQuery != null && currencyPairQuery != ''){
            var datapost = {
                url : 'https://poloniex.com/public',
                command : 'returnTradeHistory',
                currencyPair : currencyPairQuery
            };

            AjaxLoad($http, '/api/geturlcommand','POST', datapost, true, function(result){
                var data = JSON.parse(result.data);
                // console.log(data);
                writeTradeHistoryTable(data);
            })
        }
        
    });
    
})(myApp);