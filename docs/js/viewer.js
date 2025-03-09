/**
 * Static Sidebar Dashboard
 * 
 * A minimal implementation for GitHub Pages that:
 * 1. Renders markdown sidebar
 * 2. Opens all links in positioned windows
 * 3. Renders markdown files directly
 * 4. Auto-refreshes sidebar content
 * 5. Provides one-click publishing to GitHub Pages
 * 
 * Dependencies:
 * - marked.js: For Markdown rendering
 * 
 * @module viewer
 */

// Configure marked for secure rendering
marked.setOptions({
    headerIds: false,
    mangle: false,
    breaks: true
});

// Track the last modified time of sidebar.md
let lastSidebarModified = 0;

// GitHub Pages URL for this repository
const githubPagesUrl = 'https://jonschull.github.io/SidebarDashboard/';

/**
 * Initialize the dashboard
 * Loads and renders sidebar content
 */
async function initDashboard() {
    try {
        // Load and render sidebar
        await loadSidebar();
        
        // Load welcome content in the main area
        await loadWelcomeContent();
        
        // Setup auto-refresh for sidebar
        setInterval(checkSidebarUpdates, 2000);
    } catch (error) {
        console.error('Failed to initialize:', error);
        document.getElementById('sidebar').innerHTML = 
            '<div class="sidebar-title">Error</div>' +
            '<p>Failed to load sidebar content</p>';
    }
}

/**
 * Load and render the sidebar content
 */
async function loadSidebar() {
    try {
        // Add cache-busting parameter
        const timestamp = new Date().getTime();
        const response = await fetch('sidebar.md?t=' + timestamp);
        
        if (!response.ok) {
            throw new Error(`Failed to load sidebar: ${response.status} ${response.statusText}`);
        }
        
        // Get last modified time from headers if available
        const lastModified = response.headers.get('Last-Modified');
        if (lastModified) {
            lastSidebarModified = new Date(lastModified).getTime();
        } else {
            lastSidebarModified = timestamp;
        }
        
        const sidebarMd = await response.text();
        const html = marked.parse(sidebarMd);
        
        // Process HTML to add classes
        const processedHtml = html
            .replace(/<h1>(.*?)<\/h1>/g, '<div class="sidebar-title">$1</div>')
            .replace(/<h2>(.*?)<\/h2>/g, '<div class="section-title">$1</div>');
        
        // Add publish button at the top
        const publishButton = `
            <button class="publish-button" onclick="publishToGitHub()">Publish to GitHub Pages</button>
            <div class="publish-url">URL: ${githubPagesUrl}</div>
            <hr>
        `;
        
        document.getElementById('sidebar').innerHTML = publishButton + processedHtml;
        
        // Setup navigation
        setupNavigation();
        
        console.log('Sidebar loaded at:', new Date().toLocaleTimeString());
    } catch (error) {
        console.error('Failed to load sidebar:', error);
        throw error;
    }
}

/**
 * Load welcome content in the main content area
 */
async function loadWelcomeContent() {
    try {
        const contentArea = document.getElementById('content-area');
        
        // Show loading indicator
        contentArea.innerHTML = '<p>Loading welcome content...</p>';
        
        // Add cache-busting parameter
        const timestamp = new Date().getTime();
        const response = await fetch('welcome.md?t=' + timestamp);
        
        if (!response.ok) {
            throw new Error(`Failed to load welcome content: ${response.status} ${response.statusText}`);
        }
        
        const welcomeContent = await response.text();
        contentArea.innerHTML = marked.parse(welcomeContent);
        
        console.log('Welcome content loaded');
    } catch (error) {
        console.error('Failed to load welcome content:', error);
        document.getElementById('content-area').innerHTML = 
            '<h1>Welcome to Static Dashboard</h1>' +
            '<p>There was an error loading the welcome content. Please check the console for details.</p>';
    }
}

/**
 * Check if sidebar.md has been updated and reload if necessary
 */
async function checkSidebarUpdates() {
    try {
        // Add cache-busting parameter
        const timestamp = new Date().getTime();
        const response = await fetch('sidebar.md?t=' + timestamp, { method: 'HEAD' });
        
        if (!response.ok) {
            return;
        }
        
        // Get last modified time from headers if available
        const lastModified = response.headers.get('Last-Modified');
        if (lastModified) {
            const modifiedTime = new Date(lastModified).getTime();
            
            // If sidebar has been modified, reload it
            if (modifiedTime > lastSidebarModified) {
                console.log('Sidebar updated, reloading...');
                await loadSidebar();
            }
        }
    } catch (error) {
        console.error('Failed to check sidebar updates:', error);
    }
}

/**
 * Setup click handlers for navigation
 * All links open in positioned windows
 */
function setupNavigation() {
    document.querySelectorAll('#sidebar a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            
            const url = link.href;
            const title = link.textContent.trim();
            
            // Check if it's a markdown file
            if (url.endsWith('.md')) {
                openMarkdownInWindow(url, title);
            } else {
                openWindow(url, title);
            }
        });
    });
}

/**
 * Open markdown file in a positioned window with rendering
 * @param {string} url - URL to the markdown file
 * @param {string} title - Window title
 */
