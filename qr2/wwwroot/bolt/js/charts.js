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
    
    const last30Days = scanData.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const viewsData = scanData.map(item => item.scanCount);
    
    viewsChart = new Chart(viewsCtx, {
        type: 'line',
        data: {
            labels: last30Days,
            datasets: [{
                label: 'Scanner',
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
                        stepSize: 1,
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
    
    const osCtx = document.getElementById('osChart').getContext('2d');

    // Enum ID'lerine karþýlýk gelen label ve renkler
    const deviceLabels = {
        1: 'Windows',
        2: 'Mac',
        3: 'Linux',
        4: 'Android',
        5: 'iOS',
        0: 'Unknown'
    };

    const deviceColors = {
        1: '#4e73df',  // Windows - mavi
        2: '#a28cd1',  // Mac - mor
        3: '#a3a3a3',  // Linux - gri
        4: '#34a853',  // Android - yeþil
        5: '#ffc658',  // iOS - sarý
        0: '#cccccc'   // Unknown - gri açýk
    };

    const labels = osData.map(item => deviceLabels[item.device] || 'Other');
    const data = osData.map(item => item.scanCount);
    const bgColors = osData.map(item => deviceColors[item.device] || '#888');
    const borderColors = bgColors.map(color => color);

    osChart = new Chart(osCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Scanner',
                data: data,
                backgroundColor: bgColors,
                borderColor: borderColors,
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
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        stepSize: 1,
                        color: '#666'
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        stepSize: 1,
                        color: '#666'
                    }
                }
            }
        }
    });

}