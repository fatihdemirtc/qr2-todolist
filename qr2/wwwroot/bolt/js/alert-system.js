// Custom Alert System

// Create toast container if it doesn't exist
function createToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

// Show Toast Notification
function showToast(message, type = 'info', duration = 4000) {
    const container = createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fas fa-check',
        error: 'fas fa-times',
        warning: 'fas fa-exclamation',
        info: 'fas fa-info'
    };

    const titles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information'
    };

    toast.innerHTML = `
        <div class="toast-icon ${type}">
            <i class="${icons[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${titles[type]}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toast);

    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Auto remove toast
    setTimeout(() => {
        closeToast(toast.querySelector('.toast-close'));
    }, duration);
}

// Close Toast
function closeToast(closeBtn) {
    const toast = closeBtn.closest('.toast');
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Show Custom Alert
function showAlert(message, type = 'info', title = null) {
    return new Promise((resolve) => {
        // Remove existing alert if any
        const existingAlert = document.querySelector('.custom-alert-overlay');
        if (existingAlert) {
            existingAlert.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';

        const icons = {
            success: 'fas fa-check',
            error: 'fas fa-times',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const titles = {
            success: title || 'Success!',
            error: title || 'Error!',
            warning: title || 'Warning!',
            info: title || 'Information'
        };

        overlay.innerHTML = `
            <div class="custom-alert">
                <div class="custom-alert-header">
                    <div class="custom-alert-icon ${type}">
                        <i class="${icons[type]}"></i>
                    </div>
                    <div class="custom-alert-title">${titles[type]}</div>
                    <div class="custom-alert-message">${message}</div>
                </div>
                <div class="custom-alert-actions">
                    <button class="custom-alert-btn primary" onclick="closeAlert(this, true)">OK</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Show alert with animation
        setTimeout(() => {
            overlay.classList.add('show');
        }, 50);

        // Store resolve function for later use
        overlay._resolve = resolve;

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeAlert(overlay.querySelector('.custom-alert-btn'), true);
            }
        });

        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeAlert(overlay.querySelector('.custom-alert-btn'), true);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    });
}

// Show Confirmation Dialog
function showConfirm(message, title = 'Confirm Action') {
    return new Promise((resolve) => {
        // Remove existing alert if any
        const existingAlert = document.querySelector('.custom-alert-overlay');
        if (existingAlert) {
            existingAlert.remove();
        }

        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';

        overlay.innerHTML = `
            <div class="custom-alert">
                <div class="custom-alert-header">
                    <div class="custom-alert-icon confirm">
                        <i class="fas fa-question"></i>
                    </div>
                    <div class="custom-alert-title">${title}</div>
                    <div class="custom-alert-message">${message}</div>
                </div>
                <div class="custom-alert-actions">
                    <button class="custom-alert-btn secondary" onclick="closeAlert(this, false)">Cancel</button>
                    <button class="custom-alert-btn danger" onclick="closeAlert(this, true)">Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Show alert with animation
        setTimeout(() => {
            overlay.classList.add('show');
        }, 50);

        // Store resolve function for later use
        overlay._resolve = resolve;

        // Close on overlay click (cancel)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeAlert(overlay.querySelector('.custom-alert-btn.secondary'), false);
            }
        });

        // Close on Escape key (cancel)
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeAlert(overlay.querySelector('.custom-alert-btn.secondary'), false);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    });
}

// Close Alert
function closeAlert(btn, result) {
    const overlay = btn.closest('.custom-alert-overlay');
    overlay.classList.remove('show');

    setTimeout(() => {
        if (overlay._resolve) {
            overlay._resolve(result);
        }
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }, 300);
}

// Override native alert, confirm functions
window.alert = function (message) {
    return showAlert(message, 'info');
};

window.confirm = function (message) {
    return showConfirm(message);
};

// Custom success, error, warning functions
window.showSuccess = function (message, title) {
    return showAlert(message, 'success', title);
};

window.showError = function (message, title) {
    return showAlert(message, 'error', title);
};

window.showWarning = function (message, title) {
    return showAlert(message, 'warning', title);
};

window.showInfo = function (message, title) {
    return showAlert(message, 'info', title);
};

// Toast functions
window.toastSuccess = function (message) {
    showToast(message, 'success');
};

window.toastError = function (message) {
    showToast(message, 'error');
};

window.toastWarning = function (message) {
    showToast(message, 'warning');
};

window.toastInfo = function (message) {
    showToast(message, 'info');
};