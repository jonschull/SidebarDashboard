/**
 * Sidebar Dashboard JavaScript
 * 
 * This script handles the sidebar interactions and controls external browser windows.
 * It automatically applies event handlers to links based on their attributes.
 */

// Initialize the sidebar when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
});

/**
 * Initialize the sidebar functionality
 */
function initializeSidebar() {
    // DOM elements
    const contentFrame = document.getElementById('content-frame');
    const statusBar = document.getElementById('status-bar');
    const loadingIndicator = document.querySelector('.loading');
    
    // Get all links in the sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    
    // Process each link
    sidebarLinks.forEach(link => {
        // Determine if this is an external link based on href or data attribute
        const isExternal = link.hasAttribute('data-external') ? 
            (link.getAttribute('data-external') === 'true') : 
            isExternalUrl(link.href);
        
        // Set the data-external attribute if not already set
        if (!link.hasAttribute('data-external')) {
            link.setAttribute('data-external', isExternal.toString());
        }
        
        // Add click event handler
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            
            const url = this.href;
            
            if (isExternal || this.getAttribute('data-external') === 'true') {
                openExternalContent(url, this);
            } else {
                loadLocalContent(url, this);
            }
        });
    });
    
    // Set the first link as active by default
    if (sidebarLinks.length > 0) {
        const firstLink = sidebarLinks[0];
        const isFirstExternal = firstLink.getAttribute('data-external') === 'true';
        
        if (isFirstExternal) {
            openExternalContent(firstLink.href, firstLink);
        } else {
            loadLocalContent(firstLink.href, firstLink);
        }
    }
    
    /**
     * Check if a URL is external
     * 
     * @param {string} url - The URL to check
     * @returns {boolean} - True if the URL is external, false otherwise
     */
    function isExternalUrl(url) {
        // Create an anchor element to parse the URL
        const anchor = document.createElement('a');
        anchor.href = url;
        
        // Compare the URL's hostname with the current hostname
        return anchor.hostname !== window.location.hostname && 
               anchor.hostname !== '';
    }
    
    /**
     * Set the active navigation item
     * 
     * @param {HTMLElement} element - The element to set as active
     */
    function setActive(element) {
        // Remove active class from all links
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            link.classList.remove('external-active');
        });
        
        // Add appropriate active class
        if (element.getAttribute('data-external') === 'true') {
            element.classList.add('external-active');
        } else {
            element.classList.add('active');
        }
    }
    
    /**
     * Load local content in the iframe
     * 
     * @param {string} url - The URL to load
     * @param {HTMLElement} element - The navigation item that was clicked
     */
    function loadLocalContent(url, element) {
        contentFrame.src = url;
        setActive(element);
        statusBar.textContent = 'Loaded: ' + element.textContent;
    }
    
    /**
     * Open an external URL in a positioned browser window
     * 
     * @param {string} url - The URL to open
     * @param {HTMLElement} element - The navigation item that was clicked
     */
    function openExternalContent(url, element) {
        setActive(element);
        statusBar.textContent = 'Opening: ' + element.textContent;
        loadingIndicator.style.display = 'block';
        
        // Calculate window position and size
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const sidebarWidth = 250; // Width of the sidebar
        const windowWidth = screenWidth - sidebarWidth - 50; // Leave some margin
        const windowHeight = screenHeight - 100; // Leave some margin
        const windowLeft = sidebarWidth + 50; // Position to the right of sidebar
        const windowTop = 50; // Position from top
        
        // Open a new window with specific position and size
        const newWindow = window.open(
            url, 
            element.textContent,
            `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop},menubar=yes,toolbar=yes,location=yes,status=yes,resizable=yes`
        );
        
        if (newWindow) {
            // Window opened successfully
            statusBar.textContent = 'Opened: ' + element.textContent;
            
            // Also send request to server to update current window info
            fetch('/open_url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: url,
                    title: element.textContent
                })
            })
            .then(response => response.json())
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            // Window could not be opened (likely blocked by popup blocker)
            statusBar.textContent = 'Error: Popup blocked. Please allow popups for this site.';
        }
        
        loadingIndicator.style.display = 'none';
    }
}
