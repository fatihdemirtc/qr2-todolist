function showQuickAddModal() {
    const modal = document.getElementById('quickAddModal');
    modal.classList.add('show');

    // Reset form when opening modal
    resetQuickAddForm();
}

function closeQuickAddModal() {
    const modal = document.getElementById('quickAddModal');
    modal.classList.remove('show');
    resetQuickAddForm();
}

function resetQuickAddForm() {
    const form = document.getElementById('quickAddForm');
    const submitBtn = document.getElementById('quickAddSubmitBtn');
    const productTypeField = document.getElementById('quickProductType');

    if (form) form.reset();
    if (submitBtn) submitBtn.disabled = true;
    if (productTypeField) {
        productTypeField.classList.remove('invalid', 'valid');
        productTypeField.value = '';
    }
}
function validateQuickAddForm() {
    const submitBtn = document.getElementById('quickAddSubmitBtn');
    const productTypeField = document.getElementById('quickProductType');

    if (!submitBtn || !productTypeField) return;

    const isFormValid = productTypeField.value !== '';
    submitBtn.disabled = !isFormValid;
}

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

    if (form) form.reset();
    if (submitBtn) submitBtn.disabled = true;

    // Check if we're on dashboard (8-character validation) or product-list (name/category validation)
    const productNumberField = document.getElementById('productNumber');
    const productPasswordField = document.getElementById('productPassword');
    const productNameField = document.getElementById('productName');
    const productCategoryField = document.getElementById('productCategory');

    if (productNumberField && productPasswordField) {
        // Dashboard version - 8 character validation
        const productNumberValidation = document.getElementById('productNumberValidation');
        const productPasswordValidation = document.getElementById('productPasswordValidation');

        if (productNumberValidation) productNumberValidation.textContent = '';
        if (productPasswordValidation) productPasswordValidation.textContent = '';

        productNumberField.classList.remove('invalid', 'valid');
        productPasswordField.classList.remove('invalid', 'valid');
        productNumberField.value = '';
        productPasswordField.value = '';
    } else if (productNameField && productCategoryField) {
        // Product-list version - name/category validation
        const productNameValidation = document.getElementById('productNameValidation');
        const productCategoryValidation = document.getElementById('productCategoryValidation');

        if (productNameValidation) productNameValidation.textContent = '';
        if (productCategoryValidation) productCategoryValidation.textContent = '';

        productNameField.classList.remove('invalid', 'valid');
        productCategoryField.classList.remove('invalid', 'valid');
    }
}

// Real-time validation for Add Product form
function validateAddProductField(fieldId, validationId) {
    const field = document.getElementById(fieldId);
    const validation = document.getElementById(validationId);

    if (!field || !validation) return;

    const value = field.value.trim();
    let isValid = false;

    // Update field styling
    field.classList.remove('invalid', 'valid');

    if (fieldId === 'productNumber' || fieldId === 'productPassword') {
        // Sadece rakam kontrolü
        const isNumeric = /^\d*$/.test(value);

        // 8 karakter ve sadece rakam kontrolü
        isValid = isNumeric && value.length === 8;

        if (value.length > 0) {
            field.classList.add(isValid ? 'valid' : 'invalid');
        }

        // Update validation message
        if (!isNumeric) {
            validation.textContent = 'Only numbers are allowed';
        } else if (value.length === 0) {
            validation.textContent = '';
        } else if (value.length < 8) {
            validation.textContent = `Must be exactly 8 digits (${value.length}/8)`;
        } else {
            validation.textContent = '';
        }    
    } else if (fieldId === 'productName') {
        // Product-list version - name validation
        isValid = value.length >= 3;
        if (value.length > 0) {
            field.classList.add(isValid ? 'valid' : 'invalid');
        }

        // Update validation message
        if (value.length === 0) {
            validation.textContent = '';
        } else if (value.length < 3) {
            validation.textContent = 'Product name must be at least 3 characters long';
        } else {
            validation.textContent = '';
        }
    } else if (fieldId === 'productCategory') {
        // Product-list version - category validation
        isValid = value !== '';
        if (value !== '') {
            field.classList.add('valid');
        }

        // Update validation message
        if (value === '') {
            validation.textContent = '';
        } else {
            validation.textContent = '';
        }
    }

    // Check if form is valid
    validateAddProductForm();
}

function validateAddProductForm() {
    const submitBtn = document.getElementById('addProductSubmitBtn');
    if (!submitBtn) return;

    // Check if we're on dashboard or product-list
    const productNumberField = document.getElementById('productNumber');
    const productPasswordField = document.getElementById('productPassword');
    const productNameField = document.getElementById('productName');
    const productCategoryField = document.getElementById('productCategory');

    let isFormValid = false;

    if (productNumberField && productPasswordField) {
        // Dashboard version - 8 character validation
        const isProductNumberValid = productNumberField.value.trim().length === 8;
        const isProductPasswordValid = productPasswordField.value.trim().length === 8;
        isFormValid = isProductNumberValid && isProductPasswordValid;
    } else if (productNameField && productCategoryField) {
        // Product-list version - name/category validation
        const isProductNameValid = productNameField.value.trim().length >= 3;
        const isProductCategoryValid = productCategoryField.value !== '';
        isFormValid = isProductNameValid && isProductCategoryValid;
    }

    submitBtn.disabled = !isFormValid;
}

