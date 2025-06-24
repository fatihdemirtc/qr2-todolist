// Users related functions
function showUsers() {
    hideAllScreens();
    document.getElementById('usersScreen').classList.add('active');
    
    // Update sidebar active state
    updateSidebarActiveState('users');
}

function showUserDetail(email) {
    hideAllScreens();
    document.getElementById('userDetailScreen').classList.add('active');
    
    // Update user detail content
    document.getElementById('userDetailTitle').textContent = `User: ${email}`;
    document.getElementById('userEmail').textContent = email;
    
    // Update sidebar active state
    updateSidebarActiveState('users');
}

function showUserProductDetail(productName, productType, views) {
    // This will show the same product detail screen but from user context
    showProductDetail(productName, productType, views);
}

// Initialize users functionality
function initializeUsers() {
    // Users functionality is handled by click events in HTML
    // Any additional user management functionality can be added here
}