import React from 'react';
import $ from 'jquery';
import CheckAnswer from './CheckAnswer.jsx';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup';
import {IconButton} from 'office-ui-fabric-react/lib/Button';
import styles from './less/userpoll.less';
import {css} from 'office-ui-fabric-react';
import AnswerActions from '../flux/actions/AnswerActions.js';
export default class AnswerWrapper extends React.Component{
    constructor(props){
        super(props);
        
        this.handleChoiceGroup = this.handleChoiceGroup.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
        /*this.getAnswerInformation = this.getAnswerInformation.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
        
        this.handleCheckGroup = this.handleCheckGroup.bind(this);*/
    }

     handleChoiceGroup(e, answer){
       AnswerActions.RadioAnswer(answer);
    }
    //this.props.onAnswer()
    handleAnswer(answer){
        var answerobj = {
            key : this.props.answerIds[0],
            text : answer
        };
        AnswerActions.TextAnswer(answerobj);
    }
    /*
   
    handleCheckGroup(ID, checked){
        var answer = '';
        for(var i = 0; i < this.state.answers.length ; i++){
            if(this.state.answers[i].ID === ID){
                answer = this.state.answers[i].answer;
                break;
            }
        }
        this.props.handleCheck(answer, checked);
    }

    getAnswerInformation(answers){
        //get information for the answers.
        var closure = this;
        var filterString = "$filter=";
        for(var i = 0; i < answers.length ; i++){
            if(i != answers.length - 1){
                filterString += "ID eq " + answers[i] + " or ";
            }else{
                filterString += "ID eq " + answers[i];
            }
        }
        var promise = $.ajax({
            url: "https://asuep.sharepoint.com/sites/DLDev/fdsa/_api/web/lists/GetByTitle('User Poll Answers')/items?" + filterString,
            method : "GET",
            contentType: "application/json",
            dataType: "json",
            beforeSend : function(xhr){
                xhr.setRequestHeader("accept", "application/json;"); 
            },
        });
        promise.done(function(data){
            var answersArr = [];
            for(var i = 0; i < data.value.length; i++){
                answersArr.push({
                    answer : data.value[i].AnswerUserPollAnswers,
                    ID : data.value[i].ID,
                    nextQuestion : data.value[i].NextQuestionUserPollAnswersId,

                });
            }
            closure.setState({answers : answersArr});
        });
        promise.fail(function(data){
        });
    }*/
    componentDidMount(){
        //this.getAnswerInformation(this.props.answers);
        //AnswerActions.getAnswerData(this.props.answerIds);
    }
    render(){
        var body = "";
        var closure = this;
            switch(this.props.type){
                case "Text":
                if(this.props.currentAnswers.length > 0){
                    body = <div><h4>There was a problem, contact your administrator</h4></div>
                }else if ( this.props.currentAnswers.length == 0){
                    body = <div></div>
                    }else{
                    body = <div>
                            <TextField key={this.props.currentAnswers[0].first().ID}
                                label={this.props.currentAnswers[0].first().answer} 
                                required={true} 
                                onChanged={ this.handleAnswer}
                                value={''} />
                            </div>
                }
                
                    break;
                case "Text Area":
                if(this.props.currentAnswers.length > 1){
                    body = <div><h4>There was a problem, contact your administrator</h4></div>
                }else{
                    body = <div>
                        <TextField key={this.props.currentAnswers[0].ID}
                                label={this.props.currentAnswers[0].answer} 
                                required={true} 
                                onChanged={ this.handleAnswer}
                                value={this.props.answer ? this.props.answer.get('text') : ''}
                                multiline={true} 
                                autoAdjustHeight={true}
                                 />
                        </div>
                }
                    break;
                case "Radio" :
                    if(this.props.currentAnswers.length > 0){
                        
                        var selectedKey = ""
                        if(this.props.answer){
                            selectedKey = this.props.answer.get('key');
                        }
                        const radios = this.props.currentAnswers.map(function(answer){
                            return { key : answer.get('ID'),
                                     text : answer.get('answer')};
                        });
                        body = <div><ChoiceGroup
                            label=""
                            options={radios}
                            defaultSelectedKey={
                                selectedKey
                            }
                            selectedKey={
                                selectedKey
                            }
                            onChange={this.handleChoiceGroup}
                            /></div>
                    }else{
                        body = <div><h4>There was a problem, contact your administrator</h4></div>
                    }
                    break;
                case "CheckBox":
                var closure = this;
                    if(this.props.currentAnswers.length > 0){
                        const checks = this.props.currentAnswers.map(function(answer){
                            var checked = false;
                            debugger;
                            if(closure.props.answer){
                                debugger;
                                if(closure.props.answer.has(answer.get("ID").toString())){
                                    checked = true;
                                }
                            }
                            
                            return (<CheckAnswer key={answer.get("ID")} answer={answer} checked={checked}/>);
                        });
                        body = <div>{checks}</div>
                    }else{
                        body = <div><h4>There was a problem, contact your administrator</h4></div>
                    }
                    break;
                default:
                body = <div></div>
                    break;
            }
                
       /* return (<div>
            {body}
            <div  className={css(styles.buttonContainer)}>
                  {this.state.questionPosition > 0 ? 
                  <IconButton
                    onClick={this.previousQuestion}
                    className={css(styles.prevButton)}
                    icon='ChevronLeft'
                    title='Prev'
                    ariaLabel='Prev'
                  />
                  :
                  null}
                  {this.state.questionPosition < this.state.questions.length -1 ? 
                  <IconButton 
                  className={css(styles.nextButton)}
                  icon='ChevronRight'
                  title="Next"
                  ariaLabel="Next"
                  onClick={this.nextQuestion} 
                  disabled={
                    this.state.answers[this.state.questionPosition] 
                    && this.state.answers[this.state.questionPosition].answer.length > 0
                    ? false : true
                  }
                   />
                  : 
                  null
                  }
                </div>
        </div>);*/

        return (<div>{body}</div>);
    }
}