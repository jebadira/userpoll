import $ from 'jquery';
import Dispatcher from '../dispatchers/dispatcher.js';
import PollActionTypes from '../actions/PollActionTypes.js';
import AnswerStore from '../stores/AnswerStore.jsx';
import PollStore from '../stores/PollStore.jsx';
import Guid from 'guid';
var batch = require("../../components/batch");
const API = {
    submit(pollId){
        var getCurrentUser = $.ajax({
        url: "https://asuep.sharepoint.com/sites/DeviLink/_api/Web/CurrentUser?$select=Id,Title",
        method : "GET",
        headers: { "Accept": "application/json;odata=verbose" }
        });
        getCurrentUser.done(function(data){
        var userID = data.d.Id;
        var username = data.d.Title;
        
        var formdigest = $.ajax({
            url: "https://asuep.sharepoint.com/sites/DeviLink/_api/contextinfo",
            method : "POST",
            headers: { "Accept": "application/json;odata=verbose" }
            });
            formdigest.done(function(data){
                var digestobject = data.d.GetContextWebInformation.FormDigestValue;
                var batchGuid = Guid.raw();
                var batchContents = [];
                var changeSetId = Guid.raw();
                var hostname = window.location.hostname;
                var endpoint = "https://asuep.sharepoint.com/sites/DeviLink/_api/web/lists/GetByTitle('User Poll Results')/items";
                //use the questionOrder.
                
                const seq = PollStore.getState().get('pollResults').entrySeq();
                var payloads = [];
                for(var i = 0; i < PollStore.getState().get("questionOrder").count(); i++){
                    debugger;
                    var value = PollStore.getState().get("questionOrder").get(i);
                    if(value != "-1"){
                        if(PollStore.getState().get('pollResults').get(value).has('text')){
                            var payload = {
                                '__metadata' : {'type': 'SP.Data.UserPollResultsListItem'},
                                'ResultQuestionUserPollResultId' : value,
                                'ResultAnswerUserPollResult' : PollStore.getState().get('pollResults').get(value).get('text'),
                                'UserUserPollResultsId' : userID,
                                'Title' : username + " Poll Result " + pollId,
                                'PollUserPollResultId' : pollId
                            };
                        payloads.push(payload);
                            
                        }else{
                            const checkseq = PollStore.getState().get('pollResults').get(value).entrySeq();
                            for(var j = 0; j < checkseq.count(); j++){
                                var payload = {
                                    '__metadata' : {'type': 'SP.Data.UserPollResultsListItem'},
                                    'ResultQuestionUserPollResultId' : value,
                                    'ResultAnswerUserPollResult' : checkseq.get(j)[1],
                                    'UserUserPollResultsId' : userID,
                                    'Title' : username + " Poll Result " + pollId,
                                    'PollUserPollResultId' : pollId
                                };
                                payloads.push(payload);
                                
                            }
                        }
                    }
                }
                debugger;
                var batchLoad =  batch;
                batchLoad.addPost(payloads, endpoint, {
                    "Content-Type" : "application/http",
                    "Content-Transfer-Encoding" : "binary"
                });
                batchLoad.CreateBatch();
                var batchRequestHeader = {
                                'X-RequestDigest' : digestobject,
                                'Content-Type' : 'multipart/mixed; boundary="batch_' + batchLoad.batchGuid() + '"'
                            }
                debugger;
                var promise = $.ajax({
                    url: "https://asuep.sharepoint.com/sites/DeviLink/_api/$batch",
                    method : "POST",
                    contentType : 'multipart/mixed; boundary="batch_' + batchLoad.batchGuid() + '"',
                    headers: batchRequestHeader,
                    data : batchLoad.batchBody(),
                    beforeSend : function(xhr){
                    // xhr.setRequestHeader("accept", "application/json;");
                        xhr.setRequestHeader("Content-Type", 'multipart/mixed; boundary="batch_' + batchLoad.batchGuid() + '"');
                        xhr.setRequestHeader("X-RequestDigest", digestobject);
                    },
                });
                promise.done(function(data){
                    Dispatcher.dispatch({
                        type: PollActionTypes.SUBMIT
                    });
                });
            });
        });
        
               
    },
    getPollQuestions(endPoint){
       
        var promise = $.ajax({
            url: endPoint,
            method : "GET",
            contentType: "application/json",
            dataType: "json",
            beforeSend : function(xhr){
                xhr.setRequestHeader("accept", "application/json;"); 
            },
        });
        promise.done(function(data){
             var filterString = "$filter=";
                var IDarr = data.value[0].QuestionsUserPollPollsId;
                    for(var i = 0; i < IDarr.length ; i++){
                        if(i != IDarr.length - 1){
                            filterString += "ID eq " + IDarr[i] + " or ";
                        }else{
                            filterString += "ID eq " + IDarr[i];
                        }
                    }
                    var promise = $.ajax({
                        url: "https://asuep.sharepoint.com/sites/DeviLink/_api/web/lists/GetByTitle('User Poll Questions')/items?" + filterString,
                        method: "GET",
                        contentType : "application/json",
                        dataType: "json",
                        beforeSend : function(xhr){
                            xhr.setRequestHeader("accept", "application/json;");
                        },

                    });
                    promise.done(function(data){
                    var questionsarr = {};
                    //build the question object we want to use. 
                    for(var i =0; i < data.value.length; i ++){
                        questionsarr[data.value[i].ID.toString()] = {
                        answerIds : data.value[i].AnswerUserPollQuestionId,
                        ID : data.value[i].ID,
                        question : data.value[i].QuestionUserPollQuestion,
                        type : data.value[i].TypesUserPollQuestion
                        };
                    }
                    //ask ansewr store if it has all the answers, otherwise fetch them. 
                    var getAnswers = [];
                    for(var prop in questionsarr){
                        if(questionsarr.hasOwnProperty(prop)){
                            for(var i =0; i < questionsarr[prop].answerIds.length; i ++){
                                if(!AnswerStore.getState().has(questionsarr[prop].answerIds[i])){
                                    getAnswers.push(questionsarr[prop].answerIds[i]);
                                }
                            }
                        }
                    }
                    if(getAnswers.length > 0){
                         var filterString = "$filter=";
                            for(var i = 0; i < getAnswers.length ; i++){
                                if(i != getAnswers.length - 1){
                                    filterString += "ID eq " + getAnswers[i] + " or ";
                                }else{
                                    filterString += "ID eq " + getAnswers[i];
                                }
                            }
                    
                        var answerPromise = $.ajax({
                            url: "https://asuep.sharepoint.com/sites/DeviLink/_api/web/lists/GetByTitle('User Poll Answers')/items?" + filterString,
                                method: "GET",
                                contentType : "application/json",
                                dataType : 'json',
                                beforeSend : function(xhr){
                                    xhr.setRequestHeader("accept", "application/json;"); 
                                },
                            });
                            answerPromise.done(function(data){
                                     var answersArr = {};
                                        for(var i = 0; i < data.value.length; i++){
                                            debugger;
                                            answersArr[data.value[i].ID.toString()] = {
                                                answer : data.value[i].AnswerUserPollAnswers,
                                                ID : data.value[i].ID,
                                                nextQuestion : data.value[i].NextQuestionUserPollAnswersId,
                                            };
                                        }
                                  Dispatcher.dispatch({
                                    type: PollActionTypes.GETLISTDATA,
                                    questions : questionsarr,
                                    answers : answersArr
                                });
                            });
                            answerPromise.fail(function(data){

                            });
                        }else{
                            Dispatcher.dispatch({
                                    type: PollActionTypes.GETLISTDATA,
                                    questions : questionsarr,
                                    answers : []
                                });
                        }
                    });
                    promise.fail(function(data){
                    });
        });
        promise.fail(function(data){

        });
      
    },
    checkForAnswers(endPoint, pollId){
        var closure = this;
        var getCurrentUser = $.ajax({
            url: "https://asuep.sharepoint.com/sites/DeviLink/_api/Web/CurrentUser?$select=Id,Title",
            method : "GET",
            headers: { "Accept": "application/json;odata=verbose" }
        });
        getCurrentUser.done(function(data){
            var userID = data.d.Id;
            var username = data.d.Title;
            var promise = $.ajax({
                url: "https://asuep.sharepoint.com/sites/DeviLink/_api/web/lists/GetByTitle('User Poll Results')/items?$filter=UserUserPollResultsId eq " + userID,
                method: "GET",
                contentType : "application/json",
                dataType : 'json',
                beforeSend : function(xhr){
                    xhr.setRequestHeader("accept", "application/json;"); 
                },
            });
            promise.done(function(data){
                debugger;
                if(data.value.length > 0 ){
                    Dispatcher.dispatch({
                        type : PollActionTypes.SUBMIT,
                    });
                }else{
                    closure.getPollQuestions(endPoint);
                }
            });
        });
    }
    
}

export default API;