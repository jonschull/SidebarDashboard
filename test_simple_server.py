#!/usr/bin/env python3
"""
Extremely simple test server that serves files from a single directory
"""
import http.server
import socketserver

PORT = 8080

def run_server():
    """Run a simple HTTP server"""
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
