#!/bin/bash
# Simple wrapper around publish_dashboard.sh that can be called from viewer.js

# Get the dashboard name from the first argument
DASHBOARD_NAME="$1"

# Change to the root directory
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Run the publish script and capture its output
./publish_dashboard.sh "$DASHBOARD_NAME" 2>&1
