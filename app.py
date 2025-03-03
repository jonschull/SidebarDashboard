"""
Sidebar Dashboard App

This Flask application serves a sidebar interface that can control external browser windows.
It provides a clean separation between the sidebar navigation and the content being viewed.

Key components:
- Flask web server to serve the sidebar interface
- JavaScript to handle sidebar interactions
- External CSS and JS files for clean separation of concerns
- Markdown-based sidebar for easy authoring
"""

from flask import Flask, render_template, request, jsonify, url_for
import webbrowser
import os
import sys
import json
import threading
import time
import markdown
import re
from urllib.parse import quote
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Create Flask app with static folder configuration
app = Flask(__name__, static_folder='static', static_url_path='/static')

# Store information about the currently open window
current_window = {
    "url": None,
    "title": None
}

# Path to the sidebar markdown file
SIDEBAR_MD_PATH = os.path.join(os.path.dirname(__file__), 'sidebar.md')

# Path to the sidebar template file
SIDEBAR_TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), 'templates', 'sidebar_template.html')

# Store the parsed sidebar HTML
sidebar_html = ""

def parse_sidebar_markdown():
    """
    Parse the sidebar markdown file and convert it to HTML.
    
    This function reads the sidebar.md file, converts it to HTML,
    and applies the necessary classes and data attributes for the sidebar.
    
    Returns:
        str: HTML content for the sidebar
    """
    global sidebar_html
    
    if not os.path.exists(SIDEBAR_MD_PATH):
        return "<div class='sidebar-title'>Dashboard</div><p>sidebar.md not found</p>"
    
    with open(SIDEBAR_MD_PATH, 'r') as f:
        md_content = f.read()
    
    # Pre-process the markdown to handle our custom external link syntax
    # Replace {: .external} with a marker we can find after conversion
    md_content = re.sub(r'\{\:\s*\.external\s*\}', '<!-- EXTERNAL_LINK -->', md_content)
    
    # Convert markdown to HTML
    html = markdown.markdown(md_content)
    
    # Process the HTML to add classes and data attributes
    # 1. Convert h1 to sidebar-title
    html = re.sub(r'<h1>(.*?)</h1>', r'<div class="sidebar-title">\1</div>', html)
    
    # 2. Add horizontal rule after each h2 except the last one
    sections = re.findall(r'<h2>.*?</h2>.*?(?=<h2>|$)', html, re.DOTALL)
    processed_html = ""
    
    for i, section in enumerate(sections):
        # Remove the h2 tag but keep its content
        section = re.sub(r'<h2>(.*?)</h2>', r'<hr>\n<div class="section-title">\1</div>', section)
        # Remove the first hr if it's the first section
        if i == 0:
            section = re.sub(r'^<hr>\n', '', section)
        processed_html += section
    
    # 3. Process external links (marked with <!-- EXTERNAL_LINK -->)
    processed_html = re.sub(
        r'<a href="([^"]+)">(.*?)</a>\s*<!--\s*EXTERNAL_LINK\s*-->',
        r'<a href="\1" data-external="true" class="external-link">\2</a>',
        processed_html
    )
    
    # 4. Process remaining links as internal or external based on URL
    remaining_links = re.findall(r'<li><a href="([^"]+)">(.*?)</a></li>', processed_html)
    
    for url, text in remaining_links:
        # Check if this is an external URL (starts with http or https)
        is_external = url.startswith(('http://', 'https://'))
        
        if is_external:
            old_item = f'<li><a href="{url}">{text}</a></li>'
            new_item = f'<li><a href="{url}" data-external="true" class="external-link">{text}</a></li>'
            processed_html = processed_html.replace(old_item, new_item)
        else:
            old_item = f'<li><a href="{url}">{text}</a></li>'
            new_item = f'<li><a href="{url}" data-external="false">{text}</a></li>'
            processed_html = processed_html.replace(old_item, new_item)
    
    sidebar_html = processed_html
    return processed_html

class SidebarChangeHandler(FileSystemEventHandler):
    """
    Handler for sidebar.md file changes.
    
    This class watches for changes to the sidebar.md file and
    updates the sidebar HTML when changes are detected.
    """
    def on_modified(self, event):
        """
        Called when the sidebar.md file is modified.
        
        Args:
            event: The file system event
        """
        if event.src_path == SIDEBAR_MD_PATH:
            print(f"Sidebar file changed: {event.src_path}")
            parse_sidebar_markdown()

def start_sidebar_watcher():
    """
    Start the file system watcher for the sidebar.md file.
    
    This function sets up a watchdog observer to monitor changes
    to the sidebar.md file and update the sidebar HTML accordingly.
    """
    event_handler = SidebarChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=os.path.dirname(SIDEBAR_MD_PATH), recursive=False)
    observer.start()
    print(f"Watching for changes to {SIDEBAR_MD_PATH}")
    
    # Parse the sidebar markdown initially
    parse_sidebar_markdown()

@app.route('/')
def index():
    """
    Render the main sidebar interface.
    
    Returns:
        str: Rendered HTML template for the sidebar
    """
    return render_template('sidebar.html', sidebar_content=sidebar_html)

@app.route('/open_url', methods=['POST'])
def open_url():
    """
    Update the current window information.
    
    This endpoint receives a URL and title from the sidebar interface
    and updates the current_window dictionary. The actual window opening
    is now handled by JavaScript in the frontend.
    
    Returns:
        dict: JSON response indicating success
    """
    data = request.json
    url = data.get('url')
    title = data.get('title', 'External Content')
    
    if not url:
        return jsonify({"status": "error", "message": "No URL provided"})
    
    # Update current window information
    current_window["url"] = url
    current_window["title"] = title
    
    return jsonify({"status": "success", "message": f"Updated window info for {url}"})

@app.route('/get_current_window')
def get_current_window():
    """
    Get information about the currently open window.
    
    Returns:
        dict: JSON response with current window information
    """
    return jsonify(current_window)

@app.route('/local_content/<path:content_name>')
def local_content(content_name):
    """
    Render local content pages.
    
    Args:
        content_name (str): Name of the content to render
        
    Returns:
        str: Rendered HTML template for the requested content
    """
    if content_name == 'sample':
        return render_template('sample_content.html')
    elif content_name == 'matrix':
        return render_template('matrix_view.html')
    else:
        return f"<h1>Content not found: {content_name}</h1>"

@app.route('/refresh_sidebar')
def refresh_sidebar():
    """
    Manually refresh the sidebar content.
    
    Returns:
        str: JSON response with the updated sidebar HTML
    """
    sidebar_content = parse_sidebar_markdown()
    return jsonify({"status": "success", "content": sidebar_content})

if __name__ == '__main__':
    # Start the sidebar watcher
    start_sidebar_watcher()
    
    # Open the browser automatically when the server starts
    def open_browser():
        time.sleep(1)
        webbrowser.open('http://127.0.0.1:8081')
    
    threading.Thread(target=open_browser).start()
    
    # Run the Flask app with host set to 0.0.0.0 to allow external access
    app.run(host='0.0.0.0', port=8081, debug=True)
