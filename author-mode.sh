#!/bin/bash

# Script to open SidebarDashboard in Author Mode
# This will focus on the content files in working-version/docs

echo "Switching to Author Mode..."

# Always restart the server to ensure it's running
cd "$(dirname "$0")/working-version"

# Force kill any existing Python server processes on port 8080
echo "Stopping any running servers..."
kill $(lsof -t -i:8080 2>/dev/null) 2>/dev/null || true
sleep 1

# Start server in a new terminal window using osascript
echo "Starting server..."
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && python3 http_server_nocache.py"'

# Wait a moment to ensure server starts
sleep 2

# Open the browser to the dashboard
open http://localhost:8080

# Get the absolute path to the project root
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

# Show Author Mode indicator and hide Development Mode indicator
touch "$PROJECT_ROOT/AUTHOR_MODE_ACTIVE.md"
rm -f "$PROJECT_ROOT/DEVELOPMENT_MODE_ACTIVE.md"

# Open the Author Mode workspace
open ../author-mode.code-workspace

# Display AI context information
echo ""
echo "=== AUTHOR MODE ACTIVATED ==="
echo "Hello! I'm your AI assistant in Author Mode. I'm here to help you with content creation and editing."
echo "I'll focus on helping you with markdown formatting, content organization, and publishing."
echo "For more information about my capabilities in this mode, please refer to AUTHOR_MODE_CONTEXT.md"
echo "==========================="
echo ""

echo "Author Mode: Edit content in working-version/docs"
echo "Server running at http://localhost:8080"