async function openMarkdownInWindow(url, title) {
    try {
        // Calculate window size and position
        const sidebar = document.getElementById('sidebar');
        const sidebarWidth = sidebar.offsetWidth;
        const windowWidth = window.screen.width - sidebarWidth - 50;
        const windowHeight = window.screen.height - 100;
        
        // Position window next to sidebar
        const features = [
            `width=${windowWidth}`,
            `height=${windowHeight}`,
            `left=${sidebarWidth + 25}`,
            `top=50`,
            'menubar=yes',
            'toolbar=yes',
            'location=yes',
            'status=yes',
            'resizable=yes'
        ].join(',');
        
        // Open new window
        const newWindow = window.open('about:blank', title, features);
        
        // Fetch the markdown content with cache busting
        const timestamp = new Date().getTime();
        const response = await fetch(url + '?t=' + timestamp);
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
        }
        const markdownContent = await response.text();
        
        // Create HTML content for the new window
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
            <meta http-equiv="Pragma" content="no-cache">
            <meta http-equiv="Expires" content="0">
            <title>${title}</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                pre {
                    background: #f8f9fa;
                    padding: 10px;
                    border-radius: 5px;
                    overflow-x: auto;
                }
                code {
                    background: #f8f9fa;
                    padding: 2px 5px;
                    border-radius: 3px;
                    font-family: monospace;
                }
                img {
                    max-width: 100%;
                    height: auto;
                }
                blockquote {
                    border-left: 4px solid #ddd;
                    padding-left: 10px;
                    color: #666;
                    margin-left: 0;
                }
                h1, h2, h3 {
                    color: #2c3e50;
                }
                a {
                    color: #007bff;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                .filename {
                    color: #6c757d;
                    font-size: 0.9em;
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <div class="filename">File: ${url.split('/').pop()}</div>
            <div id="content"></div>
            <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
            <script>
                // Configure marked
                marked.setOptions({
                    headerIds: false,
                    mangle: false,
                    breaks: true
                });
                
                // Render markdown content
                const markdownContent = ${JSON.stringify(markdownContent)};
                document.getElementById('content').innerHTML = marked.parse(markdownContent);
                
                // Handle image errors
                document.querySelectorAll('img').forEach(img => {
                    img.onerror = function() {
                        this.onerror = null;
                        this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"%3E%3Cpath fill="%23ccc" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /%3E%3C/svg%3E';
                        this.style.background = '#f8f9fa';
                        this.style.padding = '10px';
                    };
                });
            </script>
        </body>
        </html>
        `;
        
        // Write content to the new window
        newWindow.document.open();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
    } catch (error) {
        console.error('Failed to open markdown:', error);
        alert(`Failed to open markdown file: ${error.message}`);
    }
}

/**
 * Open a URL in a positioned window
 * @param {string} url - URL to open
 * @param {string} title - Window title
 */
function openWindow(url, title) {
    try {
        // Calculate window size and position
        const sidebar = document.getElementById('sidebar');
        const sidebarWidth = sidebar.offsetWidth;
        const windowWidth = window.screen.width - sidebarWidth - 50;
        const windowHeight = window.screen.height - 100;
        
        // Position window next to sidebar
        const features = [
            `width=${windowWidth}`,
            `height=${windowHeight}`,
            `left=${sidebarWidth + 25}`,
            `top=50`,
            'menubar=yes',
            'toolbar=yes',
            'location=yes',
            'status=yes',
            'resizable=yes'
        ].join(',');
        
        // Open URL in new window
        window.open(url, title, features);
    } catch (error) {
        console.error('Failed to open window:', error);
        alert(`Failed to open window: ${error.message}`);
    }
}

/**
 * Publish changes to GitHub Pages
 * Executes a git add, commit, and push operation
 */
function publishToGitHub() {
    // Show confirmation dialog
    if (!confirm('Are you sure you want to publish to GitHub Pages?\n\nThis will push all changes to the repository.')) {
        return;
    }
    
    // Create a popup window to show the publishing process
    const publishWindow = window.open('', 'Publishing to GitHub Pages', 'width=600,height=400,resizable=yes');
    publishWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Publishing to GitHub Pages</title>
            <style>
                body {
                    font-family: monospace;
                    padding: 20px;
                    background: #f8f9fa;
                }
                h2 {
                    color: #2c3e50;
                }
                #output {
                    background: #000;
                    color: #fff;
                    padding: 15px;
                    border-radius: 5px;
                    height: 250px;
                    overflow-y: auto;
                    white-space: pre-wrap;
                }
                .success {
                    color: #28a745;
                    font-weight: bold;
                }
                .error {
                    color: #dc3545;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h2>Publishing to GitHub Pages</h2>
            <div id="output">Starting publish process...</div>
        </body>
        </html>
    `);
    
    // Function to update the output in the popup window
    const updateOutput = (message, isError = false, isSuccess = false) => {
        const outputDiv = publishWindow.document.getElementById('output');
        const messageClass = isError ? 'error' : (isSuccess ? 'success' : '');
        
        if (messageClass) {
            outputDiv.innerHTML += `<div class="${messageClass}">${message}</div>`;
        } else {
            outputDiv.innerHTML += message + '\n';
        }
        
        // Scroll to bottom
        outputDiv.scrollTop = outputDiv.scrollHeight;
    };
    
    // Call the server endpoint to trigger the publish script
    updateOutput('Connecting to server...');
    
    fetch('/publish')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show the full output
                updateOutput(data.output);
                updateOutput('Publishing complete! Your changes are now live at:', false, true);
                updateOutput(githubPagesUrl, false, true);
                updateOutput('\nNote: It may take a few minutes for changes to appear on GitHub Pages.', false, true);
            } else {
                // Show error
                updateOutput('Error during publishing:', true);
                updateOutput(data.error || 'Unknown error', true);
            }
        })
        .catch(error => {
            updateOutput('Failed to connect to server:', true);
            updateOutput(error.message, true);
        });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initDashboard);
