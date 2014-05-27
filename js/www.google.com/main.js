window.addEventListener('message', function (e) {
    var data = e.data;
    if (e.origin === 'https://gstatic.com' && data.controls) {
        // add "solve" button
        window.document.getElementsByTagName('iframe')[0].contentWindow.postMessage({ addbutton: 1 }, 'https://gstatic.com');
    }
});
