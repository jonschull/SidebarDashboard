#!/usr/bin/env python3
"""
Simple HTTP server that can serve files and run the publish script.
"""
from http.server import HTTPServer, SimpleHTTPRequestHandler
import subprocess
import json
import os
from urllib.parse import urlparse, unquote

class DashboardHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the path
        parsed = urlparse(self.path)
        path = unquote(parsed.path)
        
        # Handle publish requests
        if path.startswith('/publish/'):
            dashboard = path[9:]  # Remove /publish/
            if not dashboard:
                self.send_error(400, "Dashboard name required")
                return
                
            try:
                # Run the publish script
                result = subprocess.run(
                    ['./publish_dashboard.sh', dashboard],
                    capture_output=True,
                    text=True,
                    cwd=os.path.dirname(os.path.abspath(__file__))
                )
                
                # Send the response
                self.send_response(200)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(result.stdout.encode())
                if result.stderr:
                    self.wfile.write(result.stderr.encode())
                    
            except Exception as e:
                self.send_error(500, str(e))
            return
            
        # Serve files normally
        return SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8080), DashboardHandler)
    print('Server running at http://localhost:8080')
    server.serve_forever()
