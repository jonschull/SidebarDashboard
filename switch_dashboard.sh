#!/bin/bash
# Dashboard switching script using symbolic links

# Configuration
WORKING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_LINK="${WORKING_DIR}/working-version/docs"
DASHBOARD_CONTENT="${WORKING_DIR}/dashboard_content"
CONFIG_DIR="${WORKING_DIR}/dashboard_config"
ACTIVE_CONFIG="${WORKING_DIR}/active_dashboard.txt"

# Function to display usage information
usage() {
    echo "Usage: $0 <dashboard_name>"
    echo "Available dashboards:"
    ls -1 "${DASHBOARD_CONTENT}"
    exit 1
}

# Check if dashboard name is provided
if [ -z "$1" ]; then
    usage
fi

DASHBOARD="$1"

# Check if the dashboard exists
if [ ! -d "${DASHBOARD_CONTENT}/${DASHBOARD}" ]; then
    echo "Error: Dashboard '${DASHBOARD}' not found in ${DASHBOARD_CONTENT}"
    usage
fi

# Check if docs is already a symbolic link and remove it
if [ -L "${DOCS_LINK}" ]; then
    echo "Removing existing symbolic link..."
    rm "${DOCS_LINK}"
elif [ -d "${DOCS_LINK}" ]; then
    echo "Warning: docs directory is not a symbolic link. Backing up..."
    BACKUP_DIR="${WORKING_DIR}/docs_backup_$(date +%Y%m%d%H%M%S)"
    mv "${DOCS_LINK}" "${BACKUP_DIR}"
    echo "Backed up to ${BACKUP_DIR}"
fi

# Create the symbolic link
echo "Switching to dashboard: ${DASHBOARD}"
ln -s "${DASHBOARD_CONTENT}/${DASHBOARD}" "${DOCS_LINK}"

# Save the active dashboard name
echo "${DASHBOARD}" > "${ACTIVE_CONFIG}"

# Create dashboard config file if it doesn't exist
if [ ! -f "${CONFIG_DIR}/${DASHBOARD}.json" ]; then
    echo "Creating default config for ${DASHBOARD}..."
    cat > "${CONFIG_DIR}/${DASHBOARD}.json" << EOF
{
    "name": "${DASHBOARD}",
    "github_repo": "https://github.com/username/${DASHBOARD}.git",
    "github_pages_url": "https://username.github.io/${DASHBOARD}",
    "description": "Configuration for ${DASHBOARD} dashboard"
}
EOF
    echo "Created default config. Please edit ${CONFIG_DIR}/${DASHBOARD}.json with your GitHub repository details."
fi

# Check if server is running and restart it to pick up the new symbolic link
if lsof -ti:8080 >/dev/null 2>&1; then
    echo "Restarting server to pick up the new dashboard..."
    # Kill the existing server process
    pkill -f http_server_nocache.py
    
    # Wait a moment for the process to terminate
    sleep 1
    
    # Start the server again
    cd "${WORKING_DIR}/working-version" && python3 http_server_nocache.py > /dev/null 2>&1 &
    
    # Wait a moment for the server to start
    sleep 2
    
    # Check if the server started successfully
    if lsof -ti:8080 >/dev/null 2>&1; then
        echo "Server restarted successfully."
        echo "Dashboard is now available at http://localhost:8080"
    else
        echo "Warning: Server failed to restart. Please start it manually with:"
        echo "cd ${WORKING_DIR} && ./workspace_init.sh"
    fi
else
    echo "Server is not running. To start it, run:"
    echo "cd ${WORKING_DIR} && ./workspace_init.sh"
fi

echo "Dashboard switched successfully to ${DASHBOARD}"
