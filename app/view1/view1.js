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



function View1Ctrl($rootScope, $scope, $http) {
    //demo button
    $scope.demos = {
        D1 : {comments : "Ford"},
        D2 : {comments : "Fiat"},
        D3 : {comments : "Volvo"}
    }

    //hide target,category,comment first
    $scope.showTarget = false;
    $scope.showCategory = false;
    $scope.showComment = false;

    $scope.details = {};  //NO IDEA

    //connect to ZQ httpserver
    $scope.displayTarget = function(analysisTitle) {
        //send http post request
        var destinationURL = 'http://localhost:8080';
        console.log(destinationURL)
            //var destinationURL = '10.218.112.25:12341';
        var config = {
            headers: {'Content-Type': 'application/json'},
        }
        $http.post(destinationURL, analysisTitle, config).then($scope.extractTargetData, $scope.errorOutput);
    }



    //connect to anh tuan httpserver
    $scope.displayTarget1 = function(text) {
        //send http post request
        var destinationURL = 'http://localhost:8088';
        console.log(destinationURL)
            //var destinationURL = '10.218.112.25:12341';
        var config = {
            headers: {'Content-Type': 'application/json'},
        }
        $http.post(destinationURL, text, config).then($scope.test, $scope.errorOutput);
    }







    $scope.extractTargetData = function(analysisSentence) {
        // console.log("successsssssssssss");

        $scope.analysisArray = [];
        //var analysisResultObject = JSON.parse(analysisTitle1);
        console.log(analysisSentence)
        var analysisResultObject = analysisSentence.data;

        var sentences = analysisResultObject.sentences;        
        $scope.UniqueTargetList = [];
    

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
                targetNegVol: 0, targetPosiVol:0,targetNeutVol:0,category:[],targetNegSent:[],targetPosiSent:[],targetNeutSent:[]});
            
        }
        
        for (i=0;i<$scope.UniqueTargetList.length;i++){
            for (j=0;j<$scope.analysisArray.length;j++){
                if ($scope.UniqueTargetList[i].target == $scope.analysisArray[j].target) {
                    $scope.UniqueTargetList[i].category.push({category:$scope.analysisArray[j].category});
                if ($scope.analysisArray[j].polarity == "negative"){$scope.UniqueTargetList[i].targetNegVol++;
                    $scope.UniqueTargetList[i].targetNegSent.push({category:$scope.analysisArray[j].text})}
                else {
                    if ($scope.analysisArray[j].polarity == "positive"){$scope.UniqueTargetList[i].targetPosiVol++;
                        $scope.UniqueTargetList[i].targetPosiSent.push({category:$scope.analysisArray[j].text})} 
                        else {$scope.UniqueTargetList[i].targetNeutVol++;
                            $scope.UniqueTargetList[i].targetNeutSent.push({category:$scope.analysisArray[j].text})}
                }
                }
                else {
                    continue;
                }
                
            }
        }
        console.log($scope.UniqueTargetList)
        console.log($scope.analysisArray);
        
        $scope.showTarget = true;
        
    }


    $scope.rateArray = [{
        'width': '20%'
    }, {
        'width': '30%'
    }, {
        'width': '50%'
    }];

    $scope.rate = {
        nagetive: $scope.rateArray[0],
        normal: $scope.rateArray[1],
        positive: $scope.rateArray[2]
    }



    $scope.updateComment = function(number) {
        $scope.commentNumber = number;
    }

    $scope.errorOutput = function() {
        console.log("errooooooooooor");
    }


    $scope.ShowId = function(event) {
        $scope.showCategory = true;
        $scope.returnCategory=$scope.UniqueTargetList[event.target.id].category;
        
        //remove duplicate category
        var flags = [],
            output = [],
            l = $scope.returnCategory.length,
            i;
        $scope.uniqreturnCategory = []
        // console.log($scope.returnCategory.length)
        for (i = 0; i < l; i++) {
            if (flags[$scope.returnCategory[i].category]) continue;
            flags[$scope.returnCategory[i].category] = true;
            $scope.uniqreturnCategory.push({uniqcategory:$scope.returnCategory[i].category});
        }
        console.log(1)
        console.log($scope.uniqreturnCategory)     

    };


    $scope.test = function(text){
        console.log("success")
        console.log(text.data)
    }


}