import fbemitter from 'fbemitter';
import update from 'immutability-helper';
var Dispatcher = require("../dispatchers/dispatcher.js");

define("QuestionStore", 
    function(){
        var _questions = {};
        var events = new fbemitter.EventEmitter();

        var API = {
            addLoadListener : function(callback){
                events.addListener('load', callback);
            },
            removeLoadListener : function(callback){
                events.removeListener('load', callback);
            },
            loaded : function(id){
                var itemfound = _questions.filter(function(question){
                    return question.ID === id;
                });
                return itemfound.length === 1;
            },
            addQuestions : function(questions){
                for(var i = 0; i <  questions.length ; i++){
                    if(! _questions[questions[i].ID]){
                        _questions[questions[i].ID] = questions[i];
                    }
                }
            }
        }


        API.dispatchToken = Dispatcher.register(function(action){
            switch(action.type){
                case "question-loaded" : 
                    API.setLoaded(action.questions);
                    break;
            }

        });
        return API;
    });