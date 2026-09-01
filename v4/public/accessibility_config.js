/**
 * Accessibility Widget Configuration & Auto-Loader
 */
var isPageLoaded = false;
var isAllAjaxComplete = true; // Set to false if you track global AJAX requests
var isAccessabilityRendered = false;
const accessabilityBtnHtml = `<a class="btn btn-outline-primary">Try Accessability</a>`;

const CONFIGURATION_OPTIONS = {
    backgroundColor: '#1993da',

    // [OPTIONAL] Default width is 400px. Accepts any valid CSS unit (e.g., "400px", "100vw").
    // widget_width: "400px",  

    // [OPTIONAL] Default height is max-content. Accepts any valid CSS unit (e.g., "500px", "80vh").
    // widget_height: "80vh", 

    accessabilityBtnContainer: 'accessabilityBtnSection', // Container ID where trigger button loads

    // [OPTIONAL] Pass custom text or HTML markup for the trigger button.
    // If omitted, the default trigger button will be used.
    // accessabilityBtn: accessabilityBtnHtml, 
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
            // Clean up script tags for security