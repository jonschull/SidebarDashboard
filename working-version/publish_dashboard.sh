#!/bin/bash

# publish_dashboard.sh - Script to publish changes to GitHub Pages for the active dashboard
# 
# This script:
# 1. Determines the active dashboard from configuration
# 2. Reads GitHub repository information from the dashboard config
# 3. Copies all files from the active dashboard directory to docs
# 4. Adds all changes to git
# 5. Commits with a timestamp
# 6. Pushes to GitHub
#
# IMPORTANT: This is separate from regular git pushes.
# Regular code updates do NOT automatically update the GitHub Pages site.
# Only this publish script will update the live site.

# Set script to exit immediately if any command fails
set -e

# Get the root directory of the repository
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG_DIR="${ROOT_DIR}/dashboard_config"
ACTIVE_CONFIG="${ROOT_DIR}/active_dashboard.txt"

echo "==================== PUBLISHING TO GITHUB PAGES ===================="
echo "Starting publish process..."

# Determine the active dashboard
if [ -f "${ACTIVE_CONFIG}" ]; then
    ACTIVE_DASHBOARD=$(cat "${ACTIVE_CONFIG}")
else
    ACTIVE_DASHBOARD="default"
    echo "No active dashboard specified, using default"
fi

echo "Active dashboard: ${ACTIVE_DASHBOARD}"

# Read GitHub repository information from config
if [ -f "${CONFIG_DIR}/${ACTIVE_DASHBOARD}.json" ]; then
    # Extract values using grep and sed (basic parsing)
    GITHUB_REPO=$(grep -o '"github_repo": *"[^"]*"' "${CONFIG_DIR}/${ACTIVE_DASHBOARD}.json" | sed 's/"github_repo": *"\(.*\)"/\1/')
    GITHUB_PAGES_URL=$(grep -o '"github_pages_url": *"[^"]*"' "${CONFIG_DIR}/${ACTIVE_DASHBOARD}.json" | sed 's/"github_pages_url": *"\(.*\)"/\1/')
    
    # Extract username and repo name from the GitHub repo URL
    GITHUB_USERNAME=$(echo "$GITHUB_REPO" | sed -E 's|https://github.com/([^/]+)/([^.]+)\.git|\1|')
    REPO_NAME=$(echo "$GITHUB_REPO" | sed -E 's|https://github.com/([^/]+)/([^.]+)\.git|\2|')
    
    GITHUB_STATUS_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/actions"
else
    echo "Error: Configuration file for ${ACTIVE_DASHBOARD} not found at ${CONFIG_DIR}/${ACTIVE_DASHBOARD}.json"
    echo "Using default GitHub repository information..."
    
    # Default GitHub repository information
    GITHUB_USERNAME="jonschull"
    REPO_NAME="SidebarDashboard"
    GITHUB_REPO="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
    GITHUB_PAGES_URL="https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
    GITHUB_STATUS_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/actions"
fi

echo "GitHub Repository: $GITHUB_REPO"
echo "GitHub Pages URL: $GITHUB_PAGES_URL"

# Make sure the docs directory exists
echo "Checking if docs directory exists..."
if [ ! -d "$ROOT_DIR/docs" ]; then
    echo "Creating docs directory..."
    mkdir -p "$ROOT_DIR/docs"
fi

echo "Copying files from dashboard_content/${ACTIVE_DASHBOARD} to docs..."
# Copy all files from the active dashboard directory to docs
cp -r "$ROOT_DIR/dashboard_content/${ACTIVE_DASHBOARD}/"* "$ROOT_DIR/docs/"

echo "Adding changes to git..."
cd "$ROOT_DIR"
git add docs/

echo "Committing changes..."
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
git commit -m "Update GitHub Pages content for ${ACTIVE_DASHBOARD} - $TIMESTAMP"

echo "Pushing to GitHub..."
git push origin main

echo "==================== PUBLISHING COMPLETE ===================="
echo "Your changes have been pushed to GitHub."
echo "Dashboard: ${ACTIVE_DASHBOARD}"
echo "GitHub Pages URL: $GITHUB_PAGES_URL"
echo "Check deployment status at: $GITHUB_STATUS_URL"
echo ""
echo "IMPORTANT: GitHub Pages deployment is separate from code updates."
echo "Note: It may take a few minutes for changes to appear on GitHub Pages."
