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

import os
import re
import markdown
import webbrowser
import threading
import time
from flask import Flask, render_template, jsonify, send_from_directory, Response
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Create Flask app with static folder configuration
app = Flask(__name__)

# Constants
PORT = 8081
SIDEBAR_MD_PATH = os.path.join(os.path.dirname(__file__), 'sidebar.md')
TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), 'templates')
ROOT_DIR = os.path.dirname(__file__)

# Store the parsed sidebar HTML
sidebar_html = ""

# Dictionary to map simple names to template files
template_mapping = {}

def discover_templates():
    """
    Discover templates in the templates directory and create mappings.
    
    This function scans the templates directory and creates a mapping from
    simple names (without extension) to template files. This allows users
    to reference templates by their base name in the sidebar.md file.
    
    Returns:
        dict: Mapping from template names to template files
    """
    mapping = {}
    
    # Skip these template files as they are used by the app itself
    skip_templates = ['sidebar.html']
    
    for filename in os.listdir(TEMPLATES_DIR):
        if filename.endswith('.html') and filename not in skip_templates:
            # Remove the .html extension to get the template name
            template_name = os.path.splitext(filename)[0]
            mapping[template_name] = filename
    
    return mapping

# Initialize the template mapping
template_mapping = discover_templates()

def parse_sidebar_markdown():
    """
    Parse the sidebar markdown file and convert it to HTML.
    
    This function reads the sidebar.md file, converts it to HTML,
    and applies the necessary classes and data attributes for the sidebar.
    It automatically detects external links based on URL protocol (http/https)
    and applies the appropriate attributes.
    
    Returns:
        str: HTML content for the sidebar
    """
    global sidebar_html
    
    if not os.path.exists(SIDEBAR_MD_PATH):
        return "<div class='sidebar-title'>Dashboard</div><p>sidebar.md not found</p>"
    
    with open(SIDEBAR_MD_PATH, 'r') as f:
        md_content = f.read()
    
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
    
    # 3. Process all links, automatically detecting external ones based on URL
    # First, find all list items with links
    list_items = re.findall(r'<li><a href="([^"]+)">(.*?)</a>(.*?)</li>', processed_html)
    
    for url, text, suffix in list_items:
        # Check if this is an external URL (starts with http or https)
        is_external = url.startswith(('http://', 'https://'))
        
        if is_external:
            old_item = f'<li><a href="{url}">{text}</a>{suffix}</li>'
            new_item = f'<li><a href="{url}" data-external="true" class="external-link">{text}</a>{suffix}</li>'
            processed_html = processed_html.replace(old_item, new_item)
        else:
            # This is a local file or route
            # Just use the URL as is, but mark it as non-external
            old_item = f'<li><a href="{url}">{text}</a>{suffix}</li>'
            new_item = f'<li><a href="{url}" data-external="false">{text}</a>{suffix}</li>'
            processed_html = processed_html.replace(old_item, new_item)
    
    sidebar_html = processed_html
    return processed_html

# Watchdog event handler for sidebar.md changes
class SidebarChangeHandler(FileSystemEventHandler):
    """
    Watchdog event handler for monitoring changes to the sidebar.md file.
    
    This class defines the behavior when the sidebar.md file is modified.
    It updates the sidebar_html global variable with the new content.
    
    Attributes:
        None
    """
    def on_modified(self, event):
        """
        Handle file modification events.
        
        This method is called when a file is modified. If the modified file
        is sidebar.md, it updates the sidebar_html global variable.
        
        Args:
            event (FileSystemEvent): The event object representing the file system event
            
        Returns:
            None
        """
        if event.src_path == SIDEBAR_MD_PATH:
            parse_sidebar_markdown()
            print(f"Sidebar updated: {time.strftime('%H:%M:%S')}")

# Initialize sidebar content
parse_sidebar_markdown()

# Set up watchdog observer for sidebar.md
observer = Observer()
observer.schedule(SidebarChangeHandler(), os.path.dirname(SIDEBAR_MD_PATH), recursive=False)
observer.start()

# Route for the main dashboard page
@app.route('/')
def index():
    """
    Render the main dashboard page.
    
    This function renders the sidebar template with the current sidebar content.
    
    Returns:
        str: Rendered HTML template for the main dashboard
    """
    return render_template('sidebar.html', sidebar_content=sidebar_html)

# Route for serving files from the root directory
@app.route('/<path:filename>')
def serve_file(filename):
    """
    Serve files from the root directory.
    
    This function serves files from the root directory of the application.
    It allows users to reference files directly in the sidebar.md file.
    For markdown files, it renders them as HTML instead of downloading.
    
    Args:
        filename (str): Path to the file relative to the root directory
        
    Returns:
        Response: The requested file or a 404 error if the file doesn't exist
    """
    file_path = os.path.join(ROOT_DIR, filename)
    
    # If the file doesn't exist, check if it's a template reference
    if not os.path.exists(file_path):
        # Check if it's a template reference (without .html extension)
        template_name = filename.split('/')[-1]  # Get the base name
        if template_name in template_mapping:
            return render_template(template_mapping[template_name])
        
        # Check if it's a template reference with templates/ prefix
        if filename.startswith('templates/'):
            template_name = filename[len('templates/'):].split('/')[-1]
            if template_name in template_mapping:
                return render_template(template_mapping[template_name])
    
    # If it's a markdown file, render it as HTML
    if os.path.exists(file_path) and file_path.endswith('.md'):
        with open(file_path, 'r') as f:
            content = f.read()
        html_content = markdown.markdown(content)
        return Response(f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>{os.path.basename(file_path)}</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }}
                h1, h2, h3 {{ color: #333; }}
                pre {{ background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }}
                code {{ background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; }}
                blockquote {{ border-left: 4px solid #ddd; padding-left: 15px; color: #666; }}
                img {{ max-width: 100%; }}
                table {{ border-collapse: collapse; width: 100%; }}
                th, td {{ border: 1px solid #ddd; padding: 8px; }}
                th {{ background-color: #f2f2f2; }}
                tr:nth-child(even) {{ background-color: #f9f9f9; }}
            </style>
        </head>
        <body>
            {html_content}
        </body>
        </html>
        """, mimetype='text/html')
    
    # Otherwise, serve the file normally
    return send_from_directory(ROOT_DIR, filename)

@app.route('/refresh_sidebar')
def refresh_sidebar():
    """
    Refresh the sidebar content.
    
    This function re-parses the sidebar.md file and returns the updated HTML.
    It's used by the AJAX call in the sidebar to update the content without
    reloading the page.
    
    Returns:
        JSON: A JSON object containing the updated sidebar content and status
    """
    return jsonify({
        'status': 'success',
        'content': parse_sidebar_markdown()
    })

# Function to open the dashboard in a browser
def open_dashboard():
    """
    Open the dashboard in the default web browser.
    
    This function waits for 1 second to ensure the Flask server is running,
    then opens the dashboard URL in the default web browser.
    
    Returns:
        None
    """
    time.sleep(1)  # Wait for Flask to start
    webbrowser.open(f'http://localhost:{PORT}')

# Main entry point
if __name__ == '__main__':
    # Start a thread to open the dashboard in a browser
    threading.Thread(target=open_dashboard).start()
    
    # Start the Flask server
    app.run(host='0.0.0.0', port=PORT, debug=True, use_reloader=False)
