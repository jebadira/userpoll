import React from 'react';

export default class TextAreaAnswer extends React.Component{
    constructor(props){
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(e){

    }
    render(){
        return(<label>{this.props.AnswerUserPollAnswer}<textarea rows='4' cols='50' onChange={this.handleInputChange} type="text"></textarea></label>);
    }

}