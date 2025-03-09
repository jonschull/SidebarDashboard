#!/bin/bash

# Function to stop any running servers
stop_servers() {
    echo "Stopping any running servers..."
    pkill -f "python.*http_server.*" || true
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    sleep 1
    echo "Server stopped."
}

# Function to create the server script
create_server_script() {
    local cache_option=$1
    if [ "$cache_option" == "nocache" ] || [ ! -f "$(dirname "$0")/http_server_nocache.py" ]; then
        echo "Creating no-cache HTTP server script..."
        cat > "$(dirname "$0")/http_server_nocache.py" << 'EOF'
#!/usr/bin/env python3
"""
Simple HTTP server with cache-disabling headers to aid development.
Based on Python's http.server with added headers to prevent caching.
"""

import http.server
import socketserver

PORT = 8080

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add cache-disabling headers before sending headers
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

Handler = NoCacheHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT} with cache disabled")
    httpd.serve_forever()
EOF
        chmod +x "$(dirname "$0")/http_server_nocache.py"
    else
        echo "Using standard HTTP server..."
    fi
}

# Function to start the server
start_server() {
    local cache_option=$1
    
    if [ "$cache_option" == "nocache" ]; then
        echo "Starting no-cache server on http://localhost:8080"
        cd "$(dirname "$0")/docs" && python3 ../http_server_nocache.py > /dev/null 2>&1 &
        SERVER_PID=$!
        echo "No-cache server started with PID: $SERVER_PID"
    else
        echo "Starting standard server on http://localhost:8080"
        cd "$(dirname "$0")/docs" && python3 -m http.server 8080 > /dev/null 2>&1 &
        SERVER_PID=$!
        echo "Standard server started with PID: $SERVER_PID"
        echo -e "\nTIP: If changes don't appear, run with: ./quick-test.sh nocache"
    fi
    
    # Wait a moment for the server to start
    sleep 1
}

# Function to open the browser
open_browser() {
    echo "Opening browser..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:8080
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open http://localhost:8080
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        start http://localhost:8080
    else
        echo "Could not detect OS for browser opening. Please open http://localhost:8080 manually."
    fi
}

# Main script logic
if [ "$1" == "stop" ]; then
    stop_servers
    exit 0
fi

# Stop any running servers first
stop_servers

# Create the appropriate server script
create_server_script "$1"

# Start the server
start_server "$1"

# Open the browser
open_browser

echo ""
echo "Test checklist:"
echo "✓ Sidebar should be fixed at 300px width"
echo "✓ Links should open at sidebar + 25px position"
echo "✓ Markdown should render correctly with marked.js"
echo ""
echo "Server is running in the background."
echo "Press Ctrl+C or run './quick-test.sh stop' to stop the server"

# Keep the terminal open unless the script runs in the background
wait $SERVER_PID
