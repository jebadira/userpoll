import React from 'react';
import AnswerWrapper from './AnswerWrapper.jsx';
import $ from 'jquery';
export default class SubQuestion extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.getQuestion();

    }
    
    getQuestion(){
       var closure = this;
            var promise = $.ajax({
            url: "https://asuep.sharepoint.com/sites/DLDev/fdsa/_api/web/lists/GetByTitle('User Poll Questions')/items('" + this.props.questionId + "')",
            //url : "https://asuep.sharepoint.com/sites/DLDev/Lists/UserPolls",
            method : "GET",
            contentType: "application/json",
            dataType: "json",
            beforeSend : function(xhr){
                xhr.setRequestHeader("accept", "application/json;"); 
            },
            
            });
            
            promise.done(function(data){
            //closure.setState({questionIDs: data.QuestionsUserPollPollsId});
                closure.setState({
                    question : data
                })
            });
            promise.fail(function(data){
            console.log(data);
            });
    }


     render(){
        return(
            <div>
                <div>
                    <h3>{this.state.question.question}</h3>
                    <AnswerWrapper handleSubQuestion={this.handleSubQuestion} answer={this.props.answer} handleCheck={this.handleChecked} onAnswer={this.handleAnswer} questionId={this.props.question.ID} answers={this.props.question.answers} type={this.props.question.type}/>
                </div>
              
           </div>
        )
    }
}