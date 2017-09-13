import React from 'react';
export default class Answer extends React.Component{
    constructor(props){
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(text){
        //e.target.value;
        this.props.onAnswer(text);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.questionId !== this.props.questionId){
            //reset the textfield.
        }
    }
    render(){
        return(
            <TextField 
                label={this.props.answer.answer} 
                required={true} 
                onChanged={ this.handleInputChange} />
        );
    }

}