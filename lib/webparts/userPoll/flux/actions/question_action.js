import $ from 'jquery';
var Dispatcher = require('../dispatchers/dispatcher.js');

define("Actions",
    function(){
        return {
            loadQuestion : function(IDarr){
                var filterString = ""
                var filterString = "$filter=";
                for(var i = 0; i < IDarr.length ; i++){
                    if(i != IDarr.length - 1){
                        filterString += "ID eq " + IDarr[i] + " or ";
                    }else{
                        filterString += "ID eq " + IDarr[i];
                    }
                }
                
                var promise = $.ajax({
                    url: "https://asuep.sharepoint.com/sites/DLDev/fdsa/_api/web/lists/GetByTitle('User Poll Questions')/items?" + filterString,
                    method: "GET",
                    contentType : "application/json",
                    dataType: "json",
                    beforeSend : function(xhr){
                        xhr.setRequestHeader("accept", "application/json;");
                    }
                });
                promise.done(function(data){
                    debugger;
                    Dispatcher.dispatch({
                        type: "question-loaded",
                        questions : data.value
                    });
                });
                promise.fail(function(data){
                    debugger;
                    Dispatcher.dispatch({
                        type: "questions-failed",
                        error : data
                    })
                });

            },
        }
    });