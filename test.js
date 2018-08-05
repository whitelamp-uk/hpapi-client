

function testme (evt=null) {
    // id="..." can be added to hpapi <form>s but hpapi does not deploy
    // them because hpapi.js permits use of multiple forms per document
    // (each with full properties including the hpapi node URL).
    // This example uses the first form found:
    var frm                          = document.getElementsByClassName('hpapi')[0];
    // Transaction/element ID to pick up the response JSON
        frm.txnid.value              = 'my-app-test-response';
    // All form values can be modified by script eg. the method name:
        frm.method.value             = "uuid";
    // Set two arguments (exact argument count required by the method)
        frm.argcount.selectedIndex   = 2;
    // Set the argument values
    var args = frm.getElementsByClassName('argument');
    // YYYYMMDD
        args[0].value                = new Date().toISOString().replace(/-/g,'').split('T')[0];
    // HHMMSS
        args[1].value                = new Date().toISOString().replace(/:/g,'').replace('.','T').split('T')[1];
    // Listen for timeout, error and ready buttons
//       frm.getElementsByClassName('timeout')[0].addEventListener('click',testmeTimeout);
//       frm.getElementsByClassName('error')[0].addEventListener('click',testmeError);
       frm.getElementsByClassName('ready')[0].addEventListener('click',testmeReady);
    // Click post button
        frm.getElementsByClassName('post')[0].click();
    // Suppress invoking element default behaviour
    return false;
}

//function testmeError () {
//    console.log ("ERROR");
//    var status = document.getElementsByClassName('hpapi')[0].getElementsByClassName('status')[0];
//    console.log ("Status = "+status.options[status.selectedIndex].value);
//}

function testmeReady () {
    console.log ("testmeReady(): READY");
    var status = document.getElementsByClassName('hpapi')[0].getElementsByClassName('status')[0];
    console.log ("Status = "+status.options[status.selectedIndex].value);
    console.log ("Response = "+document.getElementById('my-app-test-response').value);
}

//function testmeTimeout () {
//    console.log ("TIMEOUT");
//    var status = document.getElementsByClassName('hpapi')[0].getElementsByClassName('status')[0];
//    console.log ("Status = "+status.options[status.selectedIndex].value);
//}

