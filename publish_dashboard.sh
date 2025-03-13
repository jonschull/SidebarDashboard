#!/bin/bash

# publish_dashboard.sh - Script to publish changes to GitHub Pages for the active dashboard
# 
# This script:
# 1. Takes a dashboard name as input
# 2. Creates a subdirectory in docs for the dashboard
# 3. Copies dashboard content to its subdirectory
# 4. Adds all changes to git
# 5. Commits with a timestamp
# 6. Pushes to GitHub

# Set script to exit immediately if any command fails
set -e

# Check if dashboard name was provided
if [ -z "$1" ]; then
  echo "Usage: ./publish_dashboard.sh <dashboard_name>"
  echo "Available dashboards:"
  for d in dashboard_content/*/; do
    if [ -d "$d" ]; then
      echo "  - $(basename "$d")"
    fi
  done
  exit 1
fi

DASHBOARD_NAME="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DASHBOARD_DIR="$SCRIPT_DIR/dashboard_content/$DASHBOARD_NAME"
DOCS_DIR="$SCRIPT_DIR/docs"
TARGET_DIR="$DOCS_DIR/$DASHBOARD_NAME"

# Check if dashboard exists
if [ ! -d "$DASHBOARD_DIR" ]; then
  echo "Error: Dashboard '$DASHBOARD_NAME' not found"
  echo "Available dashboards:"
  for d in dashboard_content/*/; do
    if [ -d "$d" ]; then
      echo "  - $(basename "$d")"
    fi
  done
  exit 1
fi

# Check if git is clean before proceeding
if [ -n "$(git status --porcelain)" ]; then
  echo "Warning: You have uncommitted changes in your repository."
  echo "It's recommended to commit your changes before publishing."
  read -p "Do you want to proceed anyway? [y/N] " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Publishing cancelled."
    exit 1
  fi
fi

echo "==================== PUBLISHING TO GITHUB PAGES ===================="
echo "Publishing dashboard: $DASHBOARD_NAME"

# Make sure the docs directory exists
echo "Checking if docs directory exists..."
if [ ! -d "$DOCS_DIR" ]; then
    echo "Creating docs directory..."
    mkdir -p "$DOCS_DIR"
fi

# Create or clean the target directory
echo "Preparing target directory..."
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

echo "Copying files from dashboard_content/$DASHBOARD_NAME to docs/$DASHBOARD_NAME..."
# Copy all files from the dashboard directory to its docs subdirectory
cp -r "$DASHBOARD_DIR/"* "$TARGET_DIR/"

# Copy the dashboard to the root docs as well if it's meant to be the default
if [ "$DASHBOARD_NAME" = "default" ]; then
    echo "This is the default dashboard, copying to docs root..."
    cp -r "$DASHBOARD_DIR/"* "$DOCS_DIR/"
fi

echo "Adding changes to git..."
cd "$SCRIPT_DIR"
git add docs/

echo "Committing changes..."
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
git commit -m "Update GitHub Pages content for $DASHBOARD_NAME - $TIMESTAMP"

echo "Pushing to GitHub..."
git push origin main

echo "==================== PUBLISHING COMPLETE ===================="
echo "Your changes have been pushed to GitHub."
echo "Dashboard: $DASHBOARD_NAME"
echo "GitHub Pages URLs:"
echo "- Dashboard URL: https://jonschull.github.io/SidebarDashboard/$DASHBOARD_NAME"
if [ "$DASHBOARD_NAME" = "default" ]; then
    echo "- Default URL: https://jonschull.github.io/SidebarDashboard"
fi
echo "Note: It may take a few minutes for changes to appear on GitHub Pages."
echo "To check the deployment status, visit:"
echo "https://github.com/jonschull/SidebarDashboard/actions"
