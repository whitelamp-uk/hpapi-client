
(function ( ) {

    var hpapi = {

        _init : function ( ) {
            var forms          = document.getElementsByClassName ('hpapi');
            // For each hpapi form found
            for (var i in forms) {
                if (parseInt(i)!=i) {
                    continue;
                }
                forms[i].reset ();
                try {
                    var post = forms[i].getElementsByClassName ('post')[0];
                }
                catch (e) {
                    console.log ('hpapi._init(): a form has no post button - skipping');
                    continue;
                }
                // Add event listener to this form "Post" button
                try {
                    post.addEventListener('click',hpapi.post);
                }
                catch (e) {
                    console.log ('hpapi._init(): could not listen for post button');
                }
            }
        }

       ,post : function (buttonEvent) {
            try {
                var frm     = buttonEvent.target.form;
                var toc     = frm.to_connect.value;
                var url     = frm.url.value;
                var tid     = frm.txnid.value;
                var jps     = frm.json_pretty_string.value;
                var obj     = {
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
                var args    = frm.getElementsByClassName ('argument');
                for (i in args) {
                    if (parseInt(i)!=i) {
                        continue;
                    }
                    if (i<frm.argcount.selectedIndex) {
                        obj.method.arguments.push (args[i].value);
                    }
                    else {
                        args[i].value = '';
                    }
                }
                var req     = JSON.stringify (obj,null,jps);
            }
            catch (e) {
                console.log ('hpapi.post() failed [1]: '+e);
                return;
            }
            var tgt         = document.getElementById (tid);
            if (!tgt) {
                try {
                    var tgt = document.createElement ('textarea');
                        tgt.setAttribute ('id',tid);
                        tgt.setAttribute ('class','response');
                        tgt.setAttribute ('name','response');
                        tgt.setAttribute ('placeholder','Response object');
                    frm.getElementsByClassName('transport')[0].appendChild (tgt);
                }
                catch (e) {
                    console.log ('hpapi.(post) failed [2]: '+e);
                    return;
                }
            }
            var args = frm.getElementsByClassName ('arguments');
            for (var i in args) {
                if (parseInt(i)!=i) {
                    continue;
                }
                obj.method.arguments.push (args[i].value);
            }
            try {
                frm.getElementsByClassName('request')[0].value = req;
            }
            catch (e) {
                console.log ('Request log element not found: '+e);
            }
            if (isNaN(toc)) {
                toc     = 10000;
            }
            else {
                toc    *=  1000;
            }
            var tim = frm.getElementsByClassName ('timeout')[0];
            var err = frm.getElementsByClassName ('err')[0];
            var rdy = frm.getElementsByClassName ('ready')[0];
            var sts = frm.status;
            var cod = frm.code;
            var erm = frm.error;
            var wnm = frm.warning;
            var ntc = frm.notice;
            var xhr = new XMLHttpRequest ();
            // Event handlers define
                xhr.onreadystatechange = function() {
                    for (var idx in sts.options) {
                        if (sts.options[idx].value==xhr.readyState) {
                            sts.selectedIndex = idx;
                            break;
                        }
                    }
                    if(xhr.readyState!=4) {
                        return;
                    }
                    if (xhr.responseText.length==0) {
                        console.log ('txnid '+tid+', onreadystatechange(): READY STATE 4, NO RESPONSE TEXT');
                        return;
                    }
                    for (var idx in sts.options) {
                        if (sts.options[idx].value==xhr.status) {
                            sts.selectedIndex = idx;
                            break;
                        }
                    }
                    console.log ('txnid '+tid+', onreadystatechange(): READY STATE 4, RESPONSE TEXT FOUND');
                    tgt.value = xhr.responseText; 
                }
                xhr.onerror = function() {
                    for (var idx in sts.options) {
                        if (sts.options[idx].value==xhr.status) {
                            sts.selectedIndex = idx;
                            break;
                        }
                    }
                    tgt.value = '002 HTTP error '+xhr.status;
                    console.log ('txnid '+tid+', onerror(): HTTP ERROR');
                    err.click ();
                }
                xhr.ontimeout = function() {
                    for (var idx in sts.options) {
                        if (sts.options[idx].value==599) {
                            sts.selectedIndex = idx;
                            break;
                        }
                    }
                    tgt.value = '001 Request timed out';
                    console.log ('txnid '+tid+', ontimeout(): CONNECTION TIMED OUT');
                    tim.click ();
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
                    console.log ('txnid '+tid+', onloadend(): LOADING COMPLETED');
                    console.log ('txnid '+tid+', onloadend(): parsing codes and messages');
                    var code        = '0';
                    try {
                        var object  = JSON.parse (tgt.value);
                        var error   = object.response.error;
                        var warning = object.response.warning;
                        var notice  = object.response.notice;
                    }
                    catch (e) {
                        var error   = tgt.value;
                        var warning = '';
                        var notice  = '';
                    }
                    // Extract codes from error message
                    if (error.length) {
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
                    // Click the ready button
                    console.log ('txnid '+tid+', onloadend(): READY');
                    rdy.click ();
                }
            // Event handlers done
            // Initialise request
                sts.selectedIndex = 0;
                tgt.value = '';
                xhr.open ('POST',url,true);
                xhr.timeout = toc;
                console.log ('txnid '+tid+', Setting request header Content-Type: application/json');
                xhr.setRequestHeader ("Content-Type","application/json");
                console.log ('txnid '+tid+', Sending request...');
                xhr.send (req);
        }

    }

    hpapi._init ();


})();

