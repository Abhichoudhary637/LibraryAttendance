const { app, BrowserWindow, ipcMain } = require('electron');
const mysql = require('mysql2');

let mainWindow;
let connection;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools(); // Optional: Open the DevTools
}

function handleDisconnect() {
  connection = mysql.createConnection({
    host: 'localhost',
  user: 'root',
  password: 'Abhi637@#',
  database: 'library',
  port:3306
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000); // Attempt to reconnect after 2 seconds
    } else {
      console.log('Connected to MySQL');
    }
  });

  connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('MySQL connection lost:', err);
      handleDisconnect(); // Reconnect on connection loss
    } else {
      throw err;
    }
  });
}

app.on('ready', () => {
  createWindow();
  handleDisconnect(); // Initialize the MySQL connection
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('request-database', (event, arg) => {
  if (connection.state === 'disconnected') {
    event.reply('response-database', { error: 'Database connection is not available' });
    return;
  }

  connection.query('SELECT * FROM website_managemenu', (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      event.reply('response-database', { error });
    } else {
      event.reply('response-database', { results });
    }
  });
});

app.on('before-quit', () => {
  if (connection && connection.state !== 'disconnected') {
    connection.end((err) => {
      if (err) {
        console.error('Error closing MySQL connection:', err);
      } else {
        console.log('MySQL connection closed');
      }
    });
  }
});
