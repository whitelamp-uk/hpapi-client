

// Import
import {Hpapi} from '../hpapi.js';

// Instantiate
var hpapi = new Hpapi ();

// Initialise
function execute ( ) {
    function send () {
    var tmo = document.getElementById ('test-timeout');
    var url = document.getElementById ('test-url');
        try {
        var req = JSON.parse (document.getElementById('test-request'));
        }
        catch (e) {
            Error ("send(): could not parse request");
            return false;
        }
        hpapi.request (tmo,url,req)
       .then (
            function (xhr,status) {
                console.log ('XHR = '+xhr);
                console.log ('status = '+status);
            }
           ,function ( ) {
                // Promise is always resolved with XHR result
            }
        )
    }
    document.getElementById ('test-request').addEventListener ('click',send);
}
window.document.addEventListener ('DOMContentLoaded',execute);

// Expose properties and methods within a "namespace"
window.test = {
    'hpapi' : {
        'request' : hpapi.request
    }
};
