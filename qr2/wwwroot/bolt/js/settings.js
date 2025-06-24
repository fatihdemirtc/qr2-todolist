// Settings related functions
function showSettings() {
    hideAllScreens();
    document.getElementById('settingsScreen').classList.add('active');
    
    // Update sidebar active state
    updateSidebarActiveState('settings');
}

// Initialize settings functionality
function initializeSettings() {
    // Change Password Form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            
            if (newPassword !== confirmNewPassword) {
                alert('New passwords do not match!');
                return;
            }
            
            if (currentPassword && newPassword) {
                // Simulate password change
                alert('Password updated successfully!');
                changePasswordForm.reset();
            }
        });
    }
}