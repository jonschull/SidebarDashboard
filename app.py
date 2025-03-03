"""
Sidebar Dashboard App

This Flask application serves a sidebar interface that can control external browser windows.
It provides a clean separation between the sidebar navigation and the content being viewed.

Key components:
- Flask web server to serve the sidebar interface
- JavaScript to handle sidebar interactions
- External CSS and JS files for clean separation of concerns
"""

from flask import Flask, render_template, request, jsonify, url_for
import webbrowser
import os
import sys
import json
import threading
import time
from urllib.parse import quote

# Create Flask app with static folder configuration
app = Flask(__name__, static_folder='static', static_url_path='/static')

# Store information about the currently open window
current_window = {
    "url": None,
    "title": None
}

# Configuration
SIDEBAR_WIDTH = 250  # Width of the sidebar in pixels

@app.route('/')
def index():
    """
    Render the main sidebar interface.
    
    Returns:
        str: Rendered HTML template for the sidebar
    """
    return render_template('sidebar.html')

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

if __name__ == '__main__':
    # Open the browser automatically when the server starts
    def open_browser():
        time.sleep(1)
        webbrowser.open('http://127.0.0.1:8081')
    
    threading.Thread(target=open_browser).start()
    
    # Run the Flask app with host set to 0.0.0.0 to allow external access
    app.run(host='0.0.0.0', port=8081, debug=True)
