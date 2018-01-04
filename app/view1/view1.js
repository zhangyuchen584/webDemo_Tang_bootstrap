//import {Http, Response} from '@angular/http'
//angular.module('myApp.view1', ['ngRoute', 'http'])
angular.module('myApp.view1', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
      });
    }])
    .controller('View1Ctrl', View1Ctrl);

View1Ctrl.$inject = ['$rootScope', '$scope', '$http'];

//function View1Ctrl($rootScope, $scope, $compile, $http) {
function View1Ctrl($rootScope, $scope, $http) {
    $scope.showTarget = false;
    $scope.showComment = false;
    $scope.showDetail = false;
    $scope.details = {};
    var number = [[1,2,3],[4,5,6],[7,8,9], [8,9,10]];
    $scope.rateArray= [{'width': '10%'},{'width': '30%'},{'width': '60%'}];

    $scope.rate = {
        nagetive: $scope.rateArray[0],
        normal:$scope.rateArray[1],
        positive: $scope.rateArray[2]
    }

    $scope.displayTarget1 = function(analysisTitle){
      //send http post request
      var destinationURL = 'http://localhost:8080';

      //var destinationURL = '10.218.112.25:12341';
      var config = {
          headers : {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
              //x-www-form-urlencoded
              //'Content-Type': 'application/json'
          }
          }
      }
      //$http.get(destinationURL).success(displayTarget);
    $http.post(destinationURL, analysisTitle, config)
            //.success(function (data, status, headers, config) {
            .success(function (data, status, headers) {
              console.log("success received the data from server");
              displayTarget(data);
            })
            //.error(function (data, status, header, config) {
            .error(function (data, status, header) {
              console.log("errrrrrrrror");
            })

    $scope.displayTarget = function(analysisTitle){
        var analysisArray = [];
        if (analysisTitle) {
            analysisArray = analysisTitle.split(' ');

        }
        $scope.analysisArray = [];
        for (var i = 0; i < analysisArray.length; ++i) {
            var analysisObj = {};
            analysisObj['title'] = analysisArray[i];
            analysisObj['number'] = number[i];
            $scope.analysisArray.push(analysisObj);
        }
        $scope.showTarget =  true;
        $scope.showComment = true;

    }

    $scope.displayDetail = function(analysisItem) {
        $scope.showDetail = true;
        var details = {};
        details['title'] = analysisItem.title;
        details['number'] = analysisItem.number;
        details['description'] = 'detail description';
        $scope.details = details;
    }


    $scope.updateComment = function(number) {
        $scope.commentNumber = number;
    }
}
