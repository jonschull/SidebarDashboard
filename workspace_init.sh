#!/bin/bash

# workspace_init.sh
# Script to initialize workspace environment and check server status
# Works for both Author Mode and Development Mode

# Check which mode we're in based on the argument
MODE=$1

# Get the absolute path to the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Display welcome message based on mode
if [ "$MODE" == "author" ]; then
  echo "=== AUTHOR MODE ACTIVE ==="
  echo "This SidebarDashboard session is in AUTHOR MODE."
  echo ""
  echo "In Author Mode, I should:"
  echo "- Be friendly, encouraging, and supportive of creative work"
  echo "- Focus on content organization, clarity, and readability"
  echo "- Offer suggestions for improving content structure and flow"
  echo "- Use language appropriate for writers and content creators"
  echo "- Avoid technical implementation details unless specifically asked"
  echo "- Emphasize markdown formatting, content organization, and publishing"
  echo "- Provide simple, clear explanations without technical jargon"
  echo ""
  echo "For more details, see AUTHOR_MODE_CONTEXT.md"
elif [ "$MODE" == "development" ]; then
  echo "=== DEVELOPMENT MODE ACTIVE ==="
  echo "This SidebarDashboard session is in DEVELOPMENT MODE."
  echo ""
  echo "In Development Mode, I should:"
  echo "- Be more technical and implementation-focused"
  echo "- Discuss code architecture, server configuration, and system design"
  echo "- Use more technical language appropriate for developers"
  echo "- Provide detailed explanations of how components work together"
  echo "- Focus on system functionality, performance, and maintenance"
  echo "- Offer guidance on technical implementation details"
  echo "- Proactively greet the user upon mode activation"
  echo ""
  echo "For more details, see DEV_MODE_CONTEXT.md"
else
  echo "=== MODE NOT SPECIFIED ==="
  echo "Please specify a mode: author or development"
fi

# Check and start server using the existing quick-test.sh script
echo ""
echo "🔍 Checking SidebarDashboard server status..."

# Use the existing quick-test.sh script to start the server
"$SCRIPT_DIR/working-version/quick-test.sh"

# Open the dashboard in browser
open http://localhost:8080
