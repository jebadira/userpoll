import React from 'react';
import AnswerWrapper from './AnswerWrapper.jsx';
import QuestionActions from '../flux/actions/QuestionActions';
export default class Question extends React.PureComponent{

    constructor(props){
        super(props);
        this.state={};
      /*  this.handleAnswer = this.handleAnswer.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
        this.handleSubQuestion = this.handleSubQuestion.bind(this);*/
}
    //this.props.onAnswer
    handleAnswer(answer){
        const answerObj = {
            questionID : this.props.question.ID,
            answer : answer,
        }
        this.props.onAnswer(answerObj);
    }
    handleChecked(answer, checked){
        const answerObj = {
            questionID : this.props.question.ID,
            answer : answer,
           checked : checked
        }
        this.props.onCheck(answerObj);
    }
    handleSubQuestion(id){
        this.props.handleSubQuestion(id);
    }
    handleNextQuestion (){
        this.props.nextQuestion();
    }
 
//add an on click for the answers? 
//use jq to get information
//add a submit button.
    componentDidMount(){
    }

    render(){
              //      <AnswerWrapper handleSubQuestion={this.handleSubQuestion} answer={this.props.answer} handleCheck={this.handleChecked} onAnswer={this.handleAnswer} questionId={this.props.question.ID} answers={this.props.question.answers} type={this.props.question.type}/>
        debugger;
        return(
            <div>
                <div>
                    <h3>{this.props.question ? this.props.question.get("question") : null}</h3>
                    <AnswerWrapper
                        answer={this.props.answer} 
                        type={this.props.question? this.props.question.get("type"): null} 
                        answerIds={this.props.question? this.props.question.get("answerIds").toArray(): []}
                        currentAnswers={this.props.currentAnswers}
                        />
                </div>
              
           </div>
        )
    }
}