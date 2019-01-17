/* Copyright 2018 Whitelamp http://www.whitelamp.com/ */

export class Hpapi {

    constructor ( ) {
        this.token                      = '';
        this.tokenExpires               = 0;
    }

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
        if (reqObj.key!=undefined && (typeof(reqObj.key)!='string' || reqObj.key.length==0)) {
            throw new Error ('Hpapi.filterRequest(): request key is empty or not a string');
            return false;
        }
        if (reqObj.email==undefined || typeof(reqObj.email)!='string' || reqObj.email.length==0) {
            throw new Error ('Hpapi.filterRequest(): request has no email or it is not a string');
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
    var obj = {
            "email"     : reqObj.email
           ,"method"    : {
                "vendor"    : reqObj.method.vendor
               ,"package"   : reqObj.method.package
               ,"class"     : reqObj.method.class
               ,"method"    : reqObj.method.method
               ,"arguments" : reqObj.method.arguments
            }
        }
        if ('key' in reqObj) {
            obj.key = reqObj.key;
        }
        return obj;
    }

    filterTimeout (timeoutSeconds) {
        timeoutSeconds = parseInt (timeoutSeconds);
        if (isNaN(timeoutSeconds) || timeoutSeconds<1 || timeoutSeconds>60) {
            throw new Error ('Hpapi.filterTimeout(): connection timeout seconds is not a sane integer (between 1 and 60)');
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
    var errorSplit                          = this.errorSplit;
        try {
            timeoutSecs                     = this.filterTimeout (timeoutSecs);
            url                             = this.filterUrl (url);
        var request                         = this.filterRequest (reqObj);
            request.datetime                = new Date().toUTCString ();
            if ('password' in reqObj) {
                request.password            = reqObj.password;
            }
            else if (this.tokenExpired()) {
                throw new Error ('tokenExpired');
                return false;
            }
            else {
                request.token               = this.token;
            }
        }
        catch (e) {
            throw new Error (e.message);
            return false;
        }
        console.log ('hpapi(): request object = '+JSON.stringify(request,null,'    '));
        try {
        var json                            = JSON.stringify (request);
        }
        catch (e) {
            throw new Error (e.message);
            return false;
        }
        try {
        var hpapi                           = this;
            return new Promise (
                function (succeeded,failed) {
                var xhr                     = new XMLHttpRequest ();
                    xhr.timeout             = 1000 * timeoutSecs;
                    xhr.onerror             = function ( ) {

                        throw new Error ('999 Could not connect or unknown error');
//                        failed ({"httpCode":999,"message":"Could not connect or unknown error"});
                    };
                    xhr.onload              = function ( ) {
                        var fail            = false;
                        if (xhr.status==200) {
                            try {
                            var returned    = JSON.parse (xhr.responseText);
                                console.log ('hpapi(): returned object = '+JSON.stringify(returned,null,'    '));
                            }
                            catch (e) {
                                console.log ('hpapi(): response text = '+xhr.responseText);
                                fail        = true;
                            }
                            if (fail) {
                                throw new Error (xhr.responseText);
//                                failed (errorSplit(xhr.responseText));
                            }
                            else {
                            var error       = returned.response.error;
                                if (error) {
                                    throw new Error (error);
//                                    error   = errorSplit (error);
//                                    if ('diagnostic' in returned) {
//                                        error.diagnostic    = returned.diagnostic;
//                                    }
//                                    failed (error);
                                }
                                else {
                                    if ('tokenExpires' in returned.response) {
                                        if ('token' in returned.response) {
                                            hpapi.token     = returned.response.token
                                        }
                                        hpapi.tokenExpires  = returned.response.tokenExpires;
                                        hpapi.tokenTOSet();
                                    }
                                    succeeded (returned.response);
                                }
                            }
                        }
                        else {
                            throw new Error (xhr.status+' '+xhr.statusText);
//                            failed ({"httpCode":xhr.status,"message":xhr.statusText});
                        }
                    };
                    xhr.ontimeout   = function ( ) {
                        throw new Error ('999 Request timed out');
//                        failed ({"httpCode":999,"message":"Request timed out"});
                    };
                    xhr.open ('POST',url,true);
                    xhr.setRequestHeader ('Content-Type','application/json');
                    xhr.send (json);
                }
            );
        }
        catch (e) {
            console.log (e.message);
            return false;
        }
    }

    log (message) {
        console.log (message);
    }

    request (timeout,url,request) {
        try {
            return this.hpapi (timeout,url,request);
        }
        catch (e) {
            throw new Error (e.message);
//            return new Promise (
//                function (succeeded,failed) {
//                    failed ({"httpCode":999,"message":e.message});
//                }
//            );
        }
    }

    tokenExpired ( ) {
       return 1000*this.tokenExpires < Date.now();
    }

    tokenPurge (token,timestamp) {
        console.log ('Hpapi purging token');
        this.token          = '';
        this.tokenExpires   = 0;
    }

    tokenTOSet ( ) {
        this.tokenTOClear ();
        console.log ('Now = '+Date.now());
        console.log ('Then = '+(1000*this.tokenExpires));
    var expireMs            = (1000*this.tokenExpires) - Date.now();
        console.log ('Hpapi setting token timeout @'+expireMs);
        this.tokenTO = setTimeout (this.tokenPurge.bind(this),expireMs);
    }

    tokenTOClear ( ) {
        if ('tokenTO' in this) {
            console.log ('Hpapi clearing token timeout');
            clearTimeout (this.tokenTO);
            delete this.tokenTO;
        }
    }

}
