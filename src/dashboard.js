const { ipcRenderer } = require('electron');
document.addEventListener('DOMContentLoaded', () => {
    getDashboardCountData();
});

function getDashboardCountData() {
    ipcRenderer.send('getCountData', {});
}

ipcRenderer.on('getCountDataRes', (event, args) => {
    if (args.code != 200) {
        console.error('Error:', args.error);
        alert(args.message);
        return;
    }

    let responseobj = {};
    let totalcount = 0;
    args?.data?.forEach(obj => {
        totalcount = totalcount + Number(obj?.entry_count);
        responseobj[obj?.usertype] = obj?.entry_count;
    });

    document.getElementById("studentVisitorCount").innerText = responseobj?.student || 0;
    document.getElementById("empVisitorCount").innerText = responseobj?.employee || 0;
    document.getElementById("otherVisitCount").innerText = responseobj?.other || 0;
    document.getElementById("totalvisitor").innerText = totalcount;
});

function getVisitorData() {
    let visitorCode = document.getElementById("visitorCode").value
    ipcRenderer.send('getVisitorData', { visitorCode });
}

ipcRenderer.on('getVisitorDataRes', (event, args) => {
    if (args.code != 200) {
        console.error('Error:', args.error);
        alert(args.message);
        return;
    }

    let visitorData = args?.data;
    let showButton = "Check-In";
    if (visitorData?.entry_time) {
        showButton = "Check-Out";
    }

    let imageData = "./Assets/image/student-preview.png"
    if (visitorData?.imagepath) {
        imageData = `data:image;base64,${Buffer.from(visitorData.imagepath).toString('base64')}`;
    }
    document.getElementById("visit_name").innerText = visitorData?.name;
    document.getElementById("visit_image").src = imageData;
    let visitor_id = null;
    if (visitorData?.visitor_id){
        visitor_id = visitorData?.visitor_id
    }
    let html = `<div class="row">
                                            <div class="col-md-6 text_mid mb-2">
                                                <div>Mobile No.</div>
                                                <div class="fw-bold">`+ visitorData?.mobileno + `</div>
                                            </div>
                                            <div class="col-md-6 text_mid  mb-2">
                                                <div>Email ID</div>
                                                <div class="fw-bold">`+ visitorData?.emailid + `</div>
                                            </div>`;

    if (visitorData?.usertype == "student") {
        html += `<div class="col-md-6 text_mid  mb-2">
        <div>Course</div>
        <div class="fw-bold">`+ visitorData?.course + `</div>
    </div>`;
    } else if (visitorData?.usertype == "employee") {
        html += `<div class="col-md-6 text_mid  mb-2">
                                                <div>Designation</div>
                                                <div class="fw-bold">`+ visitorData?.designation + `</div>
                                            </div>`;
    }

    html += ` <div class="col-md-6 text_mid  mb-2">
                                                <div>Address</div>
                                                <div class="fw-bold">`+ visitorData?.address + `</div>
                                            </div>`;
    html += `<div class="col-12 mb-2 mt-4 text-right">
                                                <button class="btn btn-dark px-4" onclick="checkInCheck(`+visitorData?.membership_id+`, `+visitor_id+`,'`+visitorData.usertype+`')" id="checkInCheckOutButton">
                                                    <div class="text_small">`+ showButton + `</div>
                                                </button>
                                            </div>
                                        </div>`;

    document.getElementById("visit_info").innerHTML = html;
    document.getElementById('visitCard').classList.remove("d-none");
});

function checkInCheck(membership_id, visitor_id, usertype){
    ipcRenderer.send('checkInCheck', { membership_id, visitor_id, usertype });
}

ipcRenderer.on('checkInCheckRes', (event, args) => {
    if (args.code != 200) {
        console.error('Error:', args.error);
        alert(args.message);
        return;
    }

    alert(args.message);
    location.reload();
});