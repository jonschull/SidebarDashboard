#!/bin/bash

# Function to stop any running servers
stop_servers() {
    echo "Stopping any running servers..."
    pkill -f "python.*http_server.*" || true
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    sleep 1
    echo "Server stopped."
}

# Function to start the server
start_server() {
    echo "Starting enhanced server on http://localhost:8080"
    cd "$(dirname "$0")" && python3 http_server_nocache.py > /dev/null 2>&1 &
    SERVER_PID=$!
    echo "Server started with PID: $SERVER_PID"
}

# Function to restart the server
restart_server() {
    stop_servers
    start_server
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
case "$1" in
    stop)
        stop_servers
        exit 0
        ;;
    restart)
        restart_server
        exit 0
        ;;
    start|"")
        # Stop any running servers first
        stop_servers
        
        # Start the server
        start_server
        
        # Open the browser
        open_browser
        
        echo ""
        echo "Test checklist:"
        echo "✓ Sidebar should be fixed at 300px width"
        echo "✓ Links should open at sidebar + 25px position"
        echo "✓ Markdown should render correctly with marked.js"
        echo "✓ Publish button should be at the top of the sidebar"
        echo ""
        echo "Server is running in the background."
        echo "Press Ctrl+C or run './quick-test.sh stop' to stop the server"
        
        # Keep the terminal open unless the script runs in the background
        wait $SERVER_PID
        ;;
    *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
        ;;
esac
