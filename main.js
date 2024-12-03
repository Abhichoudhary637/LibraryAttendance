const { app, BrowserWindow, ipcMain } = require('electron');
const mysql = require('mysql2');
const moment = require('moment'); // Import moment



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

  mainWindow.loadFile('src/Login.html');
  mainWindow.webContents.openDevTools(); // Optional: Open the DevTools
  mainWindow.webContents.reloadIgnoringCache();
}

function handleDisconnect() {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Abhi637@#',
    // password:"shiv#2366",
    database: 'library',
    port: 3306
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

function closeMysqlConnection() {
  if (connection && connection.state !== 'disconnected') {
    connection.end((err) => {
      if (err) {
        console.error('Error closing MySQL connection:', err);
      } else {
        console.log('MySQL connection closed');
      }
    });
  }
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
  closeMysqlConnection();
});

ipcMain.on('login-controller', (event, data) => {
  handleDisconnect();

  let responsedata = {};
  responsedata['code'] = '500';
  const loginquery = 'select * from app_users where userid=? and password = ? and (status = 1 or status is null)';
  connection.query(loginquery, [data.userid,data.password], (err, results) => {
    if (err) {
      console.log(err);
      responsedata['message'] = 'Login Failed';
      responsedata['code'] = '500';
      responsedata['error'] = err;
      console.error('Error saving data to MySQL:', err);
      event.reply('save-data-response', responsedata);
    } else {
      // console.log(results)
      if (results == undefined || results == null || results.length == 0){
        responsedata['message'] = 'Userid is not existing';
        event.reply('save-data-response', responsedata);
      } else {
        let isadmin = false;
        if (results.usertype == 1){
          isadmin = true;
        }
        // console.log("Successfully");
        const query = 'INSERT INTO app_login_info (userid,logindatetime,createdon,name) VALUES (?,?,?,?)';
        connection.query(query, [data.userid,new Date(),new Date()
        ,results[0].name], (err, results) => {
          if (err) {
            responsedata['error'] = err;
            console.error('Error saving data to MySQL:', err);
            event.reply('save-data-response', responsedata);
          } else {
            responsedata['code'] = '200';
            responsedata['message'] = 'Successfully Login';
            responsedata['isadmin'] = isadmin;
            event.reply('save-data-response', responsedata);
          }
        });
      }
    
      closeMysqlConnection();
      // event.reply('save-data-response', 'success');
    }
  });

});

ipcMain.on('getStudents', (event, data) => {
  handleDisconnect();

  let responsedata = {};
  responsedata['code'] = '500';
  let studentquery = 'select * from students';
  if (data.fts != undefined && data.fts != null && data.fts != ""){
    studentquery += " where name like %"+data.fts+"%";
  }

  studentquery += " order by id desc";
  connection.query(studentquery, (err, results) => {
    if (err) {
      console.log(err);
      responsedata['message'] = 'Error in getting data';
      responsedata['code'] = '500';
      responsedata['error'] = err;
      console.error('Error saving data to MySQL:', err);
      event.reply('getStudentRes', responsedata);
    } else {
      responsedata['code'] = '200';
      responsedata['message'] = 'Successful';
      responsedata['data'] = results;
      event.reply('getStudentRes', responsedata);
    }
  });

  closeMysqlConnection();
});

ipcMain.on('saveStudentData', (event, studentData) => {
  handleDisconnect();

  const data = JSON.parse(studentData);
  let responsedata = {};
  const imageData = data?.imageData ? Buffer.from(data?.imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64') : null;

  responsedata['code'] = '500';
  const query = 'INSERT INTO students (student_id,name,course,branch,session,regdate, regexpdate, father, mother, emailid, mobileno, address, imagepath) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
        connection.query(query, [data.studentid,data.studentname,data.course, data.branch, data.session, data.registrationdate, data.expirationdate, data.fathername, data.mothername, data.emailid, data.mobileno, data.address,imageData
        ], (err, results) => {
          if (err) {
            console.log(err);
            responsedata['message'] = 'Unable to Save';
            responsedata['code'] = '500';
            responsedata['error'] = err;
            console.error('Error saving data to MySQL:', err);
            event.reply('getStudentResOnSave', responsedata);
          } else {
            console.log("test200")
            responsedata['code'] = '200';
            responsedata['message'] = 'Successful';
            responsedata['data'] = [];
            event.reply('getStudentResOnSave', responsedata);
          }
        });

  closeMysqlConnection();
});

ipcMain.on('getEmployee', (event, data) => {
  handleDisconnect();

  let responsedata = {};
  responsedata['code'] = '500';
  let employeequery = 'select * from employee';
  if (data.fts != undefined && data.fts != null && data.fts != ""){
    employeequery += " where name like %"+data.fts+"%";
  }

  employeequery += ' order by id desc';
  connection.query(employeequery, (err, results) => {
    if (err) {
      console.log(err);
      responsedata['message'] = 'Error in getting data';
      responsedata['code'] = '500';
      responsedata['error'] = err;
      console.error('Error saving data to MySQL:', err);
      event.reply('getEmployeeRes', responsedata);
    } else {
      responsedata['code'] = '200';
      responsedata['message'] = 'Successful';
      responsedata['data'] = results;
      event.reply('getEmployeeRes', responsedata);
    }
  });

  closeMysqlConnection();
});


ipcMain.on('saveEmployeeData', (event, studentData) => {
  handleDisconnect();

  const data = JSON.parse(studentData);
  const imageData = data?.imageData ? Buffer.from(data?.imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64') : null;
  let responsedata = {};
  responsedata['code'] = '500';
  const query = 'INSERT INTO employee (employee_id,name,department,designation,regdate,regexpdate, emailid, mobileno, address,imagepath) VALUES (?,?,?,?,?,?,?,?,?,?)';
        connection.query(query, [data.employeeid,data.employeename,data.department, data.designation, data.registrationdate, data.expirationdate,data.emailid, data.mobileno, data.address,imageData
        ], (err, results) => {
          if (err) {
            console.log(err);
            responsedata['message'] = 'Unable to Save';
            responsedata['code'] = '500';
            responsedata['error'] = err;
            console.error('Error saving data to MySQL:', err);
            event.reply('getEmployeeResOnSave', responsedata);
          } else {
            console.log("test200")
            responsedata['code'] = '200';
            responsedata['message'] = 'Successful';
            responsedata['data'] = [];
            event.reply('getEmployeeResOnSave', responsedata);
          }
        });

  closeMysqlConnection();
});

