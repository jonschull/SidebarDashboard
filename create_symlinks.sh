#!/bin/bash

# Script to implement the symlink architecture as documented
# This will:
# 1. Back up existing js and css directories for each dashboard
# 2. Create symlinks from each dashboard to dashboard_inclusions

# Set script to exit on error
set -e

# Get the script directory (project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DASHBOARD_DIR="$SCRIPT_DIR/dashboard_content"
INCLUSIONS_DIR="$SCRIPT_DIR/dashboard_inclusions"
BACKUP_DIR="$SCRIPT_DIR/backup_$(date +%Y%m%d%H%M%S)"

# Create backup directory
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"

# Process each dashboard
for dashboard in "$DASHBOARD_DIR"/*; do
    if [ -d "$dashboard" ]; then
        dashboard_name=$(basename "$dashboard")
        echo "Processing dashboard: $dashboard_name"
        
        # Handle js directory
        if [ -d "$dashboard/js" ]; then
            if [ -L "$dashboard/js" ]; then
                echo "  js is already a symlink, skipping..."
            else
                echo "  Backing up js directory..."
                mkdir -p "$BACKUP_DIR/$dashboard_name"
                
                # Check if directory is empty or contains only symlinks
                file_count=$(find "$dashboard/js" -type f | wc -l)
                if [ "$file_count" -eq 0 ]; then
                    echo "  js directory is empty or contains only symlinks, removing without backup..."
                else
                    # Copy files, ignoring errors from symlinks
                    cp -r "$dashboard/js" "$BACKUP_DIR/$dashboard_name/" 2>/dev/null || true
                fi
                
                # Remove the original js directory
                rm -rf "$dashboard/js"
                
                # Create symlink
                echo "  Creating js symlink..."
                cd "$dashboard"
                ln -s "../../dashboard_inclusions/js" "js"
            fi
        else
            # Directory doesn't exist, create the symlink
            echo "  js directory doesn't exist, creating symlink..."
            cd "$dashboard"
            ln -s "../../dashboard_inclusions/js" "js"
        fi
        
        # Handle css directory
        if [ -d "$dashboard/css" ]; then
            if [ -L "$dashboard/css" ]; then
                echo "  css is already a symlink, skipping..."
            else
                echo "  Backing up css directory..."
                mkdir -p "$BACKUP_DIR/$dashboard_name"
                
                # Check if directory is empty or contains only symlinks
                file_count=$(find "$dashboard/css" -type f | wc -l)
                if [ "$file_count" -eq 0 ]; then
                    echo "  css directory is empty or contains only symlinks, removing without backup..."
                else
                    # Copy files, ignoring errors from symlinks
                    cp -r "$dashboard/css" "$BACKUP_DIR/$dashboard_name/" 2>/dev/null || true
                fi
                
                # Remove the original css directory
                rm -rf "$dashboard/css"
                
                # Create symlink
                echo "  Creating css symlink..."
                cd "$dashboard"
                ln -s "../../dashboard_inclusions/css" "css"
            fi
        else
            # Directory doesn't exist, create the symlink
            echo "  css directory doesn't exist, creating symlink..."
            cd "$dashboard"
            ln -s "../../dashboard_inclusions/css" "css"
        fi
    fi
done

echo "Symlink creation complete!"
echo "Backups stored in: $BACKUP_DIR"
echo "All dashboards now use symlinks to shared resources in dashboard_inclusions."
