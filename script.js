// Get modal and buttons
const modal = document.getElementById("fileModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeBtn");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const fileInput = document.getElementById("fileInput");

// Open modal when the button is clicked
openModalBtn.onclick = function() {
  modal.style.display = "block";
}

// Close modal when the close (X) button is clicked
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// Close modal when the cancel button is clicked
cancelBtn.onclick = function() {
  modal.style.display = "none";
}

// Save the file (this is a placeholder for actual file handling)
saveBtn.onclick = function() {
  const file = fileInput.files[0];
  if (file) {
    alert("File '" + file.name + "' selected.");
  } else {
    alert("No file selected.");
  }
  modal.style.display = "none";
}

// Close modal if the user clicks outside of the modal
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

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