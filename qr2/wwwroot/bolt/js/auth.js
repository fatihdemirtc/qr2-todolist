// Authentication related functions
function showLogin() {
    hideAllScreens();
    document.getElementById('loginScreen').classList.add('active');
}

function showRegister() {
    hideAllScreens();
    document.getElementById('registerScreen').classList.add('active');
}

// Initialize authentication forms
function initializeAuthForms() {
    // Login Form
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
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
        registerForm.addEventListener('submit', function(e) {
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
}