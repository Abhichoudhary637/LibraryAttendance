const { ipcRenderer } = require('electron');
document.addEventListener('DOMContentLoaded', () => {
    const fts = document.getElementById('fts').value;
    ipcRenderer.send('getEmployee', { fts });
});

ipcRenderer.on('getEmployeeRes', (event, arg) => {
    if (arg.code != 200) {
        console.error('Error:', arg.error);
        alert(arg.message);
        return;
    }

    console.log(arg.data);
    arg?.data.forEach(obj => {
        let employeedata = "";
        employeedata += '<tr>';
        employeedata += ' <td><img src="Assets/ss.png"> '+obj?.name+' | '+obj?.employee_id+'</td>';
        employeedata += '<td>'+obj?.course+'</td>';
        employeedata += '<td>'+obj?.branch+'</td>';
        employeedata += '<td>'+obj?.session+'</td>';
        employeedata += '<td>'+obj?.father+'</td>';
        employeedata += ' <td>'+obj?.mother+'</td>';
        employeedata += ' <td>'+obj?.mobileno+'</td>';
        employeedata += ' <td>'+obj?.emailid+'</td>';
        employeedata += ' <td>'+obj?.regdate+'</td>';
        employeedata += ' <td>';
        employeedata += '    <button class="edit-button"><i class="fa-regular fa-pen-to-square"></i></button>';
        employeedata += '<button class="delete-button"><i class="fa-solid fa-trash-can"></i></button>';
        employeedata += ' </td>';
        employeedata += ' </tr>';
        document.getElementById('employeedata').innerHTML += employeedata;
    });
});