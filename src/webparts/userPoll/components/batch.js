import Guid from 'guid';
define("batch", 
    function(){
        var _batchGuid = Guid.raw();
        var _changeSetId = Guid.raw();
        var _batchContents = [];
        var _batchbody = "";
        return {
            batchGuid : function(){
                return _batchGuid;
            },
            batchBody : function(){
                return _batchbody;
            },
            addGet : function(endpoint){
                _batchContents.push('--batch_' + _batchGuid);
                _batchContents.push('Content-Type: application/http');
                _batchContents.push('Content-Transfer-Encoding: binary');
                _batchContents.push('');
                _batchContents.push('GET ' + endpoint + " HTTP/1.1");
                _batchContents.push("Accept : application/json;odata=verbose");
                _batchContents.push("");
                _batchbody = _batchbody.concat(_batchContents.join("\r\n"));
                _batchContents = new Array();

            },
            addPost: function(payload, endpoint, headers){
                debugger;
                _changeSetId = Guid.raw();
                for(var i = 0; i < payload.length; i ++){
                    _batchContents.push("--changeset_" + _changeSetId);
                    for(var prop in headers){
                        if(headers.hasOwnProperty(prop)){
                            _batchContents.push(prop + ": " + headers[prop]);
                        }
                    }
                    _batchContents.push("");
                    _batchContents.push("POST " + endpoint + " HTTP/1.1");
                    _batchContents.push("Content-Type: application/json;odata=verbose");
                    _batchContents.push("");
                    _batchContents.push(JSON.stringify(payload[i]));
                    _batchContents.push("");
                };
                _batchContents.push("--changeset_" + _changeSetId + "--");
                _batchbody = _batchbody.concat(_batchContents.join("\r\n"));
                _batchContents = new Array();
            },
            CreateBatch: function(headers){
                _batchContents.push("--batch_" + _batchGuid);
                _batchContents.push('Content-Type: multipart/mixed; boundary="changeset_' + _changeSetId + '"');
                _batchContents.push('Content-Length: ' + _batchbody.length);
                _batchContents.push('Content-Transfer-Encoding: binary');
                _batchContents.push('');
                _batchContents.push(_batchbody);
                _batchContents.push('');
                _batchContents.push("--batch_" + _batchGuid + '--');
                _batchbody = _batchContents.join("\r\n");
                _batchContents = new Array();
            },
            SendBatch : function(){
                return {
                    batchBody : this.batchBody,
                    batchGuid : this.batchGuid,

                }
            }


        }
    });