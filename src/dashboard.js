const { ipcRenderer } = require('electron');
document.addEventListener('DOMContentLoaded', () => {
    getDashboardCountData();
});

function getDashboardCountData(){
    ipcRenderer.send('getCountData', { });
}

ipcRenderer.on('getCountDataRes', (event, args) => {
    if (args.code != 200) {
        console.error('Error:', args.error);
        alert(arg.message);
        return;
    }

    let responseobj = {};
    let totalcount = 0;
     args?.data?.forEach(obj => {
        totalcount = totalcount + Number(obj?.entry_count);
        responseobj[obj?.usertype] = obj?.entry_count;
      });

    document.getElementById("studentVisitorCount").innerText = args?.data?.student || 0;
    document.getElementById("empVisitorCount").innerText = args?.data?.employee || 0;
    document.getElementById("otherVisitCount").innerText = args?.data?.other || 0;
    document.getElementById("totalvisitor").innerText = totalcount;
});

function getVisitorData(){
    
}