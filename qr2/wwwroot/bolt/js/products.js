

// Products related functions
function showProductList() {
    hideAllScreens();
    document.getElementById('productListScreen').classList.add('active');
    
    // Update sidebar active state
    updateSidebarActiveState('products');
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
        },
        'Wireless Headphones': {
            platform: 'youtube',
            icon: 'fab fa-youtube',
            color: '#ff0000',
            url: 'https://youtube.com/wireless_headphones'
        },
        'Coffee Mug': {
            platform: 'instagram',
            icon: 'fab fa-instagram',
            color: '#e4405f',
            url: 'https://instagram.com/coffee_mug'
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

// Admin Product ADD
function initializeProducts() {
    // Products functionality is handled by click events and other functions
    // Any additional product management functionality can be added here
    const quickAddForm = document.getElementById('quickAddForm');
    if (quickAddForm) {
        const quickProductTypeField = document.getElementById('quickProductType');

        if (quickProductTypeField) {
            quickProductTypeField.addEventListener('change', function () {
                validateQuickAddForm();
            });

            quickAddForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const productType = quickProductTypeField.value;

                // Final validation check
                if (!productType) {
                    showError('Please select a product type.', 'Product Type Required');
                    return;
                }

                const form = document.getElementById("quickAddForm");
                const formData = new FormData(form); // token da dahil

                fetch("/AdminProduct/Add", {
                    method: "POST",
                    body: formData
                })
                    .then(response => response.ok ? response.json() : Promise.reject("Sunucu hatas�"))
                    .then(data => {
                        if (data.success) {
                            showSuccess(data.message);
                            // Close modal
                            setTimeout(() => {
                                closeQuickAddModal();
                            }, 1500);
                        } else {
                            toastError(data.message);
                        }
                    })
                    .catch(err => {
                        toastError(err);
                    });            


                // Show success message
               
                console.log('New Quick Product:', {
                    productNumber: productNumber,
                    productType: productType
                });

             
            });
        }
    }
}