import {ReduceStore} from 'flux/utils';
import UserPollDispatcher from '../dispatchers/dispatcher';
import PollActionTypes from '../actions/PollActionTypes';
import AnswerActionTypes from '../actions/AnswerActionTypes.js';
import Immutable from 'immutable';
import QuestionStore from './QuestionStore.jsx';
import AnswerStore from './AnswerStore.jsx';
class PollStore extends ReduceStore{
    constructor(){
        super(UserPollDispatcher);
    }

    getInitialState(){
       const init = Immutable.Map();
       
        
        return init.merge(
                {
                    "poll" : Immutable.Map(),
                    "currentId" : "0",
                    "questionOrder" : Immutable.Stack(),
                    "topLevelQuestions" : Immutable.List(),
                    "submit" : false,
                    "prev" : false,
                    "next" : false,
                    'nextDisabled' : true,
                    'spinner' : true,
                    "pollResults" : Immutable.Map(),
                    'submitted' : false,
                    'submitting' : false
                }
        );
    }
    reduce(state, action){
        switch (action.type){
            case PollActionTypes.SUBMIT :
                return state.merge({"submitted" : true, "submitting" : false, "submit" : true});
            case PollActionTypes.GETLISTDATA:
            debugger;
                const keys = Object.keys(action.questions);
                if(keys.length > 0){
                    const lowestId = action.questions[keys[0]].ID.toString();
                    var ids = [];
                    for(var prop in action.questions){
                        if(action.questions.hasOwnProperty(prop)){
                            ids.push(prop.toString());
                        };
                    }
                    var submit = ids.length <= 1;
                    var prev = false;
                    var next = ids.length >= 1;
                    const addId = state.get("topLevelQuestions").merge(ids);
                    const setFirstQuestion = state.get("questionOrder").push(addId.first());
                    const setId = state.merge({ "currentId" : lowestId,
                                                "topLevelQuestions" : addId,
                                                "submit" : submit,
                                                "prev" :prev,
                                                "next" : next,
                                                'spinner' : false,
                                                "questionOrder" : setFirstQuestion});
                    return setId;
                }else{
                    return state;
                }
                /*const om = Immutable.OrderedMap();
                const mergedState = state.get("poll").set({"questions" : om.merge(action.questions)});
                const lowestId = mergedState.get("poll").get("questions").minBy(x => x.ID);
                const currentIdState = mergedState.get("poll").set({"currentID": lowestId});*/
                case PollActionTypes.NEXTQUESTION:
                debugger;
                    if(state.get("checkIds") && state.get("checkIds").count() > 0){
                        const checkfirstQuestionid = state.get("checkIds").peek();
                        const removefirst = state.get('checkIds').pop();
                        const mergestack = state.merge({"checkIds": removefirst});
                        const addIndex = mergestack.get("questionOrder").push(checkfirstQuestionid);
                        const prevm = mergestack.set('prev', true);
                        const current = prevm.set("currentId", checkfirstQuestionid);
                        if(state.get('pollResults').has(removefirst)){
                             if(state.get('pollResults').get(removefirst).get('text').length > 0){
                                 return current.merge({"questionOrder" : addIndex, "nextDisabled" : false});
                             }else{
                                    if(QuestionStore.getState().has(removefirst) && QuestionStore.getState().get(removefirst).get("type") == "CheckBox"
                                    && state.get('pollResults').get(removefirst).count() > 0){
                                        //handle check
                                        return current.merge({"questionOrder" : addIndex, "nextDisabled" : false});

                                    }else{
                                        return current.merge({"questionOrder" : addIndex, "nextDisabled" : true});
                                    }
                                }
                        }else{
                            return current.merge({"questionOrder" : addIndex, "nextDisabled" : true});
                        }
                    }else{
                        var index;
                        for(var i =0; i < state.get("topLevelQuestions").count(); i++){
                            if(
                                typeof(state.get("questionOrder").keyOf(
                                    state.get("topLevelQuestions").get(i.toString())
                                ))== 'undefined'){
                                    index = state.get("topLevelQuestions").get(i.toString());
                                    
                                    break;
                            }
                        }
                        if(typeof(index) !== 'undefined'){
                            //we found the next question
                            const addIndex = state.get("questionOrder").push(index);
                            const prevmap = state.set('prev', true);
                            const setcurrent = prevmap.set("currentId", index);
                            if(state.get('pollResults').has(index)){
                                if(state.get('pollResults').get(index).get('text') && state.get('pollResults').get(index).get('text').length > 0){
                                    return setcurrent.merge({"questionOrder" : addIndex, "nextDisabled" : false});
                                }else{
                                    if(QuestionStore.getState().has(index) && QuestionStore.getState().get(index).get("type") == "CheckBox"
                                    && state.get('pollResults').get(index).count() > 0){
                                        //handle check
                                        return setcurrent.merge({"questionOrder" : addIndex, "nextDisabled" : false});

                                    }else{
                                        return setcurrent.merge({"questionOrder" : addIndex, "nextDisabled" : true});
                                    }
                                }
                            }else{
                                return setcurrent.merge({"questionOrder" : addIndex, "nextDisabled" : true});
                            }
                        }else{
                            //otherwise we are out of questions.
                            const addIndex = state.get("questionOrder").push("-1");
                            return state.merge({"questionOrder" : addIndex , 'submit': true, 'next': false});
                        }
                    }
                    break;
                case PollActionTypes.NEXTSUBQUESTION: 
                    //action.ID
                    debugger;
                    const prevmap = state.set("prev", true);
                    const addID = state.get('questionOrder').push(action.ID.toString());
                    const setcurrent = prevmap.set("currentId", action.ID.toString());
                    //perform a check on the answer.
                    if(state.get('pollResults').has(action.ID.toString())){
                                if(state.get('pollResults').get(action.ID.toString()).get('text') && state.get('pollResults').get(action.ID.toString()).get('text').length > 0){
                                     return setcurrent.merge({'questionOrder' : addID, 'spinner' : false, "nextDisabled" : false});
                                }else{
                                    if(QuestionStore.getState().has(action.ID.toString()) && QuestionStore.getState().get(action.ID.toString()).get("type") == "CheckBox"
                                    && state.get('pollResults').get(action.ID.toString()).count() > 0){
                                        //handle check
                                         return setcurrent.merge({'questionOrder' : addID, 'spinner' : false, "nextDisabled" : false});

                                    }else{
                                        return setcurrent.merge({'questionOrder' : addID, 'spinner' : false, "nextDisabled" : true});
                                    }
                                }
                    }else{
                        return setcurrent.merge({'questionOrder' : addID, 'spinner' : false, "nextDisabled" : true});
                    }
                    break;
                case PollActionTypes.PREVQUESTION:
                    /*const newerMap = state.set("currentId", state.get("questionOrder").get(action.ID));
                    return newerMap.set('prev' , action.prev);*/
                    if(state.get("questionOrder").count() > 0){
                        const remove = state.get('questionOrder').pop();
                        const value = remove.peek();
                        var prev = true;
                        if(remove.count() == 1){
                            prev = false;
                        }
                        const setCurrent = state.set('currentId', value);
                        return setCurrent.merge({
                            "questionOrder" : remove,
                            "prev" : prev, 
                            'next' : true, 
                            'submit' : false, 
                            'nextDisabled' : false});
                        
                    }else{
                        return state;
                    }
                    break;
                case PollActionTypes.GETPOLLQUESTIONS:
                    
                    break;
                case AnswerActionTypes.RADIOANSWER :
                debugger;
                    var answer = {};
                    answer[state.get("currentId").toString()] = action.answer;
                    if(action.answer.text.length > 0){
                        return state.merge({"pollResults" : state.get("pollResults").merge(answer),
                                                "nextDisabled" : false});
                    }else{
                        return state.merge({"pollResults" : state.get("pollResults").merge(answer),
                                                "nextDisabled" : true});
                    }
                break;
                case AnswerActionTypes.TEXTANSWER:
                debugger;
                    var answer = {};
                    answer[state.get("currentId").toString()] = action.answer;
                    if(action.answer.text.length > 0){
                        return state.merge({"pollResults" : state.get("pollResults").merge(answer), 
                                                "nextDisabled" : false});
                    }else{
                        return state.merge({"pollResults" : state.get("pollResults").merge(answer),
                                            "nextDisabled" : true});
                    }
                break;
                case AnswerActionTypes.CHECKANSWER:
                    debugger;
                    var answer;
                    const prevlist = state.get('pollResults').get(state.get('currentId'));
                    if(!prevlist){
                        answer = Immutable.Map();
                        var answerobj = {};
                        answerobj[action.ID] = action.answer;
                        const addAnswer = answer.merge(answerobj);
                        const currentid = state.get('currentId');
                        var buildanswerobj = {};
                        buildanswerobj[currentid] = addAnswer;
                        const addToResults = state.get('pollResults').merge(buildanswerobj);
                        return state.merge({"pollResults" : addToResults,'nextDisabled' : false});
                    }else{
                        if(prevlist.has(action.ID.toString())){
                            var buildobj = {};
                            buildobj[state.get('currentId')] = state.get('pollResults').get(state.get('currentId')).delete(action.ID.toString());
                            const mergeing = state.get('pollResults').merge(buildobj);
                            if(mergeing.get(state.get('currentId')).count() > 0){
                                 return state.merge({"pollResults" : mergeing, 'nextDisabled' : false});
                            }else{
                                return state.merge({"pollResults" : mergeing, 'nextDisabled' : true});
                            }
                        }else{
                            var answerobj = {};
                            answerobj[action.ID] = action.answer;
                            const addToResults = state.get('pollResults').get(state.get('currentId')).merge(answerobj);
                            var buildobj = {};
                            buildobj[state.get('currentId')] = addToResults;
                            const mergeIntoPoll = state.get('pollResults').merge(buildobj);
                            return state.merge({'pollResults' : mergeIntoPoll, 'nextDisabled' : false});

                        }
                    }

                break;
                case PollActionTypes.CHECKSUBQUESTION:
                if(state.get('checkIds')){
                    const checkquestions = state.get("checkIds");
                }else{
                    const checkquestions = state.set("checkIds", Immutable.Stack());
                }
                    const addIds = checkquestions.get("checkIds").unshiftAll(action.IDs);
                    const mergeids = checkquestions.merge({"checkIds": addIds});
                    const checkfirstQuestionid = mergeids.get("checkIds").peek();
                    const removefirst = mergeids.get('checkIds').pop();
                    const mergestack = mergeids.merge({"checkIds": removefirst});
                    const addIndex = mergestack.get("questionOrder").push(checkfirstQuestionid);
                    const prevm = mergestack.set('prev', true);
                    const current = prevm.set("currentId", checkfirstQuestionid);
                    return current.merge({"questionOrder" : addIndex});
                break;
                case PollActionTypes.SPINNER:
                    debugger;
                    return state.set("spinner", true);
                break;
                 case PollActionTypes.SUBMITTING:
                    debugger;
                    return state.set("submitting", true);
                break;
                case AnswerActionTypes.GETANSWER:
                    debugger;
                    return state.set("spinner", false);
                break;
                default:
                return state;
        }
    }
}
export default new PollStore();