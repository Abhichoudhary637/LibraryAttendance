const { ipcRenderer } = require('electron');
document.addEventListener('DOMContentLoaded', () => {
    getEmployees();
});

function getEmployees(){
    const fts = document.getElementById('fts').value;
    ipcRenderer.send('getEmployee', { fts });
}

ipcRenderer.on('getEmployeeRes', (event, arg) => {
    if (arg.code != 200) {
        console.error('Error:', arg.error);
        alert(arg.message);
        return;
    }

    console.log(arg.data);
    document.getElementById('employeedata').innerHTML = "";
    arg?.data.forEach(obj => {
        let employeedata = "";
        let imageData = "Assets/ss.png"
        if (obj?.imagepath){
            imageData = `data:image;base64,${Buffer.from(obj.imagepath).toString('base64')}`;
        }
        employeedata += '<tr>';
        employeedata += ' <td><img src="'+imageData+'" style="width: 40%; border: 1px solid gray; border-radius: 10px;" > '+obj?.name+' | '+obj?.employee_id+'</td>';
        employeedata += '<td>'+obj?.department+'</td>';
        employeedata += '<td>'+obj?.designation+'</td>';
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

function saveEmployeeData() {
    let data = Object.fromEntries(new FormData(document.getElementById('employeeForm')).entries());
    const fileInput = document.getElementById('employee_image');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
    
        reader.onload = () => {
          const imageData = reader.result; // Base64 encoded string of the image
          data.imageData = imageData;     // Include image data if file is selected
    
          // Send data to main process
          ipcRenderer.send('saveEmployeeData', JSON.stringify(data));
        };
        reader.readAsDataURL(file); // Read the file as Base64
      }else {
        ipcRenderer.send('saveEmployeeData', JSON.stringify(data));
      }
}

ipcRenderer.on('getEmployeeResOnSave', (event, arg) => {
    if (arg.code != 200) {
        console.error('Error:', arg.error);
        alert(arg.message);
        return;
    }

    const modalElement = document.getElementById("exampleModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modalInstance.hide(); 
    getEmployees();
});