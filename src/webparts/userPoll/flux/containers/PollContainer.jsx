'use strict'

import React from 'react';
import Utils from 'flux/utils';
import UserPoll from '../../components/UserPoll.jsx';
import PollStore from '../stores/PollStore.jsx';
import QuestionStore from '../stores/QuestionStore.jsx';
import PollActions from '../actions/PollActions.js';
import AnswerStore from '../stores/AnswerStore.jsx';
class PollContainer extends React.Component{
    static getStores(){
        return [PollStore, QuestionStore, AnswerStore];
    }

    static calculateState(prevState, props){
        debugger;
        var answers = [];
        var answerArr = [];
        if(QuestionStore.getState().count() > 0 ){
            answers = QuestionStore.getState().get(PollStore.getState().get("currentId")).get("answerIds");
                for(var i = 0; i < answers.count(); i++){
                    debugger;
                    if(AnswerStore.getState().has(answers.get(i).toString())){
                        answerArr.push(AnswerStore.getState().get(answers.get(i).toString()));
                    }
                }
        }
        debugger;
        return{
            pollId : props.poll,
            currentQuestion: QuestionStore.getState().get(PollStore.getState().get("currentId")),
            currentId : PollStore.getState().get("currentId"),
            submit : PollStore.getState().get("submit"),
            prev : PollStore.getState().get("prev"),
            next : PollStore.getState().get("next"),
            nextDisabled : PollStore.getState().get('nextDisabled'),
            actions: {
                onSubmit: PollActions.Submit,
                getListData : PollActions.getListData,
                nextQuestion : PollActions.nextQuestion,
                prevQuestion: PollActions.prevQuestion
            },
            spinner: PollStore.getState().get('spinner'),
            currentAnswers : answerArr,
            answer : PollStore.getState().get("pollResults").get(PollStore.getState().get("currentId")),
            submitted : PollStore.getState().get('submitted'),
            submitting: PollStore.getState().get('submitting'),
        }
    }
    render(){
        debugger;
        return <UserPoll 
            pollId={this.state.pollId}
            actions={this.state.actions}
            currentQuestion={this.state.currentQuestion}
            currentId={this.state.currentId}
            next={this.state.next}
            prev={this.state.prev}
            submit={this.state.submit}
            currentAnswers={this.state.currentAnswers}
            answer={this.state.answer}
            spinner={this.state.spinner}
            nextDisabled= {this.state.nextDisabled}
            submitted={this.state.submitted}
            submitting={this.state.submitting}
            />
    }
}

export default Utils.Container.create(PollContainer, {withProps: true});