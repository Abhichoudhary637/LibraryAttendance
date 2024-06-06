function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const pageBg = document.getElementById('bg_transparent');
    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px';
        pageBg.classList.remove('page_bg_open');
    } else {
        sidebar.style.left = '0px';
        pageBg.classList.add('page_bg_open');
    }
}

// Function to close the sidebar
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.left = '-250px';
}

// Add event listener to close the sidebar when clicking outside of it
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const burgerIcon = document.querySelector('.burger-icon');
    const sidebarRect = sidebar.getBoundingClientRect();
    if (
        event.clientX < sidebarRect.left ||
        event.clientX > sidebarRect.right ||
        event.clientY < sidebarRect.top ||
        event.clientY > sidebarRect.bottom
    ) {
        if (!burgerIcon.contains(event.target)) {
            closeSidebar();
        }
    }
});


// //////////////////////
let html5QrCode;

function onScanSuccess(decodedText, decodedResult) {
    document.getElementById('scannedResult').innerText = decodedText;
    console.log(`Code matched = ${decodedText}`, decodedResult);
}

function onScanFailure(error) {
    console.warn(`Code scan error = ${error}`);
}

document.getElementById('startScanner').addEventListener('click', function() {
    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("scanner");
    }
    html5QrCode.start(
        { facingMode: "environment" }, // camera facing mode
        {
            fps: 10,    // frames per second
            qrbox: { width: 250, height: 250 }  // scanning box
        },
        onScanSuccess,
        onScanFailure
    );
});

// document.getElementById('stopScanner').addEventListener('click', function() {
//     if (html5QrCode) {
//         html5QrCode.stop().then((ignore) => {
//             console.log("QR Code scanning stopped.");
//         }).catch((err) => {
//             console.error("Unable to stop scanning.", err);
//         });
//     }
// });