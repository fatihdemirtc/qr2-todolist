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
                        callback: function(value) {
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