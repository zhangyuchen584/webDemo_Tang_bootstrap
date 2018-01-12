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
                'Content-Type': 'application/json'
                //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
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



    $scope.extractTargetData = function(analysisSentence) {
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
        //var analysisResultObject = JSON.parse(analysisTitle1);
        var analysisResultObject = analysisSentence.data;
        var sentences = analysisResultObject.sentences;        
        $scope.UniqueTargetList = [];
        
        // var a = [1,2,3,4,5];
        // var b = a.push(6,7); //a：[-2,-1,1,2,3,4,5]   b：7
        // console.log(b);
        // console.log(a);

        for (var i = 0; i < sentences.length; i++) {
            var sentence = sentences[i];
            var opinions = sentence.opinions; //target,category,polarity
            var text = sentence.text;
            // var tokenizedText = sentence.tokenizedText;

            for (var j = 0; j < opinions.length; j++) {
                var analysisObj = {};
                var opinion = opinions[j];
                analysisObj['category'] = opinion.category;
                analysisObj['polarity'] = opinion.polarity;
                analysisObj['target'] = opinion.target;

                if (analysisObj['target'] == 'NULL') {
                    continue;
                    console.log('ISNULL');

                }

                analysisObj['text'] = text;
                // analysisObj['tokenizedText'] = tokenizedText;
                $scope.analysisArray.push(analysisObj);

            }

        }

        
        // remove duplicate target
        var flags = [],
            output = [],
            l = $scope.analysisArray.length,
            i;
        for (i = 0; i < l; i++) {
            if (flags[$scope.analysisArray[i].target]) continue;
            flags[$scope.analysisArray[i].target] = true;
            $scope.UniqueTargetList.push({target: $scope.analysisArray[i].target,
                targetNegVol: 0, targetPosiVol:0,targetNeutVol:0,targetNegSent:[]});
            
        }
        
        for (i=0;i<$scope.UniqueTargetList.length;i++){
            for (j=0;j<$scope.analysisArray.length;j++){
                if ($scope.UniqueTargetList[i].target == $scope.analysisArray[j].target) {
                if ($scope.analysisArray[j].polarity == "negative"){$scope.UniqueTargetList[i].targetNegVol++}
                else {
                    if ($scope.analysisArray[j].polarity == "positive"){$scope.UniqueTargetList[i].targetPosiVol++} 
                        else {$scope.UniqueTargetList[i].targetNeutVol++}
                }
                }
                else {
                    continue;
                }
                
            }
        }
        console.log($scope.UniqueTargetList)
        console.log($scope.analysisArray);
        

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