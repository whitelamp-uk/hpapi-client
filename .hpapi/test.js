

(function ( ) {

var test = {

        forms : [
        ]
       ,txns : {
            uuid: {
                txnid : "bab-test-get-uuid"
               ,finishFn : "this.getUuidFinish()"
            }
        }
       ,results: {
            getUuid : null
        }

       ,_init : function ( ) {
            // Handle a request for uuid data
            document.getElementById('test-link').addEventListener('click',this.getUuid.bind(this));
            // Done
            console.log ('test._init(): initialised');
        }

       ,_load : function (evt) {
            evt.preventDefault ();
        var frm                         = evt.target.form;
            if (frm.code.value!=0) {
                console.log ("test._load(): failed to get a return value, error: "+frm.code.value+" "+frm.error.value);
                return;
            }
        var obj                         = JSON.parse (frm.json.value);
            document.removeChild (frm);
            frm                         = null;            
            console.log ("test._load(): return value ="+obj.response.returnValue);
            this.results[obj.txnid]     = obj;
            for (t in this.txns) {
                if (this.txns[t].txnid==obj.txnid) {
                    eval (this.txns[t].finishFn);
                    return;
                }
            }
        }

       ,_post : function (evt) {
            evt.preventDefault ();
        var frm = document.getElementById (evt.target.form.txnid.value);
            frm.ready.addEventListener ('click',this._load.bind(this));
            frm.post.click();
        }

       ,getUuid : function (evt) {
            evt.preventDefault ();
        var frm                         = document.getElementById('hpapi-new');
            frm.txnid.value             = this.txns.uuid.txnid;
            frm.class.value             = "\\Hpapi\\Utility";
            frm.method.value            = "uuid";
            frm.argcount.selectedIndex  = 2;
        var args                        = frm.getElementsByClassName('argument');
            // YYYYMMDD
            args[0].value               = new Date().toISOString().replace(/-/g,'').split('T')[0];
            // HHMMSS
            args[1].value               = new Date().toISOString().replace(/:/g,'').replace('.','T').split('T')[1];
            frm.created.addEventListener('click',this._post.bind(this));
            frm.new.click();
        }

       ,getUuidFinish : function (evt) {
            // Code for rendering the data payload to the user goes here
            alert ('UUID = '+this.results[this.txns.uuid.txnid].response.returnValue);
        }

    }

    test._init ();

})();

