const { ipcRenderer } = require('electron');
document.addEventListener('DOMContentLoaded', () => {
    getDashboardCountData();
});

function getDashboardCountData(){
    ipcRenderer.send('getCountData', { fts });
}

ipcRenderer.on('getCountDataRes', (event, arg) => {
    if (arg.code != 200) {
        console.error('Error:', arg.error);
        alert(arg.message);
        return;
    }
});