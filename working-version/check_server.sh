#!/bin/bash

# check_server.sh
# Script to check if the server is running and start it if needed
# Provides clean, concise output

# Function to check if server is running
check_server() {
  if lsof -ti:8080 >/dev/null 2>&1; then
    echo "✅ Server is already running on port 8080"
    return 0
  else
    echo "⚠️ Server is not running"
    return 1
  fi
}

# Function to start the server
start_server() {
  echo "🚀 Starting server..."
  cd "$(dirname "$0")"
  
  # Start server in a new terminal window using osascript
  osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && python3 http_server_nocache.py"' >/dev/null 2>&1
  
  # Wait a moment to ensure server starts
  sleep 2
  
  # Verify server started successfully
  if check_server; then
    echo "✅ Server started successfully"
    echo "📊 Dashboard available at http://localhost:8080"
    return 0
  else
    echo "❌ Failed to start server"
    return 1
  fi
}

# Main script logic
echo "🔍 Checking SidebarDashboard server status..."

if check_server; then
  # Server is already running
  echo "📊 Dashboard available at http://localhost:8080"
  exit 0
else
  # Server is not running, start it
  start_server
  exit $?
fi
