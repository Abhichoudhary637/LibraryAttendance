function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px';
    } else {
        sidebar.style.left = '0px';
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
