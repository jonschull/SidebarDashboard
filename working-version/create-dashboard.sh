#!/bin/bash
# create-dashboard.sh
# Creates a new dashboard with shared resources from dashboard_inclusions

# Check if both arguments were provided
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: ./create-dashboard.sh <github_username> <dashboard_name>"
  exit 1
fi

GITHUB_USERNAME="$1"
DASHBOARD_NAME="$2"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SHARED_DIR="../dashboard_inclusions"
TARGET_DIR="../dashboard_content/$DASHBOARD_NAME"
SWITCH_SCRIPT="$(dirname "$SCRIPT_DIR")/switch_dashboard.sh"

# Check if dashboard already exists
if [ -d "$TARGET_DIR" ]; then
  echo "Error: Dashboard '$DASHBOARD_NAME' already exists"
  exit 1
fi

# Create the dashboard directory
echo "Creating new dashboard: $DASHBOARD_NAME"
mkdir -p "$TARGET_DIR"

# Copy template files and replace placeholders
echo "Creating dashboard files..."
for file in "$SHARED_DIR"/*.{html,js,md}; do
  if [ -f "$file" ]; then
    sed -e "s/DASHBOARD_NAME/$DASHBOARD_NAME/g" \
        -e "s/GITHUB_USERNAME/$GITHUB_USERNAME/g" \
        "$file" > "$TARGET_DIR/$(basename "$file")"
  fi
done

# Create symbolic links to shared resources
echo "Creating symbolic links to shared resources..."
cd "$TARGET_DIR"
ln -s "../../dashboard_inclusions/css" css
ln -s "../../dashboard_inclusions/js" js

echo "Dashboard '$DASHBOARD_NAME' created successfully!"

# Switch to the newly created dashboard
echo "Switching to the new dashboard..."
if [ -f "$SWITCH_SCRIPT" ]; then
    "$SWITCH_SCRIPT" "$DASHBOARD_NAME"
else
    echo "Warning: Could not find switch_dashboard.sh script at: $SWITCH_SCRIPT"
    echo "To make this dashboard active, run: ./switch_dashboard.sh $DASHBOARD_NAME"
fi
