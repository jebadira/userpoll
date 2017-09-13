import PollActionTypes from './PollActionTypes.js';
import $ from 'jquery';
import Dispatcher from '../dispatchers/dispatcher.js';
import API from '../api/PollApi.js';
import QuestionApi from '../api/QuestionApi.js';
import PollStore from '../stores/PollStore.jsx';
import AnswerStore from '../stores/AnswerStore.jsx';
import QuestionStore from '../stores/QuestionStore.jsx';

const Actions ={
    Submit(pollId){
        //do some work before we send it off to the api. 
        Dispatcher.dispatch({
            type:PollActionTypes.SUBMITTING
        });
        API.submit(pollId);
    },
    getListData(endPoint, pollId){
        debugger;
        API.checkForAnswers(endPoint, pollId);
    },
    nextQuestion(){
        //do something for checks
        debugger;   
        const answer = PollStore.getState().get("pollResults").get(PollStore.getState().get("currentId"));
       debugger;
       if(answer && answer.get("key")){
            var next = AnswerStore.getState().get(answer.get("key").toString()).get("nextQuestion");
            if(next){
            //set the state to next value.
                if(QuestionStore.getState().has(next.toString())){
                        Dispatcher.dispatch({
                            type: PollActionTypes.NEXTSUBQUESTION,
                            ID : next
                        });
                }else{
                        Dispatcher.dispatch({
                            type: PollActionTypes.SPINNER,
                        });
                        QuestionApi.GetQuestionData(next.toString());
                }
            
            }else{
                //
                Dispatcher.dispatch({
                    type: PollActionTypes.NEXTQUESTION,
                    
                });
            }
       }
       else{
            //we have checkboxs here.
            var nextquestions = [];
            const keyseq = PollStore.getState().get("pollResults").get(PollStore.getState().get("currentId")).keySeq();
            for(var i = 0; i < keyseq.count(); i ++){
                if(AnswerStore.getState().get(keyseq.get(i)).get("nextQuestion")){
                    nextquestions.push(AnswerStore.getState().get(keyseq.get(i)).get("nextQuestion"));
                }
            }
            if(nextquestions.length > 0){
                 Dispatcher.dispatch({
                    type: PollActionTypes.CHECKSUBQUESTION,
                    IDs : nextquestion
                });
            }else{
                 Dispatcher.dispatch({
                    type: PollActionTypes.NEXTQUESTION,
                    
                });
            }
       }
       
    },
    prevQuestion(){
            Dispatcher.dispatch({
                type: PollActionTypes.PREVQUESTION
            });
    }
}


export default Actions;