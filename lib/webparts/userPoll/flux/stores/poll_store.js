import fbemiter from 'fbemitter';
import update from 'immutability-helper';
var Dispatcher = require("../dispatchers/dispatcher.js");
define("PollStore",
    function(){
        var _pollId = "";
        var _User = {
            userId : "",
            formDigest : "",
            userName : ""
        };
        var _answers = {

        }
        var _questionPosition = 0;
        var events = new fbemitter.EventEmitter();
       
        var API = {
            addUserLoadedListener : function(callback){
                events.addListener('userLoaded', callback);
                
            },
            removeUserLoadedListener: function(callback){
                events.removeListener('userLoaded', callback);
            },
            setUserData : function(user){
                const oldData = _User;
                const newData = update(oldData, {$merge : user.user});
                _User.userId = newData.userId;
                _User.formDigest = newData.formDigest;
                _User.userName = newData.userName;
                events.emit("userLoaded");
            },
            addSubmitPollListener : function(callback){
                events.addLitsener("submitPoll", callback);
            }
            
            
        };

        API.dispatchToken = Dispatcher.register(function(action){
            switch(action.type){
                case "user-data-loaded":
                API.setUserData(action);
                    break;
                case "submit-poll":
                    API.SetPoll();
                    break;
            }
        });
        return API;

    });