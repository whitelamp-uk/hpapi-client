
(function ( ) {

var hpapi = {

        initialised                 : null
       ,connection                  : null
       ,xhr                         : null
       ,config                      : {}
       ,formId                      : 'hpapi'

       ,_init : function ( ) {

document.getElementById('hpapi-post').addEventListener ('click',this.arseWipe);
return;

document.getElementById('hpapi-argcount').addEventListener ('change',this.arseWipe);

            if (this.initialised) {
                return;
            }
            var form                = document.getElementById (this.formId);
            var section             = form.getElementsByClassName('object')[0];

console.log (section);

            for (cfg in cfgs) {
                if (cfgs[cfg].name=='url')      { this.config.url      = cfgs[cfg].value; continue; }
                if (cfgs[cfg].name=='key')      { this.config.key      = cfgs[cfg].value; continue; }
                if (cfgs[cfg].name=='timeout')  { this.config.timeout  = cfgs[cfg].value; continue; }
            }            
            for (cfg in this.config) {
                console.log (cfg+'='+this.config[cfg]);
            }
            this.initialised        = true;
        }

       ,arseWipe : function () {
console.log ('Wipe my arse');
        }

       ,abort : function () {
            this.xhr.abort ();
            thids.xhr               = null;
        }

       ,connect : function () {
        }

       ,postAsync : function (obj,callbackFn,args) {
            // Encode obj into JSON and post
            // Add event handler for postAsyncCallback (responseText,callbackFn,args)
        }

       ,postAsyncCallback : function (responseText,callbackFn,args) {
            // Decode JSON response into obj
            // Execute callback function (obj,args)
        }

       ,postSync : function (obj) {
            // Encode obj into JSON and post
            // Decode and return JSON responseText
            this.xhr                = null;
        }

       ,setEndpoint : function (host,get='/',port=443,isHttps=true) {
            this.host               = host;
            this.get                = get;
            this.port               = port;
            this.isHttps            = https
        }

       ,setInsecure : function (url,port) {
            if (!confirm('Are you sure?')) {
                return;
            }
            this.https              = false;
        }

    }

    hpapi._init ();

})();

