// Feedback related functions
function showFeedback() {
    hideAllScreens();
    document.getElementById('feedbackScreen').classList.add('active');
    
    // Update sidebar active state
    updateSidebarActiveState('feedback');
    
    // Initialize feedback display
    initializeFeedbackDisplay();
}

function showAdminFeedback() {
    hideAllScreens();
    document.getElementById('adminFeedbackScreen').classList.add('active');
    
    // Update sidebar active state
    updateSidebarActiveState('admin-feedback');
}


function initializeFeedbackDisplay() {
    const formSection = document.getElementById('feedbackFormSection');
    const historySection = document.getElementById('feedbackHistorySection');
    const tableBody = document.getElementById('feedbackTableBody');

    fetch('/Feedback/GetFeedbacks')
        .then(response => response.ok ? response.json() : Promise.reject("Veri alınamadı"))
        .then(data => {
            if (data.length === 0) {
                formSection.style.display = 'block';
                historySection.style.display = 'none';
            } else {
                formSection.style.display = 'none';
                historySection.style.display = 'block';

                tableBody.innerHTML = '';
                data.forEach(feedback => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="feedback-content">${feedback.content}</td>
                        <td class="feedback-date">${feedback.date}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        })
        .catch(err => {
            console.error(err);
            alert("Feedback geçmişi getirilemedi.");
        });
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

function submitFeedback() {

    const form = document.getElementById("feedbackForm");
    const formData = new FormData(form); // token da dahil

    fetch("/Feedback/Submit", {
        method: "POST",
        body: formData
    })
        .then(response => response.ok ? response.json() : Promise.reject("Server Error"))
        .then(data => {
            if (data.success) {      
                // Show success message
                showSuccess(data.message);

                // Refresh the feedback display
                initializeFeedbackDisplay();
            } else {
                showWarning(data.error);
            }
        })
        .catch(err => {
            showError(err);
        });       
}

// Admin Feedback Functions
function showFeedbackDetail(user, message, date) {
    const modal = document.getElementById('feedbackDetailModal');
    document.getElementById('feedbackDetailUser').textContent = user;
    document.getElementById('feedbackDetailMessage').textContent = message;
    document.getElementById('feedbackDetailDate').textContent = date;
    modal.classList.add('show');
}

function closeFeedbackDetailModal() {
    const modal = document.getElementById('feedbackDetailModal');
    modal.classList.remove('show');
}

// Initialize feedback functionality
function initializeFeedback() {
    // Main Feedback Form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
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
        newFeedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const message = document.getElementById('newFeedbackMessage').value.trim();
            
            if (message) {
                submitFeedback(message);
                closeNewFeedbackModal();
            }
        });
    }
}