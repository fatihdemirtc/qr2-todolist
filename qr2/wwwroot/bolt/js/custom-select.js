// Custom Select functionality

// Store active custom select instances to prevent multiple initializations
window.activeCustomSelects = new Map();

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
    window.activeCustomSelects.set(modalId, {
        selectDisplay,
        selectOptions,
        displayClickHandler,
        optionsClickHandler,
        documentClickHandler
    });
}

function cleanupCustomSelect(modalId) {
    const instance = window.activeCustomSelects.get(modalId);
    if (instance) {
        // Remove event listeners
        instance.selectDisplay.removeEventListener('click', instance.displayClickHandler);
        instance.selectOptions.removeEventListener('click', instance.optionsClickHandler);
        document.removeEventListener('click', instance.documentClickHandler);

        // Reset display state
        instance.selectDisplay.classList.remove('active');
        instance.selectOptions.classList.remove('show');

        // Remove from active instances
        window.activeCustomSelects.delete(modalId);
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