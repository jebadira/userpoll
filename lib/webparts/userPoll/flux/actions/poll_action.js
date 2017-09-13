import $ from 'jquery';
var Dispatcher = require("../dispatchers/dispatcher.js");

define("PollActions",

    function(){
        return {
            SubmitForm: function(batch){
                var getCurrentUser = $.ajax({
                    url: "https://asuep.sharepoint.com/sites/DLDev/fdsa/_api/Web/CurrentUser?$select=Id,Title",
                    method : "GET",
                    headers: { "Accept": "application/json;odata=verbose" }
                });
                getCurrentuser.done(function(data){
                    var userId = data.d.Id;
                    var username = data.d.Title;
                    var formdigest = $.ajax({
                        url: "https://asuep.sharepoint.com/sites/DLDev/fdsa/_api/contextinfo",
                        method : "POST",
                        headers: { "Accept": "application/json;odata=verbose" }
                    });
                    formdigest.done(function(data){
                       
                        Dispatcher.dispatch({
                            type: "user-data-loaded",
                            user : {
                                formDigest  :  data.d.GetContextWebInformation.FormDigestValue,
                                userName : username,
                                userId  : userId   
                            }
                        });
                         
      
                    });
                    
                });
            }
        }
    });