fetch('sidebar.html').then(response=>response.text()).then(data=>{
    document.getElementById('sidebar').innerHTML = data;
}).catch(error=>console.error('Error loading HTML:', error))

document.getElementById("username").innerText = localStorage.getItem("username");
document.getElementById("details").innerText = localStorage.getItem("details");
if(document.getElementById("dashboardDetails")){
    document.getElementById("dashboardDetails").innerText = "Welcome back "+localStorage.getItem("username")+" !";
}