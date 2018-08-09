

(function ( ) {

    var test = {

        nodeUrl: "https://hpapi.localhost/"
       ,txn : {
            getUuid : "test-get-uuid"
        }

       ,_init : function ( ) {
            document.getElementById('test-link').addEventListener('click',this.getUuid.bind(this));
            console.log ('test._init(): initialised');
        }

       ,getUuid : function (evt) {
            evt.preventDefault ();
            var frm             = document.getElementById('hpapi-new');
            frm.url.value       = this.nodeUrl;
            frm.txnid.value     = this.txn.getUuid;
            frm.class.value     = "\\Hpapi\\Utility";
            frm.method.value    = "uuid";
            frm.argcount.selectedIndex  = 2;
            var args = frm.getElementsByClassName('argument');
                // YYYYMMDD
                args[0].value   = new Date().toISOString().replace(/-/g,'').split('T')[0];
                // HHMMSS
                args[1].value   = new Date().toISOString().replace(/:/g,'').replace('.','T').split('T')[1];
            frm.created.addEventListener('click',this.getUuidPost.bind(this));
            frm.new.click();
        }

       ,getUuidPost : function (evt) {
            evt.preventDefault ();
            var pst = document.getElementById(this.txn.getUuid)
                pst.ready.addEventListener('click',this.getUuidFinish.bind(this));
                pst.post.click();
        }

       ,getUuidFinish : function (evt) {
            evt.preventDefault ();
            console.log ("getUuidReady(): hpapi is ready");
            var frm             = evt.target.form;
            console.log ("getUuidReady(): status = "+frm.status.options[frm.status.selectedIndex].value);
            console.log ("getUuidReady(): code = "+frm.code.value);
            console.log ("getUuidReady(): error = "+frm.error.value);
            console.log ("getUuidReady(): warning = "+frm.warning.value);
            console.log ("getUuidReady(): notice = "+frm.notice.value);
            if (frm.code.value!=0) {
                console.log ("getUuidReady(): failed to get UUID from server, error: "+frm.code.value+" "+frm.error.value);
                return;
            }
            var object          = JSON.parse (frm.json.value);
            console.log ("getUuidReady(): UUID ="+object.response.returnValue);
        }

    }

    test._init ();

})();

