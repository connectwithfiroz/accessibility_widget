/**
 * Accessibility Widget Configuration & Auto-Loader
 */
var isPageLoaded = false;
var isAllAjaxComplete = true; // Set to false if you track global AJAX requests
var isAccessabilityRendered = false;
const accessabilityBtnHtml = `<a  class="btn btn-outline-primary">Try Accessability</a>`;
const CONFIGURATION_OPTIONS = {
    backgroundColor: '#1993da',
    accessabilityBtnContainer: 'accessabilityBtnSection', // Container ID
    // accessabilityBtn : 'Accessability', //pass any html or text (If you'll not pass anything then default btn will appear)
    authentication_check_api_url: 'http://localhost/accessability_widget/v3/api/index.php/authenticate' //BACKEND PROTECTION IS ACTIVATED 
};


// 1. Mark page as loaded once DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    isPageLoaded = true;
});

// 2. Main initialization function
function renderAccessabilityWidget(options = CONFIGURATION_OPTIONS) {
    // RenderAccessability is defined in accessibility.js
    if (typeof RenderAccessability === 'function') {
        let renderAccess_status = RenderAccessability(options);
        if (renderAccess_status) {
            isAccessabilityRendered = true;
        }
    } else {
        console.error("Accessibility Widget Error: RenderAccessability function not found in accessibility.js");
    }
}

// 3. Polling mechanism to wait for DOM & AJAX before rendering
function intervalFunction() {
    if (isPageLoaded && isAllAjaxComplete) {
        clearInterval(renderAccessInterval); // Stop loop
        renderAccessabilityWidget(CONFIGURATION_OPTIONS);          // Initialize widget
    }
}

let renderAccessInterval = setInterval(intervalFunction, 300);
cleanupConfigScripts();               // Clean up script tags for security