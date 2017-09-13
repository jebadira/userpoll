import AnswerActionTypes from '../actions/AnswerActionTypes.js';
import PollActionTypes from '../actions/PollActionTypes.js';
import PollStore from '../stores/PollStore.jsx';
import QuestionStore from '../stores/QuestionStore.jsx';
import $ from 'jquery';
import Dispatcher from '../dispatchers/dispatcher.js';
import AnswerStore from '../stores/AnswerStore.jsx';

const API = {
    getAnswerData(answerIds){
        const notLoaded = answerIds.filter(function(element, index, arr){
                return ! AnswerStore.getState().has(element.toString());
            });
            if(notLoaded.length > 0){
                
                var filterString = "$filter=";
                for(var i = 0; i < notLoaded.length ; i++){
                    if(i != notLoaded.length - 1){
                        filterString += "ID eq " + notLoaded[i] + " or ";
                    }else{
                        filterString += "ID eq " + notLoaded[i];
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
                            type: AnswerActionTypes.GETANSWER,
                            answers : answersArr
                        });
                    });
            }
    }
}
export default API;