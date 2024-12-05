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
  connection.query(loginquery, [data.userid, data.password], (err, results) => {
    if (err) {
      console.log(err);
      responsedata['message'] = 'Login Failed';
      responsedata['code'] = '500';
      responsedata['error'] = err;
      console.error('Error saving data to MySQL:', err);
      event.reply('save-data-response', responsedata);
    } else {
      // console.log(results)
      if (results == undefined || results == null || results.length == 0) {
        responsedata['message'] = 'Userid is not existing';
        event.reply('save-data-response', responsedata);
      } else {
        let isadmin = false;
        let userdetails = "Library Watchman";
        if (results.usertype == 1) {
          isadmin = true;
          userdetails = "Library Admin";
        }
        // console.log("Successfully");
        const query = 'INSERT INTO app_login_info (userid,logindatetime,createdon,name) VALUES (?,?,?,?)';
        connection.query(query, [data.userid, new Date(), new Date()
          , results[0].name], (err) => {
            if (err) {
              responsedata['error'] = err;
              console.error('Error saving data to MySQL:', err);
              event.reply('save-data-response', responsedata);
            } else {
              responsedata['code'] = '200';
              responsedata['message'] = 'Successfully Login';
              responsedata['isadmin'] = isadmin;
              responsedata['username'] = results[0].name;
              responsedata['details'] = userdetails;
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
  if (data.fts != undefined && data.fts != null && data.fts != "") {
    studentquery += " where name like %" + data.fts + "%";
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
  connection.query(query, [data.studentid, data.studentname, data.course, data.branch, data.session, data.registrationdate, data.expirationdate, data.fathername, data.mothername, data.emailid, data.mobileno, data.address, imageData
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
  if (data.fts != undefined && data.fts != null && data.fts != "") {
    employeequery += " where name like %" + data.fts + "%";
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
  connection.query(query, [data.employeeid, data.employeename, data.department, data.designation, data.registrationdate, data.expirationdate, data.emailid, data.mobileno, data.address, imageData
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

ipcMain.on('getCountData', (event, data) => {
  handleDisconnect();

  let responsedata = {};
  responsedata['code'] = '500';
  let query = 'SELECT v.usertype, COUNT(vl.id) AS entry_count FROM visitor v JOIN visitor_log vl ON v.id = vl.visitor_id WHERE v.visit_date = CURRENT_DATE() GROUP BY v.usertype';
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      responsedata['message'] = 'Error in getting data';
      responsedata['code'] = '500';
      responsedata['error'] = err;
      console.error('Error saving data to MySQL:', err);
      event.reply('getCountDataRes', responsedata);
    } else {
      responsedata['code'] = '200';
      responsedata['message'] = 'Successful';
      responsedata['data'] = results;
      event.reply('getCountDataRes', responsedata);
    }
  });

  closeMysqlConnection();
});

ipcMain.on('getVisitorData', async (event, data) => {
  let responsedata = {};
  try {
    handleDisconnect();

    console.log("302>>>");

    responsedata['code'] = '500';
    let visitorData = {};
    let isErrorOccurred = false;

    // Function to execute a query and return a Promise
    const queryPromise = (query) => {
      return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
    };

    try {
      let studentquery = `SELECT * FROM students s WHERE s.student_id=${data?.visitorCode}`;
      const students = await queryPromise(studentquery);

      if (students.length > 0) {
        console.log("314>>>");
        visitorData = students[0];
        visitorData.usertype = "student";
        visitorData.membership_id = students[0].id;
      } else {
        let employeequery = `SELECT * FROM employee e WHERE e.employee_id=${data?.visitorCode}`;
        const employees = await queryPromise(employeequery);

        if (employees.length > 0) {
          console.log("326>>>");
          visitorData = employees[0];
          visitorData.usertype = "employee";
          visitorData.membership_id = employees[0].id;
        }
      }
    } catch (err) {
      console.log("310>>>");
      isErrorOccurred = true;
      throw err; // Bubble up error for handling
    }

    // Fetch additional visitor log data if membership_id is found
    if (visitorData?.membership_id) {
      console.log("339>>>");
      const logQuery = `
        SELECT v.visit_date, vl.entry_time, v.usertype,v.id 
        FROM visitor v 
        JOIN visitor_log vl ON v.id = vl.visitor_id 
        WHERE v.membership_id = ${visitorData.membership_id} AND vl.exit_time IS NULL`;

      try {
        const results = await queryPromise(logQuery);
        if (results.length > 0) {
          visitorData.usertype = results[0].usertype;
          visitorData.entry_time = results[0].entry_time;
          visitorData.visit_date = results[0].visit_date;
          visitorData.visitor_id = results[0].id;
        }
      } catch (err) {
        console.log("355>>>");
        isErrorOccurred = true;
        throw err;
      }
    }

    if (!isErrorOccurred) {
      console.log("363>>>");
      responsedata['message'] = 'Successful';
      responsedata['code'] = '200';
      responsedata['data'] = visitorData;
    }
  } catch (err) {
    console.error("Error:", err);
    responsedata['message'] = 'Error in getting data';
    responsedata['code'] = '500';
    responsedata['error'] = err;
  } finally {
    event.reply('getVisitorDataRes', responsedata);
    closeMysqlConnection();
  }
});


ipcMain.on('checkInCheck', async (event, visitorObj) => {
  let responsedata = {};
  try {
    handleDisconnect();
    const visitor_id = visitorObj?.visitor_id;
    const membership_id = visitorObj?.membership_id;
    const usertype = visitorObj?.usertype;
    responsedata['code'] = '500';

    // Function to execute a query and return a Promise
    const queryPromise = (query) => {
      return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
    };

    if (visitor_id) {
      const updatequery = 'update visitor_log set exit_time = CURRENT_TIME() where visitor_id = ' + visitor_id + '';
      const results = await queryPromise(updatequery);
    } else {
      const visitorquery = 'INSERT INTO visitor (membership_id, usertype, visit_date) VALUES (' + membership_id + ', "' + usertype + '", CURRENT_DATE())';
      const visitorResults = await queryPromise(visitorquery);
      if (visitorResults?.insertId) {
        let visitId = visitorResults?.insertId;
        console.log("TESTHERE");
        console.log("visitId>>> " + visitId);
        const logQuery = 'INSERT INTO visitor_log (visitor_id, entry_time, exit_time) VALUES (' + visitId + ', CURRENT_TIME(), NULL)';
        const results = await queryPromise(logQuery);
      }
    }

    responsedata['message'] = 'Successful';
      responsedata['code'] = '200';
      responsedata['data'] = [];
  } catch (err) {
    console.error("Error:", err);
    responsedata['message'] = 'Error in getting data';
    responsedata['code'] = '500';
    responsedata['error'] = err;
  } finally {
    event.reply('checkInCheckRes', responsedata);
    closeMysqlConnection();
  }
});
