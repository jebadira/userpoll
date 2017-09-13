import $ from 'jquery';
import Dispatcher from '../dispatchers/dispatcher.js';
import PollActionTypes from '../actions/PollActionTypes.js';
import QuestionActionTypes from '../actions/QuestionActionTypes.js';
import AnswerStore from '../stores/AnswerStore.jsx';
const API = {
    
    GetQuestionData(ID){
        debugger;
        
        var promise = $.ajax({
            url: "https://asuep.sharepoint.com/sites/DeviLink/_api/web/lists/GetByTitle('User Poll Questions')/items?$filter=ID eq " + ID,
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

            //query the store and query sharepoint for the new answers.
            var getAnswers = [];
            for(var prop in questionsarr){
                if(questionsarr.hasOwnProperty(prop)){
                    //ask answer store
                    for(var i =0; i < questionsarr[prop].answerIds.length; i++){
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
                var promise = $.ajax({
                    url: "https://asuep.sharepoint.com/sites/DeviLink/_api/web/lists/GetByTitle('User Poll Answers')/items?" + filterString,
                    method: "GET",
                    contentType : "application/json",
                    dataType : 'json',
                    beforeSend : function(xhr){
                        xhr.setRequestHeader("accept", "application/json;"); 
                    },
                });
                    promise.done(function(data){
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
                            type: PollActionTypes.NEXTSUBQUESTION,
                            questionsArr : questionsarr,
                            ID : ID,
                            getAnswers : answersArr
                        });
                    });
            }
            
            
        });
        
    }
}

export default API;