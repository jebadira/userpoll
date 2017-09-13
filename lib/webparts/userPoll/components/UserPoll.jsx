import * as React from 'react';
import styles from './less/userpoll.less';
import update from 'immutability-helper';
import $ from 'jquery';
import Question from './Question.jsx';
import {Spinner, SpinnerSize} from 'office-ui-fabric-react/lib/Spinner';
import {IconButton, PrimaryButton} from 'office-ui-fabric-react/lib/Button';
import {css} from 'office-ui-fabric-react';
var batch = require("./batch");
export default class UserPoll extends React.PureComponent{
  constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.nextQuestion = this.nextQuestion.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
  }
  prevQuestion(e){
    e.preventDefault();
    this.props.actions.prevQuestion();
  }
  nextQuestion(e){
    e.preventDefault();
    this.props.actions.nextQuestion();
  }
  sendPayload(digestobject, userID, username){
     
  }
  onSubmit(e){
    this.props.actions.onSubmit(this.props.pollId);
  }
  componentDidMount(){
      this.props.actions.getListData("https://asuep.sharepoint.com/sites/DLDev/fdsa/_api/web/lists/GetByTitle('User Polls')/items?$filter=ID eq " + this.props.pollId
      ,this.props.pollId);
  }
  render() {
    return (
      <div className={styles.helloWorld}>
        {this.props.submitting ? 
        
        <Spinner size={SpinnerSize.large}
        label="Submitting Poll..." />
        : null }
        {this.props.submit ? null :
          this.props.spinner ? 
            <Spinner size={SpinnerSize.large}
            label="Loading Question..." />
        : <Question 
            answer={this.props.answer} 
            currentAnswers={this.props.currentAnswers} 
            question={this.props.currentQuestion}/>
        }
        {
        this.props.prev && !this.props.spinner  && !this.props.submit?
        <IconButton
                onClick={this.prevQuestion}
                className={css(styles.prevButton)}
                icon='ChevronLeft'
                title='Prev'
                ariaLabel='Prev'
              /> : null}
         {this.props.next && !this.props.spinner && !this.props.submit? 
         <IconButton 
                className={css(styles.nextButton)}
                icon='ChevronRight'
                title="Next"
                ariaLabel="Next"
                disabled={this.props.nextDisabled}
                onClick={this.nextQuestion}
                /> : null}
          {this.props.submit && !this.props.spinner && !this.props.submitting && !this.props.submitted? 
          <div>
            <h3>You are about to submit your poll, please make any final changes.</h3>
            <h3>You will not be able to change your answers after you submit</h3>
            <div>
              <IconButton
                  onClick={this.prevQuestion}
                  className={css(styles.prevButton)}
                  icon='ChevronLeft'
                  title='Prev'
                  ariaLabel='Prev'
                /> 
              <PrimaryButton onClick={this.onSubmit}>Submit</PrimaryButton> 
            </div>
            </div>
            : null }
            {this.props.submitted ? 
            <h3>You answers have been submitted</h3> : null}
        
      </div>
    );
  }
}
