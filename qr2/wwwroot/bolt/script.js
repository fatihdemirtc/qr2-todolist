// Screen Management
function showLogin() {
    hideAllScreens();
    document.getElementById('loginScreen').classList.add('active');
}

function showRegister() {
    hideAllScreens();
    document.getElementById('registerScreen').classList.add('active');
}

function showDashboard() {
    hideAllScreens();
    document.getElementById('dashboardScreen').classList.add('active');

    // Update sidebar active state
    updateSidebarActiveState('dashboard');
}

function showFeedback() {
    hideAllScreens();
    document.getElementById('feedbackScreen').classList.add('active');

    // Update sidebar active state
    updateSidebarActiveState('feedback');

    // Initialize feedback display
    initializeFeedbackDisplay();
}

function updateSidebarActiveState(activeSection) {
    // Remove active class from all sidebar links
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current section
    const sidebarLinks = {
        'dashboard': document.querySelectorAll('.sidebar-nav a[onclick*="showDashboard"]'),
        'feedback': document.querySelectorAll('.sidebar-nav a[onclick*="showFeedback"]')
    };

    if (sidebarLinks[activeSection]) {
        sidebarLinks[activeSection].forEach(link => {
            if (link.textContent.trim().includes(activeSection === 'dashboard' ? 'Dashboard' : 'Feedback')) {
                link.classList.add('active');
            }
        });
    }
}

// Global variable to store current product name
let currentProductName = '';

function showProductDetail(productName, productType, views) {
    hideAllScreens();
    document.getElementById('productDetailScreen').classList.add('active');

    // Store current product name for delete functionality
    currentProductName = productName;

    // Update product detail content
    document.getElementById('productDetailTitle').textContent = productName;
    document.getElementById('productName').textContent = productName;
    document.getElementById('productType').textContent = productType;
    document.getElementById('totalScans').textContent = views.toLocaleString();
    document.getElementById('uniqueScans').textContent = Math.floor(views * 0.8).toLocaleString();

    // Update QR code and social media info based on product
    updateQRSocialInfo(productName);

    // Initialize charts
    setTimeout(() => {
        initializeCharts();
    }, 100);
}

function updateQRSocialInfo(productName) {
    // Sample data - in a real app, this would come from a database
    const productSocialData = {
        'Smartphone Pro': {
            platform: 'instagram',
            icon: 'fab fa-instagram',
            color: '#e4405f',
            url: 'https://instagram.com/smartphone_pro'
        },
        'Designer T-Shirt': {
            platform: 'youtube',
            icon: 'fab fa-youtube',
            color: '#ff0000',
            url: 'https://youtube.com/designer_tshirt'
        },
        'Smart Lamp': {
            platform: 'facebook',
            icon: 'fab fa-facebook',
            color: '#4267b2',
            url: 'https://facebook.com/smart_lamp'
        },
        'JavaScript Guide': {
            platform: 'twitter',
            icon: 'fab fa-twitter',
            color: '#1da1f2',
            url: 'https://twitter.com/js_guide'
        }
    };

    const data = productSocialData[productName] || {
        platform: 'instagram',
        icon: 'fab fa-instagram',
        color: '#e4405f',
        url: 'https://instagram.com/example'
    };

    // Update social media icon and URL
    const socialIcon = document.getElementById('socialPlatformIcon');
    const socialUrl = document.getElementById('socialPlatformUrl');

    socialIcon.className = data.icon;
    socialIcon.style.color = data.color;
    socialUrl.href = data.url;
    socialUrl.textContent = data.url;

    // Generate a random QR code image (using a placeholder service)
    const qrImage = document.getElementById('qrCodeImage');
    const randomId = Math.floor(Math.random() * 1000) + 1;
    qrImage.src = `https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1&random=${randomId}`;
}

function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
}

// Feedback System
let feedbackHistory = JSON.parse(localStorage.getItem('feedbackHistory')) || [];

function initializeFeedbackDisplay() {
    const formSection = document.getElementById('feedbackFormSection');
    const historySection = document.getElementById('feedbackHistorySection');

    if (feedbackHistory.length === 0) {
        // Show form, hide history
        formSection.style.display = 'block';
        historySection.style.display = 'none';
    } else {
        // Show history, hide form
        formSection.style.display = 'none';
        historySection.style.display = 'block';

        // Populate feedback history table
        populateFeedbackTable();
    }
}

