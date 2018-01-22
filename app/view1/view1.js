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
        D1 : {comments : "But the staff was so horrible to us."},
        D2 : {comments : "We always have a delicious meal and always leave feeling satisfied."},
        D3 : {comments : "But the staff was so horrible to us.We always have a delicious meal and always leave feeling satisfied."}
    }

    //hide target,category,comment first
    $scope.showTarget = false;
    $scope.showCategory = false;
    $scope.showComment = false;

    $scope.details = {};  //NO IDEA

    //category dictionary mapping

    var catDicMapping = 
        [{category:"AMBIENCE#GENERAL", catMapping:"ambience"},
        {category:"DRINKS#PRICES", catMapping:"price"},
        {category:"DRINKS#QUALITY", catMapping:"food"},
        {category:"DRINKS#STYLE_OPTIONS", catMapping:"food"},
        {category:"FOOD#PRICES", catMapping:"price"},
        {category:"FOOD#QUALITY", catMapping:"food"},
        {category:"FOOD#STYLE_OPTIONS", catMapping:"food"},
        {category:"LOCATION#GENERAL", catMapping:"anecdotes/miscellaneous"},
        {category:"RESTAURANT#GENERAL", catMapping:"anecdotes/miscellaneous"},
        {category:"RESTAURANT#MISCELLANEOUS", catMapping:"anecdotes/miscellaneous"},
        {category:"RESTAURANT#PRICES", catMapping:"price"},
        {category:"SERVICE#GENERAL", catMapping:"service"},]
    
    var test = 
        [{term:'food',polarity1:{po:1,sentence:{se1:'a',se2:'d'}}}
        ]
        // console.log(test)
        ++test[0].polarity1.po

    // Object.keys(catDicMapping).map(function(key,index){
    //     // console.log(catDicMapping[key].category)
    //     if (catDicMapping[key].category == 'AMBIENCE#GENERAL') {
    //         console.log(catDicMapping[key].catMapping)
    //     }
           
    // });

    //connect to ZQ httpserver
    $scope.displayTarget = function(analysisTitle) {
        //send http post request
        var destinationURL = 'http://localhost:8080';
        // console.log(destinationURL)
            //var destinationURL = '10.218.112.25:12341';
        var config = {
            headers: {'Content-Type': 'application/json'},
        }
        $http.post(destinationURL, analysisTitle, config).then($scope.TargetCategoryData, $scope.errorOutput);
    }



    // //connect to anh tuan httpserver
    // $scope.displayTarget1 = function(text) {
    //     //send http post request
    //     var destinationURL = 'http://localhost:8088';
    //     console.log(destinationURL)
    //         //var destinationURL = '10.218.112.25:12341';
    //     var config = {
    //         headers: {'Content-Type': 'application/json'},
    //     }
    //     $http.post(destinationURL, text, config).then($scope.test, $scope.errorOutput);
    // }


    //extract Target and Category data with sentences respectively
    $scope.TargetCategoryData = function(InputComments) {
        // console.log("successsssssssssssful");

        //re-arrange output format
        $scope.TargetList = []
        $scope.CategoryList = []

        var sentencesLists = InputComments.data.sentences
        for (var i = 0; i < sentencesLists.length; i++) {
            var sentencePair = sentencesLists[i];
            var comment = sentencePair.text;
            // console.log(sentencePair)
            
            //remove 'target=NULL'
            for (var j=0;j<sentencePair.opinions.length;j++){
                if (sentencePair.opinions[j].target == 'NULL'){continue;}
                else {$scope.TargetList.push({target:sentencePair.opinions[j].target.toLowerCase(),comment:comment}) }
                
            }
            //remove 'category=NULL'
            for (var j=0;j<sentencePair.opinions.length;j++){
                if (sentencePair.opinions[j].category == 'NULL'){continue;}
                else {$scope.CategoryList.push({category:sentencePair.opinions[j].category,comment:comment}) }
                
            }
        }

        //remove target duplicate records in Dictionary 
        var TemArray = [];
        $scope.UniqueTargetList = []
        for (var item in $scope.TargetList){
            TemArray[$scope.TargetList[item].target+'-'+$scope.TargetList[item].comment] = $scope.TargetList[item];
        }
        
        for (var term in TemArray)
            {$scope.UniqueTargetList.push(TemArray[term])}

        // console.log($scope.UniqueTargetList)
        $scope.showTarget = true;

        //remove category duplicate records in Dictionary
        var TemArray1 = [];
        $scope.UniqueCategoryList = [];
        for (var item in $scope.CategoryList){
            // console.log(item)
            TemArray1[$scope.CategoryList[item].category+'-'+$scope.CategoryList[item].comment] = $scope.CategoryList[item];
            // console.log(TemArray1)
        }
        
        for (var term in TemArray1)
            {$scope.UniqueCategoryList.push(TemArray1[term])}
        
        // console.log($scope.UniqueCategoryList)
        $scope.showCategory = true;

        $scope.TargetPolarity($scope.UniqueTargetList) 
        console.log($scope.UniqueCategoryList)
        $scope.CategoryPolarity($scope.UniqueCategoryList) 



    }


    $scope.TargetPolarity = function(text) {
        //send http post request to Anh Tuan API
        for (item in text) {
            // console.log(text[item])
            var destinationURL = 'http://localhost:8088';
            //var destinationURL = '10.218.112.25:12341';
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                },
            }

            // TarComPair = Object.keys(text[item])[0]+'.'+ text[item].target + '.comment. ' + text[item].comment
            TarComPair = 'target.'+ text[item].target + '.comment. ' + text[item].comment
            // console.log(TarComPair)
            
            $http.post(destinationURL, TarComPair, config).then($scope.PrintTarget, $scope.errorOutput);

        }


    }
    $scope.CategoryPolarity = function(text) {
        //send http post request to Anh Tuan API
        for (item in text) {
            // console.log(text[item])
            Object.keys(catDicMapping).map(function(key, index) {
                if (catDicMapping[key].category == text[item].category) {
                    text[item].cat = catDicMapping[key].catMapping
                }

            });
            // console.log(text[item])
            var destinationURL = 'http://localhost:8088';
            //var destinationURL = '10.218.112.25:12341';
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            // TarComPair = Object.keys(text[item])[0]+'.'+ text[item].target + '.comment. ' + text[item].comment
            CatComPair = 'category.'+ text[item].category + '.comment. ' + text[item].comment
            // console.log(TarComPair)
            
            $http.post(destinationURL, CatComPair, config).then($scope.PrintCategory, $scope.errorOutput);

        }

    }


    $scope.TarSenPol = []
    $scope.CatSenPol = []
    $scope.PrintTarget = function(text){
        $scope.TarSenPol.push(text.data);
        if ($scope.TarSenPol.length == $scope.UniqueTargetList.length) {
            // console.log('tarDu')
            // console.log($scope.TarSenPol)
            TemArray3 = []
            $scope.tarOutPut = []
            for (var item in $scope.TarSenPol){
                TemArray3[$scope.TarSenPol[item].term] = []
            }
            for (var item in $scope.TarSenPol){
                TemArray3[$scope.TarSenPol[item].term].push($scope.TarSenPol[item])
            }
            for (term in TemArray3){
                $scope.tarOutPut.push(TemArray3[term])
            }



            Object.keys($scope.tarOutPut).map(function(key,index){
                var p0 = 0
                var p1 = 0
                var p2 = 0
                var sen0 = []
                var sen1 = []
                var sen2 = []

                Object.keys($scope.tarOutPut[key]).map(function(key1,index){
                    if ($scope.tarOutPut[key][key1].polarity == 0){
                        // console.log($scope.tarOutPut[key][key1])
                        // console.log('aa')
                        p0++;
                        sen0.push($scope.tarOutPut[key][key1].sentence)

                    }
                    else if ($scope.tarOutPut[key][key1].polarity == 1) {
                        p1++;
                        sen1.push($scope.tarOutPut[key][key1].sentence)
                    }
                    else {
                        p2++;
                        sen2.push($scope.tarOutPut[key][key1].sentence)
                    }
                })
                // console.log(p0,p1,p2)
                $scope.tarOutPut[key].P0 = p0
                $scope.tarOutPut[key].P0Sen = sen0
                $scope.tarOutPut[key].P1 = p1
                $scope.tarOutPut[key].P1Sen = sen1
                $scope.tarOutPut[key].P2 = p2
                $scope.tarOutPut[key].P2Sen = sen2
                // console.log($scope.tarOutPut)
            })
            // console.log($scope.tarOutPut)






        }
    }

    $scope.PrintCategory = function(text) {
        Object.keys(catDicMapping).map(function(key, index) {
            if (catDicMapping[key].category == text.data.term) {
                text.data.category = catDicMapping[key].catMapping
            }

        });

        $scope.CatSenPol.push(text.data);
        if ($scope.CatSenPol.length == $scope.UniqueCategoryList.length) {
            console.log($scope.CatSenPol)
            //re-arrange category output: combine same categories            
            TemArray2 = []
            $scope.catOutPut = []
            for (var item in $scope.CatSenPol){
                TemArray2[$scope.CatSenPol[item].category] = []
            }
            for (var item in $scope.CatSenPol){
                TemArray2[$scope.CatSenPol[item].category].push($scope.CatSenPol[item])
            }
            for (term in TemArray2){
                $scope.catOutPut.push(TemArray2[term])
            }

            console.log($scope.catOutPut)
            Object.keys($scope.catOutPut).map(function(key,index){
                var p0 = 0
                var p1 = 0
                var p2 = 0
                var sen0 = []
                var sen1 = []
                var sen2 = []

                Object.keys($scope.catOutPut[key]).map(function(key1,index){
                    if ($scope.catOutPut[key][key1].polarity == 0){
                        // console.log($scope.catOutPut[key][key1])
                        // console.log('aa')
                        p0++;
                        sen0.push($scope.catOutPut[key][key1].sentence)

                    }
                    else if ($scope.catOutPut[key][key1].polarity == 1) {
                        p1++;
                        sen1.push($scope.catOutPut[key][key1].sentence)
                    }
                    else {
                        p2++;
                        sen2.push($scope.catOutPut[key][key1].sentence)
                    }
                })
                // console.log(p0,p1,p2)
                $scope.catOutPut[key].P0 = p0
                $scope.catOutPut[key].P0Sen = sen0
                $scope.catOutPut[key].P1 = p1
                $scope.catOutPut[key].P1Sen = sen1
                $scope.catOutPut[key].P2 = p2
                $scope.catOutPut[key].P2Sen = sen2
                // console.log($scope.catOutPut)
            })
            // console.log($scope.catOutPut)
        }
    }

  

    $scope.updateSelected = function() {
        $scope.InputComments = $scope.selectDemo.comments
    }



    // $scope.extractTargetData = function(analysisSentence) {
    //     // console.log("successsssssssssss");

    //     $scope.analysisArray = [];
    //     //var analysisResultObject = JSON.parse(analysisTitle1);
    //     console.log(analysisSentence)
    //     var analysisResultObject = analysisSentence.data;

    //     var sentences = analysisResultObject.sentences;        
    //     $scope.UniqueTargetList = [];
    

    //     for (var i = 0; i < sentences.length; i++) {
    //         var sentence = sentences[i];
    //         var opinions = sentence.opinions; //target,category,polarity
    //         var text = sentence.text;
    //         // var tokenizedText = sentence.tokenizedText;

    //         for (var j = 0; j < opinions.length; j++) {
    //             var analysisObj = {};
    //             var opinion = opinions[j];
    //             analysisObj['category'] = opinion.category;
    //             analysisObj['polarity'] = opinion.polarity;
    //             analysisObj['target'] = opinion.target;

    //             if (analysisObj['target'] == 'NULL') {
    //                 continue;
    //                 console.log('ISNULL');

    //             }

    //             analysisObj['text'] = text;
    //             // analysisObj['tokenizedText'] = tokenizedText;
    //             $scope.analysisArray.push(analysisObj);

    //         }

    //     }

        
    //     // remove duplicate target
    //     var flags = [],
    //         output = [],
    //         l = $scope.analysisArray.length,
    //         i;
    //     for (i = 0; i < l; i++) {
    //         if (flags[$scope.analysisArray[i].target]) continue;
    //         flags[$scope.analysisArray[i].target] = true;
    //         $scope.UniqueTargetList.push({target: $scope.analysisArray[i].target,
    //             targetNegVol: 0, targetPosiVol:0,targetNeutVol:0,category:[],targetNegSent:[],targetPosiSent:[],targetNeutSent:[]});
            
    //     }
        
    //     for (i=0;i<$scope.UniqueTargetList.length;i++){
    //         for (j=0;j<$scope.analysisArray.length;j++){
    //             if ($scope.UniqueTargetList[i].target == $scope.analysisArray[j].target) {
    //                 $scope.UniqueTargetList[i].category.push({category:$scope.analysisArray[j].category});
    //             if ($scope.analysisArray[j].polarity == "negative"){$scope.UniqueTargetList[i].targetNegVol++;
    //                 $scope.UniqueTargetList[i].targetNegSent.push({category:$scope.analysisArray[j].text})}
    //             else {
    //                 if ($scope.analysisArray[j].polarity == "positive"){$scope.UniqueTargetList[i].targetPosiVol++;
    //                     $scope.UniqueTargetList[i].targetPosiSent.push({category:$scope.analysisArray[j].text})} 
    //                     else {$scope.UniqueTargetList[i].targetNeutVol++;
    //                         $scope.UniqueTargetList[i].targetNeutSent.push({category:$scope.analysisArray[j].text})}
    //             }
    //             }
    //             else {
    //                 continue;
    //             }
                
    //         }
    //     }
    //     console.log($scope.UniqueTargetList)
    //     console.log($scope.analysisArray);
        
    //     $scope.showTarget = true;
        
    // }


    // $scope.rateArray = [{
    //     'width': '20%'
    // }, {
    //     'width': '30%'
    // }, {
    //     'width': '50%'
    // }];

    // $scope.rate = {
    //     nagetive: $scope.rateArray[0],
    //     normal: $scope.rateArray[1],
    //     positive: $scope.rateArray[2]
    // }



    // $scope.updateComment = function(number) {
    //     $scope.commentNumber = number;
    // }

    // $scope.errorOutput = function() {
    //     console.log("errooooooooooor");
    // }


   
    $scope.ShowId1 = function(event) {
        // alert(event.target.id);
        // alert($scope.tarOutPut);
        $scope.showComment = true;
        $scope.comments = $scope.tarOutPut[event.target.id];
        console.log($scope.comments);

    };
    $scope.ShowId2 = function(event) {
        // alert(event.target.id);
        // alert($scope.catOutPut);
        $scope.showComment = true;
        $scope.comments = $scope.catOutPut[event.target.id];
        console.log($scope.comments);

    };


    $scope.ShowId = function(event) {
        // $scope.showComment = true;
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


}