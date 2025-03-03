/**
 * Sidebar Dashboard JavaScript
 * 
 * This script handles the sidebar interactions and controls external browser windows.
 * It automatically processes links in the sidebar, applying the appropriate behavior
 * based on whether they are local or external links.
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const sidebar = document.querySelector('.sidebar');
    const contentFrame = document.getElementById('content-frame');
    const statusBar = document.getElementById('status-bar');
    const loadingIndicator = document.querySelector('.loading');
    
    /**
     * Set the active navigation item
     * 
     * @param {HTMLElement} element - The element to set as active
     */
    function setActive(element) {
        // Remove active class from all items
        const allLinks = sidebar.querySelectorAll('a');
        allLinks.forEach(link => {
            link.classList.remove('active');
            link.classList.remove('external-active');
        });
        
        // Add appropriate active class
        if (element.dataset.external === "true") {
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
        return false; // Prevent default link behavior
    }
    
    /**
     * Handle link clicks in the sidebar
     * 
     * This function is called when any link in the sidebar is clicked.
     * It determines whether the link is local or external and calls
     * the appropriate function to handle it.
     * 
     * @param {Event} event - The click event
     */
    function handleLinkClick(event) {
        // Check if the clicked element is a link
        if (event.target.tagName === 'A') {
            event.preventDefault();
            
            const link = event.target;
            const url = link.getAttribute('href');
            const isExternal = link.dataset.external === "true";
            
            if (isExternal) {
                openExternalContent(url, link);
            } else {
                loadLocalContent(url, link);
            }
        }
    }
    
    // Add click event listener to the sidebar
    sidebar.addEventListener('click', handleLinkClick);
    
    /**
     * Refresh the sidebar content
     * 
     * This function fetches the latest sidebar content from the server
     * and updates the sidebar HTML while preserving the currently active link.
     */
    function refreshSidebar() {
        // Store the currently active link URL and whether it's external
        let activeLink = sidebar.querySelector('a.active') || sidebar.querySelector('a.external-active');
        let activeUrl = activeLink ? activeLink.getAttribute('href') : null;
        let isActiveExternal = activeLink ? activeLink.dataset.external === "true" : false;
        
        fetch('/refresh_sidebar')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Update the sidebar content
                    const sidebarContent = document.querySelector('.sidebar');
                    
                    // Preserve the loading and status bar elements
                    const loadingElement = sidebarContent.querySelector('.loading');
                    const statusBarElement = sidebarContent.querySelector('.status-bar');
                    
                    // Replace the content
                    sidebarContent.innerHTML = data.content;
                    
                    // Add back the loading and status bar elements
                    sidebarContent.appendChild(loadingElement);
                    sidebarContent.appendChild(statusBarElement);
                    
                    // Restore the active link if it exists in the new content
                    if (activeUrl) {
                        const newLinks = sidebarContent.querySelectorAll('a');
                        let foundActiveLink = false;
                        
                        newLinks.forEach(link => {
                            if (link.getAttribute('href') === activeUrl) {
                                foundActiveLink = true;
                                if (isActiveExternal) {
                                    link.classList.add('external-active');
                                } else {
                                    link.classList.add('active');
                                }
                            }
                        });
                        
                        // If we didn't find the active link, don't change the content frame
                        if (!foundActiveLink && !isActiveExternal) {
                            // Only set the first link as active if we couldn't find the previously active link
                            const firstLink = sidebarContent.querySelector('a:not([data-external="true"])');
                            if (firstLink) {
                                firstLink.classList.add('active');
                                contentFrame.src = firstLink.getAttribute('href');
                            }
                        }
                    } else {
                        // Set the first link as active if none were active before
                        const firstLink = sidebarContent.querySelector('a:not([data-external="true"])');
                        if (firstLink) {
                            firstLink.classList.add('active');
                            contentFrame.src = firstLink.getAttribute('href');
                        }
                    }
                }
            })
            .catch(error => {
                console.error('Error refreshing sidebar:', error);
            });
    }
    
    // Set an interval to refresh the sidebar content (every 5 seconds)
    setInterval(refreshSidebar, 5000);
    
    // Initialize with the first link active
    const firstLink = sidebar.querySelector('a');
    if (firstLink) {
        if (firstLink.dataset.external !== "true") {
            loadLocalContent(firstLink.getAttribute('href'), firstLink);
        } else {
            // If the first link is external, find the first non-external link
            const firstLocalLink = sidebar.querySelector('a:not([data-external="true"])');
            if (firstLocalLink) {
                loadLocalContent(firstLocalLink.getAttribute('href'), firstLocalLink);
            }
        }
    }
});
