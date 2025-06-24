// Dashboard related functions
function showDashboard() {
    hideAllScreens();
    document.getElementById('dashboardScreen').classList.add('active');
    
    // Update sidebar active state
    updateSidebarActiveState('dashboard');
}

// Initialize dashboard functionality
function initializeDashboard() {
    // Dashboard is already initialized with static content
    // Any dynamic dashboard functionality can be added here
}

