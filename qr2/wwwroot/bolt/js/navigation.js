// Navigation and UI related functions

// Screen Management
function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
}

function updateSidebarActiveState(activeSection) {
    // Remove active class from all sidebar links
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current section
    const sidebarLinks = {
        'dashboard': document.querySelectorAll('.sidebar-nav a[onclick*="showDashboard"]'),
        'products': document.querySelectorAll('.sidebar-nav a[onclick*="showProductList"]'),
        'users': document.querySelectorAll('.sidebar-nav a[onclick*="showUsers"]'),
        'feedback': document.querySelectorAll('.sidebar-nav a[onclick*="showFeedback"]'),
        'admin-feedback': document.querySelectorAll('.sidebar-nav a[onclick*="showAdminFeedback"]'),
        'settings': document.querySelectorAll('.sidebar-nav a[onclick*="showSettings"]')
    };
    
    if (sidebarLinks[activeSection]) {
        sidebarLinks[activeSection].forEach(link => {
            const linkText = link.textContent.trim().toLowerCase();
            if ((activeSection === 'dashboard' && linkText.includes('dashboard')) ||
                (activeSection === 'products' && linkText.includes('products')) ||
                (activeSection === 'users' && linkText.includes('users')) ||
                (activeSection === 'feedback' && linkText.includes('feedback') && !linkText.includes('admin')) ||
                (activeSection === 'admin-feedback' && linkText.includes('admin feedback')) ||
                (activeSection === 'settings' && linkText.includes('settings'))) {
                link.classList.add('active');
            }
        });
    }
}

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// Profile Dropdown
function toggleProfileDropdown() {
    const menu = document.querySelector('.profile-menu');
    menu.classList.toggle('show');
}

// Initialize navigation functionality
function initializeNavigation() {
    // Close profile dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const profileDropdown = document.querySelector('.profile-dropdown');
        const profileMenu = document.querySelector('.profile-menu');
        
        if (!profileDropdown.contains(event.target)) {
            profileMenu.classList.remove('show');
        }
    });

    // Language Selection
    const languageSelect = document.querySelector('.language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            console.log('Language changed to:', selectedLanguage);
            // Here you can implement language switching logic
            // For now, we'll just show an alert
            alert(`Language changed to: ${selectedLanguage === 'en' ? 'English' : 'Türkçe'}`);
        });
    }

    // Responsive sidebar handling
    window.addEventListener('resize', function() {
        const sidebar = document.querySelector('.sidebar');
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.sidebar');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (window.innerWidth <= 768 && 
            !sidebar.contains(event.target) && 
            !menuToggle.contains(event.target) &&
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.classList.remove('show');
                
                // Clean up custom selects when modal is closed
                const modalId = modal.id;
                if (activeCustomSelects.has(modalId)) {
                    cleanupCustomSelect(modalId);
                }
                
                // Reset Add Product form if it's the add product modal
                if (modalId === 'addProductModal') {
                    resetAddProductForm();
                }
            }
        });
    });

    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                activeModal.classList.remove('show');
                
                // Clean up custom selects when modal is closed
                const modalId = activeModal.id;
                if (activeCustomSelects.has(modalId)) {
                    cleanupCustomSelect(modalId);
                }
                
                // Reset Add Product form if it's the add product modal
                if (modalId === 'addProductModal') {
                    resetAddProductForm();
                }
            }
        }
    });
}