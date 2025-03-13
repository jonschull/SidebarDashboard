#!/bin/bash

# create-dashboard.sh - Script to create a new dashboard
# 
# This script:
# 1. Takes a GitHub username and dashboard name as input
# 2. Creates a new dashboard directory
# 3. Sets up symlinks to shared resources
# 4. Configures dashboard-specific files

# Set script to exit immediately if any command fails
set -e

# Check if both username and dashboard name were provided
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: ./create-dashboard.sh <github_username> <dashboard_name>"
  exit 1
fi

GITHUB_USERNAME="$1"
DASHBOARD_NAME="$2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DASHBOARD_DIR="$SCRIPT_DIR/dashboard_content/$DASHBOARD_NAME"

echo "Creating new dashboard: $DASHBOARD_NAME"

# Create dashboard directory
mkdir -p "$DASHBOARD_DIR"

# Create symlinks to shared resources
echo "Creating symlinks to shared resources..."
mkdir -p "$DASHBOARD_DIR/css"
mkdir -p "$DASHBOARD_DIR/js"
ln -sf "../../dashboard_inclusions/css/styles.css" "$DASHBOARD_DIR/css/styles.css"
ln -sf "../../dashboard_inclusions/js/viewer.js" "$DASHBOARD_DIR/js/viewer.js"

# Create dashboard-specific files
echo "Creating dashboard files..."

# Create dashboard_config.js
cat > "$DASHBOARD_DIR/dashboard_config.js" << EOL
/**
 * Dashboard Configuration
 * This file contains configuration settings for the current dashboard
 */

// Global dashboard configuration object
window.DASHBOARD_CONFIG = {
    name: '$DASHBOARD_NAME',
    githubUsername: '$GITHUB_USERNAME',
    githubRepo: 'SidebarDashboard',
    githubPagesUrl: 'https://$GITHUB_USERNAME.github.io/SidebarDashboard/$DASHBOARD_NAME/',
    githubStatusUrl: 'https://github.com/$GITHUB_USERNAME/SidebarDashboard/actions',
    publishStatus: 'unpublished' // Options: 'published', 'unpublished', 'test'
};
EOL

# Copy index.html template
cp "$SCRIPT_DIR/dashboard_inclusions/index.html" "$DASHBOARD_DIR/"
# Update title in index.html
sed -i '' "s/<title>.*<\/title>/<title>$DASHBOARD_NAME<\/title>/" "$DASHBOARD_DIR/index.html"

# Create sidebar.md
cat > "$DASHBOARD_DIR/sidebar.md" << EOL
# $DASHBOARD_NAME

- [Home](index.html)
- [About](about.html)

## About This Dashboard

This is a new dashboard created from the shared template.

## Navigation

Add your links here
EOL

# Create welcome.md
cat > "$DASHBOARD_DIR/welcome.md" << EOL
# Welcome to $DASHBOARD_NAME

This is your new dashboard. You can:

1. Edit this welcome page
2. Update the sidebar navigation
3. Add your own content files

## Getting Started

1. Add your content to the sidebar
2. Create new markdown files for your content
3. Test locally before publishing
EOL

echo "Dashboard '$DASHBOARD_NAME' created successfully!"
echo "Access it at: http://localhost:8080/$DASHBOARD_NAME"
