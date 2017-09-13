import React from 'react';

export default class RadioAnswer extends React.Component{
    constructor(props){
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(e){
        this.props.onAnswer(e.target.value);
    }
    render(){
        var closure = this;
        
        return(<div><label>
                    <input checked={this.props.checked} onClick={this.handleInputChange} type="radio" name="userpollanswer" value={this.props.answer.answer} />
                        {this.props.answer.answer}
                </label></div>);
    }

}