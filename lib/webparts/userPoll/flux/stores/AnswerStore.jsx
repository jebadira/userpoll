import {ReduceStore} from 'flux/utils';
import UserPollDispatcher from '../dispatchers/dispatcher';
import AnswerActionTypes from '../actions/AnswerActionTypes';
import PollActionTypes from '../actions/PollActionTypes.js';
import Immutable from 'immutable';

class AnswerStore extends ReduceStore{
    constructor(){
        super(UserPollDispatcher);
    }

    getInitialState(){
        const init = Immutable.Map();
        return init;
    }

    reduce(state,action){

        switch(action.type){
            case AnswerActionTypes.GETANSWER:
            debugger;
                return state.merge(action.answers);
                break;
            case PollActionTypes.GETLISTDATA:
                return state.merge(action.answers);
                break;
            case PollActionTypes.NEXTSUBQUESTION:
                return state.merge(action.getAnswers);
                break; 
            default:
                return state;
                break;
        }
    }
}

export default new AnswerStore();