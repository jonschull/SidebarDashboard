#!/bin/bash

echo "=== Testing SidebarDashboard Versions ==="

# Function to safely stop servers
stop_servers() {
    echo "Stopping any running servers..."
    # Stop any Python HTTP servers (static version)
    pkill -f "python.*http.server" || true
    # Kill anything using our port
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    # Give servers time to fully stop
    sleep 2
}

# Cleanup function for exit
cleanup() {
    echo -e "\nCleaning up servers..."
    stop_servers
}

# Set up cleanup on script exit
trap cleanup EXIT

# Clean up before starting
stop_servers

# Start Static Version
echo -e "\n1. Testing Static Clean Version..."
echo "- Starting server..."
cd docs && python -m http.server 8080 > /dev/null 2>&1 &
cd ..
sleep 2
echo "- Testing server response (should be 200 OK):"
curl -s -I http://localhost:8080 | head -n 1
echo "- Check clean features at http://localhost:8080"
echo "  • Should have 300px fixed sidebar"
echo "  • Should render sidebar.md with marked.js"
echo "  • Links should open at sidebar + 25px"

# Check GitHub Pages
echo -e "\n2. Testing GitHub Pages..."
echo "- Testing server response (should be 200 OK):"
curl -s -I https://jonschull.github.io/SidebarDashboard/ | head -n 1
echo "- Check deployment at https://jonschull.github.io/SidebarDashboard"
echo "  • Should match clean static version"
echo "  • Should use marked.js for markdown"
echo "  • Should have proper UTF-8 encoding"

echo -e "\nMarkdown Rendering Test:"
echo "1. Static: Uses marked.js for all markdown"
echo "2. GitHub Pages: Same as static version"

echo -e "\nDone. Each version should:"
echo "1. Return 200 OK in tests above"
echo "2. Display correctly in browser"
echo "3. Render markdown properly"
