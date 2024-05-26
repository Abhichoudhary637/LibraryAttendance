const { ipcRenderer } = require('electron');

document.getElementById('fetch-data').addEventListener('click', () => {
  ipcRenderer.send('request-database');
});

ipcRenderer.on('response-database', (event, arg) => {
  if (arg.error) {
    console.error('Error:', arg.error);
    document.getElementById('data').innerText = 'Error fetching data';
    return;
  }
  console.log('Results:', arg.results);
  document.getElementById('data').innerText = JSON.stringify(arg.results, null, 2);
});
