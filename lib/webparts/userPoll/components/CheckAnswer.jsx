import React from 'react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import AnswerActions from '../flux/actions/AnswerActions.js';
export default class CheckAnswer extends React.Component{
    constructor(props){
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(e, checked){
        //this.props.onCheck(this.props.answer.ID ,checked);
        
        AnswerActions.CheckAnswer(this.props.answer.get('ID'), this.props.answer.get('answer'));
    }
    render(){
        var closure = this;
      
        return(<div>
                <Checkbox checked={this.props.checked} 
                label={this.props.answer.get('answer')} onChange={this.handleInputChange}/>
            </div>);
    }

}