function populateFeedbackTable() {
    const tableBody = document.getElementById('feedbackTableBody');
    tableBody.innerHTML = '';

    feedbackHistory.forEach(feedback => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="feedback-content">${feedback.content}</td>
            <td class="feedback-date">${feedback.date}</td>
        `;
        tableBody.appendChild(row);
    });
}

function submitFeedback(message) {
    const feedback = {
        content: message,
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        timestamp: Date.now()
    };

    feedbackHistory.unshift(feedback); // Add to beginning of array
    localStorage.setItem('feedbackHistory', JSON.stringify(feedbackHistory));

    // Show success message
    alert('Thank you for your feedback! Your message has been submitted successfully.');

    // Refresh the feedback display
    initializeFeedbackDisplay();
}

function showNewFeedbackForm() {
    const modal = document.getElementById('newFeedbackModal');
    modal.classList.add('show');
}

function closeNewFeedbackModal() {
    const modal = document.getElementById('newFeedbackModal');
    modal.classList.remove('show');
    document.getElementById('newFeedbackForm').reset();
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

// Close profile dropdown when clicking outside
document.addEventListener('click', function (event) {
    const profileDropdown = document.querySelector('.profile-dropdown');
    const profileMenu = document.querySelector('.profile-menu');

    if (!profileDropdown.contains(event.target)) {
        profileMenu.classList.remove('show');
    }
});

// Add Product Modal
function showAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.classList.add('show');

    // Reset form and validation when opening modal
    resetAddProductForm();
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.classList.remove('show');
    resetAddProductForm();
}

function resetAddProductForm() {
    const form = document.getElementById('addProductForm');
    const submitBtn = document.getElementById('addProductSubmitBtn');
    const productNumberValidation = document.getElementById('productNumberValidation');
    const productPasswordValidation = document.getElementById('productPasswordValidation');

    form.reset();
    submitBtn.disabled = true;
    productNumberValidation.textContent = '';
    productPasswordValidation.textContent = '';

    // Remove validation classes
    document.getElementById('productNumber').classList.remove('invalid', 'valid');
    document.getElementById('productPassword').classList.remove('invalid', 'valid');
}

// Real-time validation for Add Product form
function validateAddProductField(fieldId, validationId) {
    const field = document.getElementById(fieldId);
    const validation = document.getElementById(validationId);
    const value = field.value.trim();
    const isValid = value.length === 8;

    // Update field styling
    field.classList.remove('invalid', 'valid');
    if (value.length > 0) {
        field.classList.add(isValid ? 'valid' : 'invalid');
    }

    // Update validation message
    if (value.length === 0) {
        validation.textContent = '';
    } else if (value.length < 8) {
        validation.textContent = `Must be exactly 8 characters (${value.length}/8)`;
    } else if (value.length === 8) {
        validation.textContent = '';
    }

    // Check if both fields are valid
    validateAddProductForm();
}

function validateAddProductForm() {
    const productNumber = document.getElementById('productNumber').value.trim();
    const productPassword = document.getElementById('productPassword').value.trim();
    const submitBtn = document.getElementById('addProductSubmitBtn');

    const isProductNumberValid = productNumber.length === 8;
    const isProductPasswordValid = productPassword.length === 8;
    const isFormValid = isProductNumberValid && isProductPasswordValid;

    submitBtn.disabled = !isFormValid;
}

// Social Media Modal
function showSocialMediaModal(productNumber) {
    const modal = document.getElementById('socialMediaModal');
    const productDisplay = document.getElementById('productNumberDisplay');
    productDisplay.textContent = `Product: ${productNumber}`;
    modal.classList.add('show');

    // Initialize custom select for social media modal with delay to ensure modal is fully rendered
    setTimeout(() => {
        initializeCustomSelect('socialMediaModal');
    }, 50);
}

function closeSocialMediaModal() {
    const modal = document.getElementById('socialMediaModal');
    modal.classList.remove('show');

    // Reset form
    resetSocialMediaForm('socialMediaModal');

    // Clean up event listeners
    cleanupCustomSelect('socialMediaModal');
}

function confirmSocialMedia() {
    const platformSelect = document.getElementById('platformSelect');
    const platformUrl = document.getElementById('platformUrl');

    if (!platformSelect.value) {
        alert('Please select a social media platform.');
        return;
    }

    if (!platformUrl.value.trim()) {
        alert('Please enter a URL for the selected platform.');
        return;
    }

    // Show success message
    alert('Social media links saved successfully!');
    console.log('Social Media Link:', {
        platform: platformSelect.value,
        url: platformUrl.value.trim()
    });

    // Close modal
    closeSocialMediaModal();
}

// Edit Product Modal Functions
function showEditProductModal() {
    const modal = document.getElementById('editProductModal');
    modal.classList.add('show');

    // Initialize custom select for edit modal with delay to ensure modal is fully rendered
    setTimeout(() => {
        initializeCustomSelect('editProductModal');
    }, 50);
}

function closeEditProductModal() {
    const modal = document.getElementById('editProductModal');
    modal.classList.remove('show');

    // Reset form
    resetSocialMediaForm('editProductModal');

    // Clean up event listeners
    cleanupCustomSelect('editProductModal');
}

function confirmEditProduct() {
    const platformSelect = document.getElementById('editPlatformSelect');
    const platformUrl = document.getElementById('editPlatformUrl');

    if (!platformSelect.value) {
        alert('Please select a social media platform.');
        return;
    }

    if (!platformUrl.value.trim()) {
        alert('Please enter a URL for the selected platform.');
        return;
    }

    // Show success message
    alert('Product updated successfully!');
    console.log('Updated Social Media Link:', {
        platform: platformSelect.value,
        url: platformUrl.value.trim()
    });

    // Close modal
    closeEditProductModal();
}

// Edit Social Media Modal Functions
function showEditSocialModal() {
    const modal = document.getElementById('editSocialModal');
    modal.classList.add('show');

    // Pre-populate with current values
    const currentIcon = document.getElementById('socialPlatformIcon');
    const currentUrl = document.getElementById('socialPlatformUrl');

    // Get current platform from icon class
    let currentPlatform = '';
    if (currentIcon.classList.contains('fa-instagram')) currentPlatform = 'instagram';
    else if (currentIcon.classList.contains('fa-youtube')) currentPlatform = 'youtube';
    else if (currentIcon.classList.contains('fa-facebook')) currentPlatform = 'facebook';
    else if (currentIcon.classList.contains('fa-twitter')) currentPlatform = 'twitter';
    else if (currentIcon.classList.contains('fa-tiktok')) currentPlatform = 'tiktok';
    else if (currentIcon.classList.contains('fa-linkedin')) currentPlatform = 'linkedin';
    else if (currentIcon.classList.contains('fa-pinterest')) currentPlatform = 'pinterest';

    // Initialize custom select for edit social modal with delay to ensure modal is fully rendered
    setTimeout(() => {
        initializeCustomSelect('editSocialModal');

        // Set current values after initialization
        setTimeout(() => {
            const selectWrapper = modal.querySelector('.custom-select-wrapper');
            const nativeSelect = selectWrapper.querySelector('.platform-select');
            const selectText = selectWrapper.querySelector('.select-text');
            const urlInput = modal.querySelector('input[type="url"]');

            if (currentPlatform) {
                nativeSelect.value = currentPlatform;

                // Find the option data
                const option = selectWrapper.querySelector(`[data-value="${currentPlatform}"]`);
                if (option) {
                    const icon = option.dataset.icon;
                    const color = option.dataset.color;
                    const text = option.querySelector('span').textContent;

                    selectText.innerHTML = `<i class="${icon}" style="color: ${color};"></i><span>${text}</span>`;
                    urlInput.disabled = false;
                    urlInput.placeholder = `Enter ${text} URL`;
                }
            }

            urlInput.value = currentUrl.href;
        }, 50);
    }, 50);
}

function closeEditSocialModal() {
    const modal = document.getElementById('editSocialModal');
    modal.classList.remove('show');

    // Reset form
    resetSocialMediaForm('editSocialModal');

    // Clean up event listeners
    cleanupCustomSelect('editSocialModal');
}

function confirmEditSocial() {
    const platformSelect = document.getElementById('editSocialPlatformSelect');
    const platformUrl = document.getElementById('editSocialPlatformUrl');

    if (!platformSelect.value) {
        alert('Please select a social media platform.');
        return;
    }

    if (!platformUrl.value.trim()) {
        alert('Please enter a URL for the selected platform.');
        return;
    }

    // Update the display with new values
    const socialIcon = document.getElementById('socialPlatformIcon');
    const socialUrl = document.getElementById('socialPlatformUrl');

    // Get platform data
    const platformData = {
        youtube: { icon: 'fab fa-youtube', color: '#ff0000' },
        instagram: { icon: 'fab fa-instagram', color: '#e4405f' },
        twitter: { icon: 'fab fa-twitter', color: '#1da1f2' },
        facebook: { icon: 'fab fa-facebook', color: '#4267b2' },
        tiktok: { icon: 'fab fa-tiktok', color: '#000000' },
        linkedin: { icon: 'fab fa-linkedin', color: '#2867b2' },
        pinterest: { icon: 'fab fa-pinterest', color: '#bd081c' }
    };

    const data = platformData[platformSelect.value];
    if (data) {
        socialIcon.className = data.icon;
        socialIcon.style.color = data.color;
        socialUrl.href = platformUrl.value.trim();
        socialUrl.textContent = platformUrl.value.trim();
    }

    // Show success message
    alert('Social media link updated successfully!');
    console.log('Updated Social Media Link:', {
        platform: platformSelect.value,
        url: platformUrl.value.trim()
    });

    // Close modal
    closeEditSocialModal();
}

// Delete Current Product Function
function deleteCurrentProduct() {
    if (!currentProductName) {
        alert('No product selected for deletion.');
        return;
    }

    // Show confirmation dialog
    if (confirm(`Are you sure you want to delete "${currentProductName}"?`)) {
        // Show success message
        alert(`"${currentProductName}" has been deleted successfully.`);

        // Navigate back to dashboard
        showDashboard();

        // Here you would typically make an API call to delete the product
        console.log(`Product "${currentProductName}" deleted`);

        // Reset current product name
        currentProductName = '';
    }
}

// Store active custom select instances to prevent multiple initializations
const activeCustomSelects = new Map();

// Custom Select Functions
function initializeCustomSelect(modalId) {
    // Clean up any existing instance first
    cleanupCustomSelect(modalId);

    const modal = document.getElementById(modalId);
    if (!modal) return;

    const selectWrapper = modal.querySelector('.custom-select-wrapper');
    if (!selectWrapper) return;

    const selectDisplay = selectWrapper.querySelector('.select-display');
    const selectOptions = selectWrapper.querySelector('.select-options');
    const selectText = selectWrapper.querySelector('.select-text');
    const nativeSelect = selectWrapper.querySelector('.platform-select');
    const urlInput = modal.querySelector('input[type="url"]');

    if (!selectDisplay || !selectOptions || !selectText || !nativeSelect || !urlInput) return;

    // Create event handlers
    const displayClickHandler = function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Close other dropdowns first
        document.querySelectorAll('.select-display.active').forEach(display => {
            if (display !== selectDisplay) {
                display.classList.remove('active');
                display.parentElement.querySelector('.select-options').classList.remove('show');
            }
        });

        selectDisplay.classList.toggle('active');
        selectOptions.classList.toggle('show');
    };

    const optionsClickHandler = function (e) {
        e.preventDefault();
        e.stopPropagation();

        const option = e.target.closest('.select-option');
        if (!option) return;

        const value = option.dataset.value;
        const icon = option.dataset.icon;
        const color = option.dataset.color;
        const text = option.querySelector('span')?.textContent || '';

        // Update native select
        nativeSelect.value = value;

        // Update display
        if (value) {
            selectText.innerHTML = `<i class="${icon}" style="color: ${color};"></i><span>${text}</span>`;
            urlInput.disabled = false;
            urlInput.placeholder = `Enter ${text} URL`;
        } else {
            selectText.innerHTML = '<span>Choose a platform...</span>';
            urlInput.disabled = true;
            urlInput.placeholder = 'Enter the URL for the selected platform';
            urlInput.value = '';
        }

        // Close dropdown
        selectDisplay.classList.remove('active');
        selectOptions.classList.remove('show');
    };

    const documentClickHandler = function (e) {
        if (!selectWrapper.contains(e.target)) {
            selectDisplay.classList.remove('active');
            selectOptions.classList.remove('show');
        }
    };

    // Add event listeners
    selectDisplay.addEventListener('click', displayClickHandler);
    selectOptions.addEventListener('click', optionsClickHandler);
    document.addEventListener('click', documentClickHandler);

    // Store handlers for cleanup
    activeCustomSelects.set(modalId, {
        selectDisplay,
        selectOptions,
        displayClickHandler,
        optionsClickHandler,
        documentClickHandler
    });
}

function cleanupCustomSelect(modalId) {
    const instance = activeCustomSelects.get(modalId);
    if (instance) {
        // Remove event listeners
        instance.selectDisplay.removeEventListener('click', instance.displayClickHandler);
        instance.selectOptions.removeEventListener('click', instance.optionsClickHandler);
        document.removeEventListener('click', instance.documentClickHandler);

        // Reset display state
        instance.selectDisplay.classList.remove('active');
        instance.selectOptions.classList.remove('show');

        // Remove from active instances
        activeCustomSelects.delete(modalId);
    }
}

function resetSocialMediaForm(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const selectWrapper = modal.querySelector('.custom-select-wrapper');
    if (!selectWrapper) return;

    const selectDisplay = selectWrapper.querySelector('.select-display');
    const selectOptions = selectWrapper.querySelector('.select-options');
    const selectText = selectWrapper.querySelector('.select-text');
    const nativeSelect = selectWrapper.querySelector('.platform-select');
    const urlInput = modal.querySelector('input[type="url"]');

    if (nativeSelect) nativeSelect.value = '';
    if (selectText) selectText.innerHTML = '<span>Choose a platform...</span>';
    if (urlInput) {
        urlInput.disabled = true;
        urlInput.placeholder = 'Enter the URL for the selected platform';
        urlInput.value = '';
    }
    if (selectDisplay) selectDisplay.classList.remove('active');
    if (selectOptions) selectOptions.classList.remove('show');
}

// Chart Variables
let viewsChart = null;
let osChart = null;

// Initialize Charts
function initializeCharts() {
    // Destroy existing charts if they exist
    if (viewsChart) {
        viewsChart.destroy();
    }
    if (osChart) {
        osChart.destroy();
    }

    // Views Chart (Line Chart)
    const viewsCtx = document.getElementById('viewsChart').getContext('2d');

    // Generate sample data for last 30 days
    const last30Days = [];
    const viewsData = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        last30Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        // Generate random views data with some trend
        viewsData.push(Math.floor(Math.random() * 50) + 20 + (i % 7 === 0 ? 20 : 0));
    }

    viewsChart = new Chart(viewsCtx, {
        type: 'line',
        data: {
            labels: last30Days,
            datasets: [{
                label: 'Views',
                data: viewsData,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#666'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#666',
                        maxTicksLimit: 8
                    }
                }
            },
            elements: {
                point: {
                    hoverBackgroundColor: '#667eea'
                }
            }
        }
    });

    // OS Chart (Horizontal Bar Chart)
    const osCtx = document.getElementById('osChart').getContext('2d');

    osChart = new Chart(osCtx, {
        type: 'bar',
        data: {
            labels: ['Android', 'iOS'],
            datasets: [{
                label: 'Users',
                data: [65, 35],
                backgroundColor: [
                    '#a4de6c',
                    '#ffc658'
                ],
                borderColor: [
                    '#82ca9d',
                    '#ffb347'
                ],
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#666',
                        callback: function (value) {
                            return value + '%';
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#666'
                    }
                }
            }
        }
    });
}

// Form Submissions
document.addEventListener('DOMContentLoaded', function () {
    // Login Form
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (email && password) {
                // Simulate login
                alert('Login successful!');
                showDashboard();
            }
        });
    }

    // Register Form
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            if (email && password) {
                // Simulate registration
                alert('Registration successful!');
                showDashboard();
            }
        });
    }

    // Add Product Form with Real-time Validation
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        // Add real-time validation event listeners
        const productNumberField = document.getElementById('productNumber');
        const productPasswordField = document.getElementById('productPassword');

        productNumberField.addEventListener('input', function () {
            validateAddProductField('productNumber', 'productNumberValidation');
        });

        productPasswordField.addEventListener('input', function () {
            validateAddProductField('productPassword', 'productPasswordValidation');
        });

        addProductForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const productNumber = document.getElementById('productNumber').value.trim();
            const productPassword = document.getElementById('productPassword').value.trim();

            // Final validation check
            if (productNumber.length !== 8 || productPassword.length !== 8) {
                alert('Both Product Number and Product Password must be exactly 8 characters long.');
                return;
            }

            // Close add product modal
            closeAddProductModal();

            // Show social media modal
            showSocialMediaModal(productNumber);
        });
    }

    // Main Feedback Form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const message = document.getElementById('feedbackMessage').value.trim();

            if (message) {
                submitFeedback(message);
                feedbackForm.reset();
            }
        });
    }

    // New Feedback Modal Form
    const newFeedbackForm = document.getElementById('newFeedbackForm');
    if (newFeedbackForm) {
        newFeedbackForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const message = document.getElementById('newFeedbackMessage').value.trim();

            if (message) {
                submitFeedback(message);
                closeNewFeedbackModal();
            }
        });
    }
});

// Close modals when clicking outside
document.addEventListener('click', function (event) {
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
document.addEventListener('keydown', function (event) {
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

// Language Selection
document.addEventListener('DOMContentLoaded', function () {
    const languageSelect = document.querySelector('.language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function () {
            const selectedLanguage = this.value;
            console.log('Language changed to:', selectedLanguage);
            // Here you can implement language switching logic
            // For now, we'll just show an alert
            alert(`Language changed to: ${selectedLanguage === 'en' ? 'English' : 'Türkçe'}`);
        });
    }
});

// Responsive sidebar handling
window.addEventListener('resize', function () {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
    }
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function (event) {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');

    if (window.innerWidth <= 768 &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target) &&
        sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});