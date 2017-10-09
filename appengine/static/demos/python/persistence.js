var useProxy = false;
var metaData = false;
var picker = new GoogleDrivePicker({
    apiKey: 'AIzaSyBIJVAC6TKBZmMwIFeOUjWPyIC_YfUWk-I',
    clientId: '600830548447-tjkqh0qmskmjc8v1l3mrknn2k14ok2r4.apps.googleusercontent.com'
});

function getXMLHttpRequest() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest;
    } else { //old IE compatibility
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    return null;
}

function initLoad() {
    picker.init().then(createPicker);
}

function createPicker() {

    picker.pick().then(function(data) {
        var url = 'https://www.googleapis.com/drive/v2/files/' + data.docs[0].id;
        getData(url, function(responseText) {
            metaData = JSON.parse(responseText);
            getData(metaData.downloadUrl, function(text) {
                window.location.href = text;
                if (window.location.href == text) {
                    location.reload();
                }

            });
        });

    });
    return null;
}

function initSave() {
    picker.init().then(saveDocument);
}

function saveBlocks() {
    BlocklyStorage.link(workspace);
    setTimeout(function() {
        initSave();
    }, 500);
}

function linkBlocks() {
    var initVal = window.location.href;
    BlocklyStorage.link(workspace);
        
    setTimeout(function() { window.prompt("Copy the link below to share this PyBlocks program with your peers", window.location.href) }, 750);
}

function reset() {
    var resetChoice = confirm("Are you sure you want to reset PythonBlocks?");
    if (resetChoice) {
        window.location.href = 'index.html';
    }
}

function saveDocument() {

    // Method described in https://developers.google.com/drive/v3/web/manage-uploads
    // under 'Multipart upload', this method is used because Node.js is yet to be
    // available to EU countries. Once the beta phase has ended, this function can be
    // simplified considerably.

    var content = window.location.href;
    var method = 'POST';
    var mimeType = 'application/pythonblocks';
    var path = '/upload/drive/v2/files/';
    var params = {
        'uploadType': 'multipart'
    };

    var fileName = prompt("Enter a filename for your PythonBlocks program: ", "untitled-pyblocks");
    if (fileName == null) return;
    metaData = {
        'title': fileName + ".pyb",
        'mimeType': mimeType,
        'description': 'PythonBlocks program'
    };

    // boundary value is arbitrary, don't worry about it
    var boundary = '-------314159265358979323846';
    var delimiter = "\r\n--" + boundary + "\r\n";
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metaData) +
        delimiter +
        'Content-Type: ' + mimeType + '\r\n' +
        'Content-Length: ' + content.length + '\r\n' +
        '\r\n' +
        content +
        '\r\n--' + boundary + '--';

    gapi.client.request({
        'path': path,
        'method': method,
        'params': params,
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
    }).execute(function(newmeta) {
        metaData = newmeta;
    });
}

function getData(url, callback) {
    var xhr = getXMLHttpRequest();
    if (xhr != null) {
        var myToken = gapi.auth.getToken().access_token;
        var openurl = url;
        useProxy = useProxy || !('withCredentials' in xhr);
        if (useProxy) openurl = 'xhr_proxy.php?gpath=' + encodeURIComponent(url) + '&auth=' + myToken;
        xhr.open('GET', openurl, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    callback(xhr.responseText);
                } else if (!useProxy) { //retry through proxy
                    useProxy = true;
                    getData(url, callback);
                } else {
                    dialog.alert('Error occurred while retrieving document');
                }
            }
        }
        xhr.setRequestHeader('Authorization', 'Bearer ' + myToken);
        xhr.send();
    }
}
