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

function showAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.classList.add('show');
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.classList.remove('show');
    document.getElementById('addProductForm').reset();
}

function showSocialMediaModal(productNumber) {
    const modal = document.getElementById('socialMediaModal');
    const productDisplay = document.getElementById('productNumberDisplay');
    productDisplay.textContent = `Product: ${productNumber}`;
    modal.classList.add('show');
}

function closeSocialMediaModal() {
    const modal = document.getElementById('socialMediaModal');
    modal.classList.remove('show');
    // Clear all input fields
    const inputs = modal.querySelectorAll('input[type="url"]');
    inputs.forEach(input => input.value = '');
}


document.getElementById("addProductForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const form = document.getElementById("addProductForm");
    const formData = new FormData(form); // token da dahil
    const productNumber = document.getElementById('productNumber').value;

    fetch("/Home/Add", {
        method: "POST",
        body: formData
    })
        .then(response => response.ok ? response.json() : Promise.reject("Sunucu hatasý"))
        .then(data => {
            if (data.success) {
                closeAddProductModal();
                showSocialMediaModal(productNumber);
            } else {
                alert("Hata: " + data.error);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Ýþlem baþarýsýz.");
        });
});

document.getElementById("submitSocialMedia")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const allInputs = document.getElementById("submitSocialMedia").querySelectorAll(".social-media-links input[type='url']");
    const formData = new FormData(document.getElementById("submitSocialMedia"));

    let found = false;
    allInputs.forEach(input => {
        if (input.value.trim() !== "") {
            const platform = input.name;
            const url = input.value.trim();
            formData.append("QrContext", url);
            found = true;
        }
    });

    if (!found) {
        alert("Lütfen bir sosyal medya baðlantýsý girin.");
        return;
    }

    // productNo'yu da ekle (formun içindeki hidden input'tan alýnýr)
    const productNo = document.getElementById("productNumberDisplay").textContent.replace("Product: ", "")
    formData.append("ProductNo", productNo);

    fetch("/Home/Edit", {
        method: "POST",
        body: formData
    })
        .then(res => res.ok ? res.json() : Promise.reject("Sunucu hatasý"))
        .then(data => {
            if (data.success) {
                // Modalý kapat ve formu temizle
                closeSocialMediaModal();
                location.reload();
            } else {
                alert("Hata: " + data.error);
            }
        })
        .catch(err => {
            console.error(err);
            alert("Bir hata oluþtu.");
        });
});


//JavaScript ile input olayýna dinleyici ekleyip diðerlerini temizlemek
document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll(".social-media-links input[type='url']");

    inputs.forEach(input => {
        input.addEventListener("input", function () {
            if (this.value.trim() !== "") {
                // Diðer tüm inputlarý temizle
                inputs.forEach(otherInput => {
                    if (otherInput !== this) {
                        otherInput.value = "";
                    }
                });
            }
        });
    });
});

function goToDetail(productNo) {
    window.location.href = `/home/detail?id=${productNo}`;
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