// Social Media Modal
function showSocialMediaModal(productNo) {
    const modal = document.getElementById('socialMediaModal');
    const productDisplay = document.getElementById('productNumberDisplay');
    productDisplay.textContent = `Product: ${productNo}`;
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
        toastError('Please select a social media platform.');
        return;
    }

    if (!platformUrl.value.trim()) {
        toastError('Please enter a URL for the selected platform.');
        return;
    }




    const form = document.getElementById("addSocialMediaForm");
    const formData = new FormData(form); // token da dahil
    const productNo = document.getElementById("productNumberDisplay").textContent.replace("Product: ", "")
    formData.append("ProductNo", productNo);

    fetch("/Home/EditProduct", {
        method: "POST",
        body: formData
    })
        .then(response => response.ok ? response.json() : Promise.reject("Sunucu hatas�"))
        .then(data => {
            if (data.success) {
                closeSocialMediaModal();
                toastSuccess(response.message);               
            } else {
                toastError(data.message);
            }
        })
        .catch(err => {
            toastError(err);
        });            

    // Close modal
    
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

    const form = document.getElementById("editSocialMediaForm");
    const formData = new FormData(form); // token da dahil

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    formData.append("ProductNo", id);

    if (!platformSelect.value) {
        toastError('Please select a social media platform.');
        return;
    }

    if (!platformUrl.value.trim()) {
        toastError('Please enter a URL for the selected platform.');
        return;
    }

    fetch("/Home/EditProduct", {
            method: "POST",
            body: formData
        })
        .then(response => response.ok ? response.json() : Promise.reject("Sunucu hatas�"))
        .then(data => {
            closeEditSocialModal();  
            if (data.success) {
                // Close modal
                toastSuccess(data.message);                     
               
            } else {
                toastError("Hata: " + data.message);               
            }
        })
        .catch(err => {
            toastError(err);
            closeEditSocialModal();
        });   
    location.reload(); 
}

// Initialize modal functionality
function initializeModals() {
    // Add Product Form with Real-time Validation
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        // Check if we're on dashboard or product-list
        const productNumberField = document.getElementById('productNumber');
        const productPasswordField = document.getElementById('productPassword');
        const productNameField = document.getElementById('productName');
        const productCategoryField = document.getElementById('productCategory');

        if (productNumberField && productPasswordField) {
            // Dashboard version - 8 character validation

            // Remove any existing event listeners first
            const newProductNumberField = productNumberField.cloneNode(true);
            const newProductPasswordField = productPasswordField.cloneNode(true);
            productNumberField.parentNode.replaceChild(newProductNumberField, productNumberField);
            productPasswordField.parentNode.replaceChild(newProductPasswordField, productPasswordField);

            // Add fresh event listeners
            newProductNumberField.addEventListener('input', function () {
                validateAddProductField('productNumber', 'productNumberValidation');
            });

            newProductPasswordField.addEventListener('input', function () {
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

                const form = document.getElementById("addProductForm");
                const formData = new FormData(form); // token da dahil

                fetch("/Home/Add", {
                    method: "POST",
                    body: formData
                })
                    .then(response => response.ok ? response.json() : Promise.reject("Server Error"))
                    .then(data => {
                        if (data.success) {
                            // Close add product modal
                            closeAddProductModal();

                            // Show social media modal
                            showSocialMediaModal(productNumber);
                        } else {
                            showInfo(data.error);
                            closeAddProductModal();
                        }
                    })
                    .catch(err => {
                        console.error(err);
                       /* alert("İşlem başarısız.");*/
                        showError(err);
                    });


            });
        } else if (productNameField && productCategoryField) {
            // Product-list version - name/category validation
            productNameField.addEventListener('input', function () {
                validateAddProductField('productName', 'productNameValidation');
            });

            productCategoryField.addEventListener('change', function () {
                validateAddProductField('productCategory', 'productCategoryValidation');
            });

            addProductForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const productName = productNameField.value.trim();
                const productCategory = productCategoryField.value;

                // Final validation check
                if (productName.length < 3) {
                    alert('Product name must be at least 3 characters long.');
                    return;
                }

                if (!productCategory) {
                    alert('Please select a product category.');
                    return;
                }

                // Generate a random product number
                const productNumber = 'PRD' + String(Math.floor(Math.random() * 9000) + 1000);

                // Show success message
                alert(`Product "${productName}" has been added successfully with product number: ${productNumber}`);
                console.log('New Product:', {
                    productNumber: productNumber,
                    productName: productName,
                    productCategory: productCategory
                });

                // Close modal
                closeAddProductModal();
            });
        }
    }
}