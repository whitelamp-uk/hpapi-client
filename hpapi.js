
export class Hpapi {

    errorSplit (errStr) {
    var parts                           = errStr.split (' ');
    var err                             = {};
        err.hpapiCode                   = parts[0];
        parts.shift ();
        err.httpCode                    = parts[0];
        parts.shift ();
        err.message                     = parts.join (' ');
        return err;
    }

    filterRequest (reqObj) {
        if (Object(reqObj)!=reqObj) {
            throw new Error ('Hpapi.filterRequest(): request is not an object');
            return false;
        }
        if (reqObj.key==undefined || typeof(reqObj.key)!='string' || reqObj.key.length==0) {
            throw new Error ('Hpapi.filterRequest(): request has no key or it is not a string');
            return false;
        }
        if (reqObj.email==undefined || typeof(reqObj.email)!='string' || reqObj.email.length==0) {
            throw new Error ('Hpapi.filterRequest(): request has no email or it is not a string');
            return false;
        }
        if (reqObj.password==undefined || typeof(reqObj.password)!='string' || reqObj.password.length==0) {
            throw new Error ('Hpapi.filterRequest(): request has no password or it is not a string');
            return false;
        }
        if (reqObj.method==undefined || Object(reqObj.method)!=reqObj.method) {
            throw new Error ('Hpapi.filterRequest(): request method is not an object');
            return false;
        }
        if (reqObj.method.vendor==undefined || typeof(reqObj.method.vendor)!='string' || reqObj.method.vendor.length==0) {
            throw new Error ('Hpapi.filterRequest(): request method has no vendor or it is not a string');
            return false;
        }
        if (reqObj.method.package==undefined || typeof(reqObj.method.package)!='string' || reqObj.method.package.length==0) {
            throw new Error ('Hpapi.filterRequest(): request method has no package or it is not a string');
            return false;
        }
        if (reqObj.method.class==undefined || typeof(reqObj.method.class)!='string' || reqObj.method.class.length==0) {
            throw new Error ('Hpapi.filterRequest(): request method has no class or it is not a string');
            return false;
        }
        if (reqObj.method.method==undefined || typeof(reqObj.method.method)!='string' || reqObj.method.method.length==0) {
            throw new Error ('Hpapi.filterRequest(): request method has no method or it is not a string');
            return false;
        }
        if (reqObj.method.arguments==undefined || Object.prototype.toString.call(reqObj.method.arguments)!='[object Array]') {
            throw new Error ('Hpapi.filterRequest(): request method has no arguments or they are not an array');
            return false;
        }
        return {
            "key"       : reqObj.key
           ,"email"     : reqObj.email
           ,"password"  : reqObj.password
           ,"method"    : {
                "vendor"    : reqObj.method.vendor
               ,"package"   : reqObj.method.package
               ,"class"     : reqObj.method.class
               ,"method"    : reqObj.method.method
               ,"arguments" : reqObj.method.arguments
            }
        }
    }

    filterTimeout (timeoutSeconds) {
        timeoutSeconds = parseInt (timeoutSeconds);
        if (isNaN(timeoutSeconds) || timeoutSeconds<1 || timeoutSeconds>60) {
            throw new Error ('Hpapi.filterTimeout(): timeout seconds is not a sane integer (between 1 and 60)');
            return false;
        }
        return timeoutSeconds;
    }

    filterUrl (url) {
        if (typeof(url)!='string' || url.length==0) {
            throw new Error ('Hpapi.filterURL(): URL is not a string or it has no length');
            return false;
        }
        return url;
    }

    hpapi (timeoutSecs,url,reqObj) {
    var errorSplit                      = this.errorSplit;
        try {
            timeoutSecs                 = this.filterTimeout (timeoutSecs);
            url                         = this.filterUrl (url);
            reqObj                      = this.filterRequest (reqObj);
            reqObj.datetime             = new Date().toUTCString ();
        }
        catch (e) {
            throw e.message;
            return false;
        }
        try {
        var json                        = JSON.stringify (reqObj);
        }
        catch (e) {
            throw e.message;
            return false;
        }
        return new Promise (
            function (succeeded,failed) {
            var xhr                     = new XMLHttpRequest ();
                xhr.timeout             = 1000 * timeoutSecs;
                xhr.onerror             = function ( ) {
                    failed ({"httpCode":999,"message":"Could not connect or unknown error"});
                };
                xhr.onload              = function ( ) {
                    var fail            = false;
                    if (xhr.status==200) {
                        try {
                        var returned    = JSON.parse (xhr.responseText);
                        }
                        catch (e) {
                            fail        = true;
                        }
                        if (fail) {
                            failed (errorSplit(xhr.responseText));
                        }
                        else {
                        var error       = returned.response.error;
                            if (error) {
                                error   = errorSplit (error);
                                if ('diagnostic' in returned) {
                                    error.diagnostic = returned.diagnostic;
                                }
                                failed (error);
                            }
                            else {
                                succeeded (returned.response);
                            }
                        }
                    }
                    else {
                        failed ({"httpCode":xhr.status,"message":xhr.statusText});
                    }
                };
                xhr.ontimeout   = function ( ) {
                    failed ({"httpCode":999,"message":"Request timed out"});
                };
                xhr.open ('POST',url,true);
                xhr.setRequestHeader ('Content-Type','application/json');
                xhr.send (json);
            }
        );
    }

    log (message) {
        console.log (message);
    }

}
