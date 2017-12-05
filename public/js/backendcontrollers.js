
var myApp = angular.module("adminApp", ["ngRoute", 'ui.bootstrap']);

// myApp.config([
//     '$routeProvider', function ($routeProvider) {
//          $routeProvider
//             .when('/user/index', {
//                 title: 'User profile',
//             });
//     }
// ]);

// myApp.run(['$rootScope', '$route', function($rootScope, $route) {
//     $rootScope.$on('$routeChangeSuccess', function() {
//         document.title = $route.current.title;
//     });
// }]);

function AjaxLoad($http, url, type, data, callback){
    $http({
        url: url,
        method: type,
        data: data
    }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            callback(response);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            // $scope.error = response.statusText;
    });
}
(function(app){
    "use strict";

    app.controller("profileCtrl", function($scope, $http){
        $scope.profiletitle = "Your profile : ";
        $scope.title = "User profile page ";
        AjaxLoad($http, "/user/getuserinfo", 'GET', {token : curtoken}, function(data){
            console.log(data);
            $scope.info = data.data;
            $scope.referalLink = $(location).attr('host') + '/register?ref=' + data.data.username;
        });
        
    });

    app.controller("mainCtrl", function($scope){
        //$scope.title = "Default home page ";
    });

    // app.controller("walletCtrl", function($scope, $http){
    //     AjaxLoad($http, "/wallet/getinfo", 'GET', {token : curtoken}, function(data){
    //         console.log(data);
    //     });
    // });

    app.controller("transactionCtrl", function($scope, $http){
        AjaxLoad($http, "/transaction/gettransaction", 'GET', {token : curtoken}, function(data){
            $scope.totalItemsBTC = data.data.btc.length;
            $scope.itemsPerPageBTC = 5
            $scope.currentPageBTC = 1;
        
            // $scope.setPage = function (pageNo) {
            //   $scope.currentPage = pageNo;
            // };
        
            // $scope.pageChanged = function() {
            //   console.log('Page changed to: ' + $scope.currentPage);
            // };
        
            $scope.maxSize = 5;
            $scope.bigTotalItems = 175;
            $scope.bigCurrentPage = 1;
            
           $scope.pageCount = function () {
             return Math.ceil(data.data.btc.length / $scope.itemsPerPageBTC);
           };
        
           $scope.$watch('currentPageBTC + itemsPerPageBTC', function() {
             var begin = (($scope.currentPageBTC - 1) * $scope.itemsPerPageBTC),
                 end = begin + $scope.itemsPerPageBTC;
             $scope.filteredTransactionBTC = data.data.btc.slice(begin, end);
           });

           // VNC Transactions
           $scope.totalItemsVNC = data.data.vnc.length;
           $scope.itemsPerPageVNC = 5
           $scope.currentPageVNC = 1;

           $scope.maxSize = 5;
           $scope.bigTotalItems = 175;
           $scope.bigCurrentPage = 1;
           
          $scope.pageCount = function () {
            return Math.ceil(data.data.vnc.length / $scope.itemsPerPageVNC);
          };
       
          $scope.$watch('currentPageVNC + itemsPerPageVNC', function() {
            var begin = (($scope.currentPageVNC - 1) * $scope.itemsPerPageVNC),
                end = begin + $scope.itemsPerPageVNC;
       
            $scope.filteredTransactionVNC = data.data.vnc.slice(begin, end);
          });

        });
    });

    
})(myApp);