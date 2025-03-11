#!/bin/bash

# publish.sh - Simple script to publish changes to GitHub Pages
# 
# This script:
# 1. Copies all files from working-version/docs to docs
# 2. Adds all changes to git
# 3. Commits with a timestamp
# 4. Pushes to GitHub
#
# IMPORTANT: This is separate from regular git pushes.
# Regular code updates do NOT automatically update the GitHub Pages site.
# Only this publish script will update the live site.

# Set script to exit immediately if any command fails
set -e

# GitHub repository information
GITHUB_USERNAME="jonschull"
GITHUB_REPO="SidebarDashboard"
GITHUB_PAGES_URL="https://${GITHUB_USERNAME}.github.io/${GITHUB_REPO}/"
GITHUB_STATUS_URL="https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}/actions"

echo "==================== PUBLISHING TO GITHUB PAGES ===================="
echo "Starting publish process..."

# Get the root directory of the repository
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo "Repository root: $ROOT_DIR"

# Make sure the docs directory exists
echo "Checking if docs directory exists..."
if [ ! -d "$ROOT_DIR/docs" ]; then
    echo "Creating docs directory..."
    mkdir -p "$ROOT_DIR/docs"
fi

echo "Copying files from working-version/docs to docs..."
# Copy all files from working-version/docs to docs
cp -r "$ROOT_DIR/working-version/docs/"* "$ROOT_DIR/docs/"

echo "Adding changes to git..."
cd "$ROOT_DIR"
git add docs/

echo "Committing changes..."
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
git commit -m "Update GitHub Pages content - $TIMESTAMP"

echo "Pushing to GitHub..."
git push origin main

echo "==================== PUBLISHING COMPLETE ===================="
echo "Your changes have been pushed to GitHub."
echo "GitHub Pages URL: $GITHUB_PAGES_URL"
echo "Check deployment status at: $GITHUB_STATUS_URL"
echo ""
echo "IMPORTANT: GitHub Pages deployment is separate from code updates."
echo "Note: It may take a few minutes for changes to appear on GitHub Pages."
