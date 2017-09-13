import AnswerActionTypes from './AnswerActionTypes.js';
import PollActionTypes from './PollActionTypes.js';
import PollStore from '../stores/PollStore.jsx';
import QuestionStore from '../stores/QuestionStore.jsx';
import $ from 'jquery';
import Dispatcher from '../dispatchers/dispatcher.js';
import AnswerStore from '../stores/AnswerStore.jsx';
import AnswerApi from '../api/AnswerApi.js';
const Actions = {
    getAnswerData(answerIds){
        debugger;
        Dispatcher.dispatch({
            type: PollActionTypes.SPINNER
        });
        AnswerApi.getAnswerData(answerIds);
    },
    RadioAnswer(answer){
        Dispatcher.dispatch({
            answer: answer,
            type: AnswerActionTypes.RADIOANSWER
        });
    },
    TextAnswer(answer){
        Dispatcher.dispatch({
            answer: answer,
            type: AnswerActionTypes.TEXTANSWER
        });
    },
    CheckAnswer(id, answer){
        Dispatcher.dispatch({
            answer: answer,
            ID : id,
            type: AnswerActionTypes.CHECKANSWER
        });
    }
}
export default Actions;