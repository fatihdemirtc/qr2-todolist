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

    const form = document.getElementById("feedbackForm");
    const formData = new FormData(form); // token da dahil

    fetch("/Feedback/Submit", {
        method: "POST",
        body: formData
    })
        .then(response => response.ok ? response.json() : Promise.reject("Sunucu hatas�"))
        .then(data => {
            if (data.success) {
                closeSocialMediaModal();
            } else {
                alert("Error: " + data.error);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Couldnt send");
        });       


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