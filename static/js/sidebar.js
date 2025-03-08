/**
 * Sidebar Dashboard JavaScript
 * 
 * This script handles the sidebar interactions and controls external browser windows.
 * It automatically processes links in the sidebar, applying the appropriate behavior
 * based on whether they are local or external links.
 * 
 * Key features:
 * - Handles local content loading in the iframe
 * - Opens external links in new browser windows
 * - Updates the URL bar to reflect the current content
 * - Refreshes the sidebar content automatically
 * - Preserves the active link during sidebar updates
 * 
 * @author Codeium
 * @license MIT
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
     * This function updates the active state of navigation items in the sidebar.
     * It removes the active class from all items and adds it to the specified element.
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
     * This function loads local content in the iframe and updates the URL bar.
     * It uses absolute URLs to prevent path accumulation issues.
     * 
     * @param {string} url - The URL to load
     * @param {HTMLElement} element - The navigation item that was clicked
     */
    function loadLocalContent(url, element) {
        // Create an absolute URL to prevent path accumulation
        const absoluteUrl = new URL(url, window.location.origin).href;
        
        // Store the URL in a data attribute to ensure we use the same URL on refresh
        element.dataset.loadedUrl = absoluteUrl;
        
        // Set the iframe source to the absolute URL
        contentFrame.src = absoluteUrl;
        setActive(element);
        statusBar.textContent = 'Loaded: ' + element.textContent;
        
        // Update the URL bar to reflect the current content
        // This doesn't reload the page, just updates the URL displayed
        window.history.pushState({}, element.textContent, absoluteUrl);
    }
    
    /**
     * Open an external URL in a positioned browser window
     * 
     * This function opens an external URL in a new browser window positioned
     * to the right of the sidebar. It also updates the status bar and shows
     * a loading indicator.
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
            
            // Hide loading indicator after a short delay
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
            }, 1000);
        } else {
            // Window failed to open (likely blocked by popup blocker)
            statusBar.textContent = 'Error: Popup blocked. Please allow popups for this site.';
            loadingIndicator.style.display = 'none';
        }
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
     * It uses absolute URLs for consistent comparison and loading.
     */
    function refreshSidebar() {
        // Store the currently active link URL and whether it's external
        let activeLink = sidebar.querySelector('a.active') || sidebar.querySelector('a.external-active');
        let activeUrl = null;
        let isActiveExternal = false;
        
        if (activeLink) {
            // Prefer the stored loaded URL if available (prevents URL transformation issues)
            activeUrl = activeLink.dataset.loadedUrl || activeLink.getAttribute('href');
            isActiveExternal = activeLink.dataset.external === "true";
        }
        
        // If we have an active URL, make sure it's absolute
        if (activeUrl && !activeUrl.startsWith('http')) {
            activeUrl = new URL(activeUrl, window.location.origin).href;
        }
        
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
                            // Get the absolute URL for comparison
                            const linkUrl = new URL(link.getAttribute('href'), window.location.origin).href;
                            
                            if (linkUrl === activeUrl) {
                                foundActiveLink = true;
                                // Store the original loaded URL to maintain consistency
                                link.dataset.loadedUrl = activeUrl;
                                
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
                                // Use absolute URL for the content frame
                                const firstLinkUrl = new URL(firstLink.getAttribute('href'), window.location.origin).href;
                                firstLink.dataset.loadedUrl = firstLinkUrl;
                                contentFrame.src = firstLinkUrl;
                            }
                        }
                    } else {
                        // Set the first link as active if none were active before
                        const firstLink = sidebarContent.querySelector('a:not([data-external="true"])');
                        if (firstLink) {
                            firstLink.classList.add('active');
                            // Use absolute URL for the content frame
                            const firstLinkUrl = new URL(firstLink.getAttribute('href'), window.location.origin).href;
                            firstLink.dataset.loadedUrl = firstLinkUrl;
                            contentFrame.src = firstLinkUrl;
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
    const firstLink = sidebar.querySelector('a:not([data-external="true"])');
    if (firstLink) {
        firstLink.classList.add('active');
        contentFrame.src = firstLink.getAttribute('href');
    }
    
    // Handle popstate events (browser back/forward buttons)
    window.addEventListener('popstate', function(event) {
        // Get the current URL path
        const path = window.location.pathname;
        
        // Find the link in the sidebar that matches this path
        const links = sidebar.querySelectorAll('a:not([data-external="true"])');
        let found = false;
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === path) {
                loadLocalContent(href, link);
                found = true;
            }
        });
        
        // If no matching link was found, just load the path directly
        if (!found && path !== '/') {
            contentFrame.src = path;
        }
    });
});
