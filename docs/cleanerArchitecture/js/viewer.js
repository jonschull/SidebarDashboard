/**
 * Static Sidebar Dashboard
 * 
 * A minimal implementation for GitHub Pages that:
 * 1. Renders markdown sidebar
 * 2. Opens all links in positioned windows
 * 3. Renders markdown files directly
 * 4. Provides one-click publishing to GitHub Pages
 */

// Configure marked for secure rendering
marked.setOptions({
    headerIds: false,
    mangle: false,
    breaks: true
});

// Track the last modified time of sidebar.md
let lastSidebarModified = 0;

// Track the current content file and its last modified time
let currentContentFile = 'welcome.md';
let lastContentModified = 0;

// Get dashboard configuration
const githubUsername = window.DASHBOARD_CONFIG ? window.DASHBOARD_CONFIG.githubUsername : 'jonschull';
const githubRepo = window.DASHBOARD_CONFIG ? window.DASHBOARD_CONFIG.githubRepo : 'SidebarDashboard';
const githubPagesUrl = window.DASHBOARD_CONFIG ? window.DASHBOARD_CONFIG.githubPagesUrl : `https://${githubUsername}.github.io/${githubRepo}/`;
const githubStatusUrl = window.DASHBOARD_CONFIG ? window.DASHBOARD_CONFIG.githubStatusUrl : `https://github.com/${githubUsername}/${githubRepo}/actions`;
const publishStatus = window.DASHBOARD_CONFIG ? window.DASHBOARD_CONFIG.publishStatus : 'published';

/**
 * Initialize the dashboard
 */
async function initDashboard() {
    try {
        // Load and render sidebar
        await loadSidebar();
        
        // Load welcome content
        await loadContent('welcome.md');
        
        // Setup auto-refresh
        setInterval(checkSidebarUpdates, 2000);
        setInterval(checkContentUpdates, 2000);
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
        
        // Get last modified time
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
        const publishButton = publishStatus === 'published' 
            ? `<button class="publish-button" onclick="publishToGitHub()">Update Dashboard</button>`
            : `<button class="publish-button" onclick="publishToGitHub()">Publish Dashboard</button>`;
            
        const publishInfo = `
            <div class="publish-url">URL: <a href="${githubPagesUrl}" target="_blank">${githubPagesUrl}</a></div>
            <div class="status-link"><a href="${githubStatusUrl}" target="_blank">Check Status</a></div>
            <hr>
        `;
        
        document.getElementById('sidebar').innerHTML = publishButton + publishInfo + processedHtml;
        
        // Setup navigation
        setupNavigation();
        
    } catch (error) {
        console.error('Failed to load sidebar:', error);
        throw error;
    }
}

/**
 * Load content in the main content area
 */
async function loadContent(contentFile) {
    try {
        const contentArea = document.getElementById('content-area');
        currentContentFile = contentFile;
        
        // Add cache-busting parameter
        const timestamp = new Date().getTime();
        const response = await fetch(currentContentFile + '?t=' + timestamp);
        
        if (!response.ok) {
            throw new Error(`Failed to load content: ${response.status} ${response.statusText}`);
        }
        
        // Get last modified time
        const lastModified = response.headers.get('Last-Modified');
        if (lastModified) {
            lastContentModified = new Date(lastModified).getTime();
        } else {
            lastContentModified = timestamp;
        }
        
        const markdown = await response.text();
        contentArea.innerHTML = marked.parse(markdown);
        
    } catch (error) {
        console.error(`Failed to load ${contentFile}:`, error);
        contentArea.innerHTML = `<h1>Error</h1><p>Failed to load ${contentFile}</p>`;
    }
}

/**
 * Check if sidebar needs updating
 */
async function checkSidebarUpdates() {
    try {
        const response = await fetch('sidebar.md', { method: 'HEAD' });
        const lastModified = response.headers.get('Last-Modified');
        if (lastModified) {
            const modifiedTime = new Date(lastModified).getTime();
            if (modifiedTime > lastSidebarModified) {
                await loadSidebar();
            }
        }
    } catch (error) {
        console.error('Failed to check sidebar updates:', error);
    }
}

/**
 * Check if content needs updating
 */
async function checkContentUpdates() {
    try {
        const response = await fetch(currentContentFile, { method: 'HEAD' });
        const lastModified = response.headers.get('Last-Modified');
        if (lastModified) {
            const modifiedTime = new Date(lastModified).getTime();
            if (modifiedTime > lastContentModified) {
                await loadContent(currentContentFile);
            }
        }
    } catch (error) {
        console.error('Failed to check content updates:', error);
    }
}

/**
 * Setup navigation click handlers
 */
function setupNavigation() {
    const links = document.querySelectorAll('#sidebar a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href.endsWith('.md')) {
                loadContent(href);
            } else {
                window.location.href = href;
            }
        });
    });
}

/**
 * Publish dashboard to GitHub Pages
 */
function publishToGitHub() {
    // Confirmation message
    const publishStatus = window.DASHBOARD_CONFIG.publishStatus;
    const confirmMessage = publishStatus === 'unpublished' 
        ? 'This will be the FIRST PUBLICATION of this dashboard to GitHub Pages.\n\nAre you sure you want to proceed?'
        : 'Are you sure you want to update this dashboard on GitHub Pages?';
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    // Create publish window
    const publishWindow = window.open('', 'Publishing to GitHub Pages', 'width=600,height=400');
    publishWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Publishing to GitHub Pages</title>
            <style>
                body { font-family: monospace; padding: 20px; background: #f8f9fa; }
                h2 { color: #2c3e50; }
                #output {
                    background: #000;
                    color: #fff;
                    padding: 15px;
                    border-radius: 5px;
                    height: 250px;
                    overflow-y: auto;
                    white-space: pre-wrap;
                }
                .success { color: #28a745; }
                .error { color: #dc3545; }
            </style>
        </head>
        <body>
            <h2>Publishing to GitHub Pages</h2>
            <div id="output">Running publish process...</div>
        </body>
        </html>
    `);
    
    // Update output
    const updateOutput = (text, isError = false) => {
        const output = publishWindow.document.getElementById('output');
        const div = publishWindow.document.createElement('div');
        div.textContent = text;
        if (isError) div.className = 'error';
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
    };
    
    // Run publish script using the new approach
    const dashboardName = window.DASHBOARD_CONFIG.name;
    const githubPagesUrl = window.DASHBOARD_CONFIG.githubPagesUrl;
    
    // Use a direct API endpoint for publishing to avoid browser caching issues
    fetch(`/api/publish/${dashboardName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(result => {
            // Display the output from the publish process
            updateOutput(result.output);
            
            // Check if publishing was successful
            if (result.success) {
                updateOutput('\nDashboard published successfully!', false);
                updateOutput(`\nView at: ${githubPagesUrl}`, false);
            } else if (result.error) {
                updateOutput(`\nError: ${result.error}`, true);
            }
        })
        .catch(error => {
            updateOutput('\nError: Failed to publish dashboard', true);
            updateOutput('\nMake sure the server is running with: ./start_server.sh', true);
            console.error('Publish error:', error);
        });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initDashboard);
