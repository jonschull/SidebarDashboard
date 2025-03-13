#!/bin/bash

# Script to reliably start the dashboard server
# - Ensures server starts from project root
# - Handles port cleanup
# - Provides clear status output

# Get absolute path to script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Starting dashboard server..."

# Kill any existing process on port 8080
echo "Checking for existing server..."
EXISTING_PID=$(lsof -t -i:8080 2>/dev/null)
if [ ! -z "$EXISTING_PID" ]; then
    echo "Stopping existing server on port 8080..."
    kill $EXISTING_PID
    sleep 1
fi

# Start server from project root
echo "Starting server from: $SCRIPT_DIR"
python3 simple_server.py
