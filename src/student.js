const { ipcRenderer } = require('electron');
document.addEventListener('DOMContentLoaded', () => {
    const fts = document.getElementById('fts').value;
    ipcRenderer.send('getStudents', { fts });
});

ipcRenderer.on('getStudentRes', (event, arg) => {
    if (arg.code != 200) {
        console.error('Error:', arg.error);
        alert(arg.message);
        return;
    }

    console.log(arg.data);
    arg?.data.forEach(obj => {
        let studentsdata = "";
        studentsdata += '<tr>';
        studentsdata += ' <td><img src="Assets/ss.png"> '+obj?.name+' | '+obj?.student_id+'</td>';
        studentsdata += '<td>'+obj?.course+'</td>';
        studentsdata += '<td>'+obj?.branch+'</td>';
        studentsdata += '<td>'+obj?.session+'</td>';
        studentsdata += '<td>'+obj?.father+'</td>';
        studentsdata += ' <td>'+obj?.mother+'</td>';
        studentsdata += ' <td>'+obj?.mobileno+'</td>';
        studentsdata += ' <td>'+obj?.emailid+'</td>';
        studentsdata += ' <td>'+obj?.regdate+'</td>';
        studentsdata += ' <td>';
        studentsdata += '    <button class="edit-button"><i class="fa-regular fa-pen-to-square"></i></button>';
        studentsdata += '<button class="delete-button"><i class="fa-solid fa-trash-can"></i></button>';
        studentsdata += ' </td>';
        studentsdata += ' </tr>';
        document.getElementById('studentdata').innerHTML += studentsdata;
    });
});