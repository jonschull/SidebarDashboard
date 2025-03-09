/**
 * Static Sidebar Dashboard
 * 
 * A minimal implementation for GitHub Pages that:
 * 1. Renders markdown sidebar
 * 2. Opens all links in positioned windows
 * 3. Renders markdown files directly
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

/**
 * Initialize the dashboard
 * Loads and renders sidebar content
 */
async function initDashboard() {
    try {
        // Load and render sidebar
        const sidebarMd = await fetch('sidebar.md').then(r => r.text());
        const html = marked.parse(sidebarMd);
        
        // Process HTML to add classes
        const processedHtml = html
            .replace(/<h1>(.*?)<\/h1>/g, '<div class="sidebar-title">$1</div>')
            .replace(/<h2>(.*?)<\/h2>/g, '<div class="section-title">$1</div>');
            
        document.getElementById('sidebar').innerHTML = processedHtml;
        
        // Setup navigation
        setupNavigation();
    } catch (error) {
        console.error('Failed to initialize:', error);
        document.getElementById('sidebar').innerHTML = 
            '<div class="sidebar-title">Error</div>' +
            '<p>Failed to load sidebar content</p>';
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initDashboard);
