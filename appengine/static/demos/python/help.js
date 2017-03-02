// Credit to http://www.xtf.dk/
function popupCenter(url, title, w, h) {

    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    if (window.focus) {
        newWindow.focus();
    }
}

function traversePage() {
    if (page == 0) {
        page = 1;
        return;
    } else if (page == 12) {
        page = 11;
        return;
    }
    title.innerHTML = 'PythonBlocks Tutorial (' + page + '/11)';
    readFile('helpassets/' + page + '.txt');
    image.src = 'helpassets/' + page + '.png';
}

function readFile(file) {
    var rawRead = new XMLHttpRequest();
    rawRead.open("GET", file, false);
    rawRead.onreadystatechange = function() {
        if (rawRead.readyState === 4) {
            if (rawRead.status === 200 || rawRead.status == 0) {
                var text = rawRead.responseText;
                helpText_.innerHTML = text;
            }
        }
    }
    rawRead.send(null);
}
