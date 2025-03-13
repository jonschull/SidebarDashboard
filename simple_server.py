#!/usr/bin/env python3
"""
Simple HTTP server that:
1. Serves files from dashboard_content
2. Handles /api/publish/<dashboard> requests to publish dashboards
3. Handles /<dashboard>/?publish requests for direct browser publishing
"""
import http.server
import socketserver
import os
from urllib.parse import urlparse, unquote, parse_qs
import json
import time

# Import the publish module
from publish import publish_dashboard, get_available_dashboards

class DashboardHandler(http.server.SimpleHTTPRequestHandler):
    """
    HTTP request handler for the dashboard server.
    
    Handles:
    - Serving static files from dashboard_content
    - API requests for publishing dashboards
    - Direct browser requests for publishing
    """
    
    def do_GET(self):
        """
        Handle GET requests, including API requests and static file serving.
        
        Parameters:
            None (uses self.path from the request)
            
        Returns:
            None (writes response directly to the client)
        """
        # Parse the path
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        query = parse_qs(parsed.query)
        
        # Debug info
        print(f"Path: {path}, Query: {query}")
        print(f"Full path: {self.path}")
        print(f"Parsed query: {parsed.query}")
        
        # Handle API requests
        if path.startswith('/api/publish/'):
            # Extract dashboard name from path
            dashboard = path[len('/api/publish/'):]
            
            # Handle case where dashboard name might have trailing slash
            if dashboard.endswith('/'):
                dashboard = dashboard[:-1]
                
            print(f"Publishing dashboard: {dashboard}")
            
            if not dashboard:
                self.send_error(400, "Dashboard name required")
                return
                
            # Call the publish_dashboard function from our module
            result = publish_dashboard(dashboard)
            
            # Send the response as JSON
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')  # Add CORS header
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            return
        
        # For backward compatibility, also handle the old query parameter approach
        elif parsed.query == 'publish' or 'publish' in query:
            # Extract dashboard name from path
            dashboard = path.strip('/')
            
            # Handle case where dashboard name might have trailing slash
            if dashboard.endswith('/'):
                dashboard = dashboard[:-1]
                
            print(f"Publishing dashboard (legacy method): {dashboard}")
            
            if not dashboard:
                self.send_error(400, "Dashboard name required")
                return
                
            # Call the publish_dashboard function from our module
            result = publish_dashboard(dashboard)
            
            # Check if the request wants JSON (from JavaScript fetch) or HTML (from browser URL)
            accept_header = self.headers.get('Accept', '')
            
            # If the request accepts JSON or comes from a programmatic fetch
            if 'application/json' in accept_header or self.headers.get('X-Requested-With') == 'XMLHttpRequest':
                # Send the response as JSON
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')  # Add CORS header
                self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
                self.send_header('Pragma', 'no-cache')
                self.send_header('Expires', '0')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
            else:
                # Send a user-friendly HTML response for direct browser access
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
                self.end_headers()
                
                # Create a nice HTML page with the result
                html = f"""<!DOCTYPE html>
                <html>
                <head>
                    <title>Dashboard Publishing Result</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }}
                        h1 {{ color: #2c3e50; }}
                        pre {{ background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; }}
                        .success {{ color: #28a745; }}
                        .error {{ color: #dc3545; }}
                        .button {{ display: inline-block; padding: 10px 15px; background-color: #3498db; color: white; 
                                  text-decoration: none; border-radius: 4px; margin-top: 20px; }}
                    </style>
                </head>
                <body>
                    <h1>Dashboard Publishing Result</h1>
                    <p><strong>Dashboard:</strong> {dashboard}</p>
                    <p><strong>Status:</strong> <span class="{'success' if result['success'] else 'error'}">
                        {'Success' if result['success'] else 'Failed'}
                    </span></p>
                    
                    <h2>Output:</h2>
                    <pre>{result['output']}</pre>
                    
                    {'<p class="error">Error: ' + result['error'] + '</p>' if result.get('error') else ''}
                    
                    {'<p class="success">Your dashboard has been published successfully!</p>' if result['success'] else ''}
                    
                    {'<p><strong>GitHub Pages URL:</strong> <a href="' + result.get('githubPagesUrl', '') + '" target="_blank">' + 
                      result.get('githubPagesUrl', '') + '</a></p>' if result['success'] and 'githubPagesUrl' in result else ''}
                    
                    <a href="/{dashboard}/" class="button">Return to Dashboard</a>
                </body>
                </html>"""
                
                self.wfile.write(html.encode())
            return
        
        # Handle normal file serving
        try:
            # Use the standard SimpleHTTPRequestHandler method to serve files
            super().do_GET()
        except Exception as e:
            print(f"Error serving file: {e}")
            self.send_error(500, f"Internal server error: {str(e)}")

PORT = 8080

def run_server():
    """
    Run the HTTP server from the dashboard_content directory.
    
    This function:
    1. Changes to the dashboard_content directory
    2. Starts the HTTP server on the configured port
    3. Prints available dashboards
    4. Runs the server indefinitely
    
    Parameters:
        None
        
    Returns:
        None (runs indefinitely)
    """
    # Change to dashboard_content
    root_dir = os.path.dirname(os.path.abspath(__file__))
    content_dir = os.path.join(root_dir, 'dashboard_content')
    os.chdir(content_dir)
    
    print(f"Serving from: {content_dir}")
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), DashboardHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print("Available dashboards:")
        dashboards = get_available_dashboards()
        if dashboards["success"]:
            for dashboard in dashboards["dashboards"]:
                print(f"  - http://localhost:{PORT}/{dashboard}/")
        print("\nTo publish a dashboard, use the 'Update Dashboard' button in the dashboard")
        print("To publish directly, visit: http://localhost:8080/<dashboard>/?publish")
        print("To clear browser cache, visit: http://localhost:8080/clear_cache.html")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
