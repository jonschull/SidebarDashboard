#!/usr/bin/env python3
"""
Simple HTTP server with cache-disabling headers to aid development.
Based on Python's http.server with added headers to prevent caching.
"""

import http.server
import socketserver
import os
import sys
import urllib.parse

PORT = 8080

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with cache disabling and markdown handling."""
    
    def end_headers(self):
        """Add cache-disabling headers before sending headers."""
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

# Create the server
Handler = NoCacheHTTPRequestHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT} with cache disabled")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
    sys.exit(0)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
