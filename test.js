

(function ( ) {

    var test = {

        txn : {
            getUuid : "test-get-uuid"
        }

       ,_init : function ( ) {
            document.getElementById('test-link').addEventListener('click',this.getUuid.bind(this));
            console.log ('test._init(): initialised');
        }

       ,getUuid : function (evt) {
            evt.preventDefault ();
            // Use hpapi.js to run \Bab\Doorstepper::uuid([date],[time])
            var frm             = document.getElementsByClassName('hpapi')[0];
            // Transaction/element ID to pick up the response JSON
            frm.txnid.value     = this.txn.getUuid;
            // All hpapi form values can be modified by a script
            // but in doorstepper.js everything is in the form except:
            // Method
            frm.class.value     = "\\Hpapi\\Utility";
            frm.method.value    = "uuid";
            // Set two arguments (exact argument count required by the method)
            frm.argcount.selectedIndex  = 2;
            var args = frm.getElementsByClassName('argument');
                // YYYYMMDD
                args[0].value   = new Date().toISOString().replace(/-/g,'').split('T')[0];
                // HHMMSS
                args[1].value   = new Date().toISOString().replace(/:/g,'').replace('.','T').split('T')[1];
            // Listen for hpapi ready button which is clicked by an XMLHttpRequest.onloadend() handler
            frm.getElementsByClassName('ready')[0].addEventListener('click',this.getUuidFinish.bind(this));
            // Everything is prepared so post the request by clicking the post button
            frm.getElementsByClassName('post')[0].click();
        }

       ,getUuidFinish : function (evt) {
            evt.preventDefault ();
            console.log ("getUuidReady(): hpapi is ready");
            var frm             = evt.target.form;
            console.log ("getUuidReady(): status = "+frm.status.options[frm.status.selectedIndex].value);
            console.log ("getUuidReady(): code = "+frm.code.value);
            console.log ("getUuidReady(): error = "+frm.error.value);
            console.log ("getUuidReady(): warning = "+frm.warning.value);
            console.log ("getUuidReady(): notice = "+frm. notice.value);
            if (frm.code.value!=0) {
                console.log ("getUuidReady(): failed to get UUID from server, error: "+code+" "+error);
                return;
            }
            var object          = JSON.parse (document.getElementById(this.txn.getUuid).value);
            console.log ("getUuidReady(): UUID ="+object.response.returnValue);
        }

    }

    test._init ();

})();

