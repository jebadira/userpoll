import {ReduceStore} from 'flux/utils';
import UserPollDispatcher from '../dispatchers/dispatcher';
import QuestionActionTypes from '../actions/QuestionActionTypes';
import PollActionTypes from '../actions/PollActionTypes';
import Immutable from 'immutable';
class QuestionStore extends ReduceStore{
    constructor(){
        super(UserPollDispatcher);
    }

    getInitialState(){
        return Immutable.Map();
    }
    reduce(state, action){
        switch (action.type){
           case QuestionActionTypes.GETQUESTION:
                return state.merge(action.questionsArr);
                break; 
           case PollActionTypes.GETLISTDATA:
           debugger;
                return state.merge(action.questions);
           break;
           case PollActionTypes.NEXTSUBQUESTION:
                return state.merge(action.questionsArr);
                break; 
           break;
            default:
                return state;
        }
    }
}
export default new QuestionStore();