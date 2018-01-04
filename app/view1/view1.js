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
    $scope.demos = {
        D1 : {comments : "Ford"},
        D2 : {comments : "Fiat"},
        D3 : {comments : "Volvo"}
    }

    $scope.showTarget = false;
    $scope.showComment = false;
    $scope.showDetail = false;
    $scope.details = {};
    var number = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [8, 9, 10]
    ];
    $scope.rateArray = [{
        'width': '10%'
    }, {
        'width': '30%'
    }, {
        'width': '60%'
    }];

    $scope.rate = {
        nagetive: $scope.rateArray[0],
        normal: $scope.rateArray[1],
        positive: $scope.rateArray[2]
    }


    $scope.displayTarget = function(analysisTitle) {
        //send http post request
        var destinationURL = 'http://localhost:8080';
        console.log(destinationURL)
            //var destinationURL = '10.218.112.25:12341';
        var config = {
            headers: {
                'Content-Type': undefined
                //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    //x-www-form-urlencoded
                    //'Content-Type': 'application/json'
            },
            //transformRequest: angular.identity
        }

        //$http.get(destinationURL).success(displayTarget);
        $http.post(destinationURL, analysisTitle, config).then($scope.extractTargetData, $scope.errorOutput);
        /*
        $http.post(destinationURL, analysisTitle, config).then(function (response) {
            console.log("success");
        }, $scope.errorOutput);
        */
    }


//唐姐姐之前写的，现在已经用不上了
    $scope.extractTargetData = function(analysisTitle1) {
        console.log("successsssssssssss");
        /*
        if (!analysisTitle) {
            console.log("no data");
            return false;
        }
        */
        /*
        var analysisArray = [];
        if (analysisTitle) {
            analysisArray = analysisTitle.split(' ');
        }
        $scope.analysisArray = [];
        */
        $scope.analysisArray = [];
        var analysisResultObject = JSON.parse(analysisTitle1);
        var sentences = analysisResultObject.sentences;
        for (var i = 0; i < sentences.length; i++) {
            var sentence = sentences[i];
            var opinions = sentence.opinions;
            var text = sentence.text;
            var tokenizedText = sentence.tokenizedText;
            for (var j = 0; j < opinions.length; j++) {
                var analysisObj = {};
                var opinion = opinions[j];
                analysisObj['category'] = opinion.category;
                analysisObj['polarity'] = opinion.polarity;
                analysisObj['target'] = opinion.target;
                $scope.analysisArray.push(analysisObj);
            }
        }
        /*
        for (var i = 0; i < analysisArray.length; ++i) {
            var analysisObj = {};
            analysisObj['title'] = analysisArray[i];
            analysisObj['number'] = number[i];
            $scope.analysisArray.push(analysisObj);
        }
        */
        $scope.showTarget = true;
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

    $scope.errorOutput = function() {
        console.log("errooooooooooor");
    }
}
