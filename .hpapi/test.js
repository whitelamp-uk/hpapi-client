

(function ( ) {

    var test = {

        uuid : {
            htmlId : "bab-test-get-uuid"
            finishFn : test.getUuidFinish
        }
       ,results: {
            getUuid : null
        }
       ,nodeUrl : "https://my.http.post/api/"

       ,_init : function ( ) {
            // Handle a request for uuid data
            document.getElementById('test-link').addEventListener('click',this.getUuid.bind(this));
            // Done
            console.log ('test._init(): initialised');
        }

       ,_load : function (evt) {
            evt.preventDefault ();
            var frm                     = evt.target.form;
            if (frm.code.value!=0) {
                console.log ("finish(): failed to get a return value, error: "+frm.code.value+" "+frm.error.value);
                return;
            }
            var obj                     = JSON.parse (frm.json.value);
            this.results[obj.txnid]     = obj;
            console.log ("finish(): return value ="+JSON.stringify(object.response.returnValue));
            for (c in this.uuid) {
                if (this.uuid[c].htmlId==obj.txnid) {
                    this.uuid[c].finishFn ();
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
            var frm                     = document.getElementById('hpapi-new');
            frm.url.value               = this.nodeUrl;
            frm.txnid.value             = this.uuid.txnid;
            frm.class.value             = "\\Hpapi\\Utility";
            frm.method.value            = "uuid";
            frm.argcount.selectedIndex  = 2;
            var args = frm.getElementsByClassName('argument');
                // YYYYMMDD
                args[0].value   = new Date().toISOString().replace(/-/g,'').split('T')[0];
                // HHMMSS
                args[1].value   = new Date().toISOString().replace(/:/g,'').replace('.','T').split('T')[1];
            frm.created.addEventListener('click',this._post.bind(this));
            frm.new.click();
        }

       ,getUuidFinish : function (evt) {
            // Code for rendering the data payload to the user goes here
            alert ('UUID = '+this.results[this.uuid.htmlId].response.returnValue.name);
        }

    }

    test._init ();

})();

