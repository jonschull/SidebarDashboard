#!/bin/bash

echo "=== Testing SidebarDashboard Versions ==="

# Stop existing servers
echo "Stopping any running servers..."
pkill -f "python -m http.server" 
pkill -f "python app.py"
sleep 2

# Start Flask ERA Version
echo -e "\n1. Testing Flask ERA Version..."
echo "- Starting server..."
python app.py &
echo "- Waiting for server to initialize..."
sleep 5
echo "- Testing server response (should be 200 OK):"
curl -s -I http://localhost:8081 | head -n 1
echo "- Check ERA features at http://localhost:8081"
echo "  • Should show iframe content"
echo "  • Should have real-time sidebar updates"
echo "  • Should render sidebar.md in Flask template"

# Start Static Version
echo -e "\n2. Testing Static Clean Version..."
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
echo -e "\n3. Testing GitHub Pages..."
echo "- Testing server response (should be 200 OK):"
curl -s -I https://jonschull.github.io/SidebarDashboard | head -n 1
echo "- Check deployment at https://jonschull.github.io/SidebarDashboard"
echo "  • Should match clean static version"
echo "  • Should use marked.js for markdown"
echo "  • Should have proper UTF-8 encoding"

echo -e "\nMarkdown Rendering Test:"
echo "1. Flask ERA: Uses Flask templates for sidebar.md"
echo "2. Static: Uses marked.js for all markdown"
echo "3. GitHub Pages: Same as static version"

echo -e "\nDone. Each version should:"
echo "1. Return 200 OK in tests above"
echo "2. Display correctly in browser"
echo "3. Render markdown properly"
