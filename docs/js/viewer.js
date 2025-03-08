/**
 * Static Sidebar Dashboard
 * 
 * A minimal implementation for GitHub Pages that:
 * 1. Renders markdown sidebar
 * 2. Opens all links in positioned windows
 * 
 * Dependencies:
 * - marked.js: For Markdown rendering
 * 
 * @module viewer
 */

// Configure marked for secure rendering
marked.setOptions({
    headerIds: false,
    mangle: false
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
    document.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (!link) return;
        
        e.preventDefault();
        openWindow(link.href, link.textContent.trim());
    });
}

/**
 * Open links in positioned windows
 * @param {string} url - URL to open
 * @param {string} title - Window title
 */
function openWindow(url, title) {
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
    
    window.open(url, title, features);
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', initDashboard);
