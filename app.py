#!/usr/bin/env python3
"""
Sidebar Dashboard Application

This Flask application provides a dynamic dashboard with a configurable sidebar
that can be edited in real-time using markdown. The sidebar is rendered from a
markdown file (sidebar.md) and automatically refreshes when the file is changed.

The application handles different types of content:
- Markdown files (.md) are rendered as HTML with styling
- HTML files are served directly
- Text files are displayed with formatting
- External links (http/https) open in a new browser window

Key features:
- Dynamic sidebar that updates in real-time
- URL bar updates to reflect the current content
- Proper handling of various file types
- Error handling for missing files

Author: Codeium
License: MIT
"""

import os
import re
import time
import json
import markdown
from flask import Flask, render_template, send_from_directory, Response, request, jsonify
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

app = Flask(__name__)

# Constants
TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), 'templates')
SIDEBAR_MD_PATH = os.path.join(os.path.dirname(__file__), 'sidebar.md')
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
        str: Rendered HTML for the main dashboard page
    """
    return render_template('sidebar.html', sidebar_content=sidebar_html)

@app.route('/<path:filename>')
def serve_file(filename):
    """
    Serve files from the root directory.
    
    This function serves files from the root directory of the application.
    It allows users to reference files directly in the sidebar.md file.
    For markdown files, it renders them as HTML instead of downloading.
    For text files, it displays them with proper formatting.
    
    Args:
        filename (str): Path to the file relative to the root directory
        
    Returns:
        Response: The requested file or a 404 error if the file doesn't exist
    """
    # Normalize the filename to prevent path traversal
    filename = filename.replace('//', '/')
    
    # Check if it's a template file
    if filename.startswith('templates/'):
        template_path = filename[len('templates/'):]
        if os.path.exists(os.path.join(TEMPLATES_DIR, template_path)):
            return send_from_directory(TEMPLATES_DIR, template_path)
    
    # Check if the file exists in the root directory
    file_path = os.path.join(ROOT_DIR, filename)
    if os.path.exists(file_path):
        # If it's a markdown file, render it as HTML
        if file_path.endswith('.md'):
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
        elif file_path.endswith('.txt'):
            # For text files, display them with proper formatting
            with open(file_path, 'r') as f:
                content = f.read()
            return Response(f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>{os.path.basename(file_path)}</title>
                <style>
                    body {{ font-family: monospace; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }}
                    pre {{ background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; }}
                </style>
            </head>
            <body>
                <h1>{os.path.basename(file_path)}</h1>
                <pre>{content}</pre>
            </body>
            </html>
            """, mimetype='text/html')
        else:
            # Otherwise, serve the file normally
            return send_from_directory(os.path.dirname(file_path), os.path.basename(file_path))
    
    # If the file doesn't exist, check if it's a template reference
    template_name = os.path.splitext(os.path.basename(filename))[0]
    if template_name in template_mapping:
        return render_template(template_mapping[template_name])
    
    # If we get here, the file doesn't exist
    return Response(f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>File Not Found</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }}
            h1 {{ color: #d9534f; }}
            .error-box {{ background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; }}
            .path {{ font-family: monospace; background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; }}
        </style>
    </head>
    <body>
        <h1>File Not Found</h1>
        <div class="error-box">
            <p>The requested file <span class="path">{filename}</span> could not be found.</p>
            <p>Full path checked: <span class="path">{file_path}</span></p>
        </div>
    </body>
    </html>
    """, status=404, mimetype='text/html')

@app.route('/refresh_sidebar')
def refresh_sidebar():
    """
    Refresh the sidebar content.
    
    This function is called via AJAX to get the latest sidebar content.
    It returns the current sidebar HTML as JSON.
    
    Returns:
        Response: JSON response with the sidebar content
    """
    return jsonify({
        'status': 'success',
        'content': sidebar_html
    })

@app.route('/open_url', methods=['POST'])
def open_url():
    """
    Record that a URL was opened in a new window.
    
    This function is called when an external URL is opened in a new window.
    It logs the URL and title for reference.
    
    Returns:
        Response: JSON response indicating success
    """
    data = request.get_json()
    url = data.get('url', '')
    title = data.get('title', '')
    
    print(f"Opened external URL: {url} ({title})")
    
    return jsonify({
        'status': 'success'
    })

if __name__ == '__main__':
    print("Starting Sidebar Dashboard...")
    print(f"Dashboard available at: http://localhost:8081")
    print(f"Edit {SIDEBAR_MD_PATH} to update the sidebar")
    app.run(host='0.0.0.0', port=8081, debug=True)
