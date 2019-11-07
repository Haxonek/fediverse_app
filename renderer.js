// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


const ipc = require('electron').ipcRenderer;

const connect = document.getElementById('connect-button')

connect.addEventListener('click', function(){
    ipc.send('connect-to-instance', 'arg');
})
