
(function ( ) {

var hpapi = {

        _init : function ( ) {
        var frm                             = document.getElementById ('hpapi-new');
            frm.reset ();
            try {
                frm.new.addEventListener('click',this.create.bind(this));
            }
            catch (e) {
                this.log ('hpapi._init(): could not listen to button name="new"');
            }
        }

       ,create : function (buttonEvent) {
            buttonEvent.preventDefault ();
            this.log ('hpapi:create(): creating new client request');
            try {
             var frm                        = buttonEvent.target.form;
                if (frm.txnid.value.length==0) {
                    this.log ('hpapi.create(): txnid was not given');
                    return;
                }
            var r                           = new RegExp (/^https?\:\/\/[^\s]+/);
                if (!r.test(frm.url.value)) {
                    this.log ('hpapi.create(): URL is not valid');
                    return;
                }
            var tid                         = frm.txnid.value;
            var jps                         = frm.json_pretty_string.value;
            var obj                         = {
                    txnid : tid
                   ,key : frm.key.value
                   ,email : frm.email.value
                   ,password : frm.password.value
                   ,datetime : new Date().toISOString()
                   ,method : {
                        vendor : frm.vendor.value
                       ,package : frm.package.value
                       ,class : frm.class.value
                       ,method : frm.method.value
                       ,arguments : new Array ()
                    }
                }
            var args                        = frm.getElementsByClassName ('argument');
                for (i in args) {
                    if (parseInt(i)!=i) {
                        continue;
                    }
                    if (i<frm.argcount.selectedIndex) {
                        obj.method.arguments.push (args[i].value);
                    }
                    else {
                        args[i].value       = '';
                    }
                }
            var pst                         = document.getElementById ('hpapi-template').cloneNode(true);
                pst.setAttribute ('id',tid);
                pst.txnid.value             = frm.txnid.value;
                pst.url.value               = frm.url.value;
                pst.timeout.value           = frm.timeout.value;
                pst.key.value               = frm.key.value;
                pst.email.value             = frm.email.value;
                pst.password.value          = frm.password.value;
                pst.json.value              = JSON.stringify (obj,null,jps);
                document.body.appendChild (pst);
                frm.password.value          = '';
                pst.post.addEventListener ('click',this.post.bind(this));
                this.log ('hpapi:create(): listening for post button');
                this.log ('hpapi:create(): reporting request is created');
                frm.created.click();
                return;
            }
            catch (e) {
                this.log ('hpapi.create(): '+e);
                return;
            }
        }

       ,log : function (str) {
            try {
                this.logger                 = document.getElementById('hpapi-logger').getElementsByTagName('textarea')[0];
                this.logger.value          += str + '\n';
            }
            catch (e) {
                console.log (str);
                return;
            }
        }

       ,post : function (buttonEvent) {
            buttonEvent.preventDefault ();
            this.log ('hpapi.post(): attempting request');
            try {
                var frm                     = buttonEvent.target.form;
                var tgt                     = frm.json;
            }
            catch (e) {
                this.log ('hpapi.post(): '+e);
                return;
            }
        var lfn                             = this.log;
        var tid                             = frm.txnid.value;
        var url                             = frm.url.value;
        var toc                             = 1000*frm.timeout.value;
        var rdy                             = frm.ready;
        var sts                             = frm.status;
        var cod                             = frm.code;
        var erm                             = frm.error;
        var wnm                             = frm.warning;
        var ntc                             = frm.notice;
        var xhr = new XMLHttpRequest ();
            // Event handlers define
            xhr.onreadystatechange          = function() {
                for (var idx in sts.options) {
                    if (sts.options[idx].value==xhr.readyState) {
                        sts.selectedIndex   = idx;
                        break;
                    }
                }
                if(xhr.readyState!=4) {
                    return;
                }
                if (xhr.responseText.length==0) {
                    lfn ('txnid '+tid+', onreadystatechange(): READY STATE 4, NO RESPONSE TEXT');
                    return;
                }
                for (var idx in sts.options) {
                    if (sts.options[idx].value==xhr.status) {
                        sts.selectedIndex   = idx;
                        break;
                    }
                }
                lfn ('txnid '+tid+', onreadystatechange(): READY STATE 4, RESPONSE TEXT FOUND');
                tgt.value                   = xhr.responseText; 
            }
            xhr.onerror = function() {
                for (var idx in sts.options) {
                    if (sts.options[idx].value==xhr.status) {
                        sts.selectedIndex = idx;
                        break;
                    }
                }
                tgt.value = '002 HTTP error '+xhr.status;
                lfn ('txnid '+tid+', onerror(): HTTP ERROR');
            }
            xhr.ontimeout = function() {
                for (var idx in sts.options) {
                    if (sts.options[idx].value==599) {
                        sts.selectedIndex = idx;
                        break;
                    }
                }
                tgt.value = '001 Request timed out';
                lfn ('txnid '+tid+', ontimeout(): CONNECTION TIMED OUT');
            }
            xhr.onloadend = function() {
            var s = xhr.status;
                if (s==0) {
                    s = 999;
                }
                for (var idx in sts.options) {
                    if (sts.options[idx].value==s) {
                        sts.selectedIndex = idx;
                        break;
                    }
                }
                lfn ('txnid '+tid+', onloadend(): LOADING COMPLETED');
                lfn ('txnid '+tid+', onloadend(): parsing codes and messages');
            var code        = '0';
                try {
                var object  = JSON.parse (tgt.value);
                var error   = object.response.error;
                    this.log ('txnid '+tid+', onloadend(): object error='+error);
                var warning = object.response.warning;
                var notice  = object.response.notice;
                }
                catch (e) {
                var error   = tgt.value;
                var warning = '';
                var notice  = '';
                }
                lfn ('txnid '+tid+', onloadend(): system error='+error);
                // Extract codes from error message
                if (error!=null && error.length) {
                    parts           = error.split (' ');
                    if (parts[0].match(/^[0-9]+$/)) {
                        code    = parts[0];
                        parts.shift ();
                        if (parts[0].match(/^[0-9]+$/)) {
                            for (var idx in sts.options) {
                                if (sts.options[idx].value==parts[0]) {
                                    sts.selectedIndex = idx;
                                    break;
                                }
                            }
                            parts.shift ();
                        }
                        error   = parts.join (' ');
                    }
                }
                // Load codes and messages into form
                cod.value       = code;
                erm.value       = error;
                wnm.value       = warning;
                ntc.value       = notice;
                tgt.classList.add ('completed');
                lfn ('txnid '+tid+', onloadend(): READY');
                // Click the ready button
                rdy.click ();
            }
            // Event handlers done
            // Initialise request
            sts.selectedIndex = 0;
            xhr.open ('POST',url,true);
            xhr.timeout = toc;
            this.log ('JSON to post:');
            this.log (frm.json.value);
            this.log ('txnid '+tid+', Setting request header Content-Type: application/json');
            xhr.setRequestHeader ("Content-Type","application/json");
            this.log ('txnid '+tid+', Sending request...');
            xhr.send (frm.json.value);
        }

    }

    hpapi._init ();


})();

