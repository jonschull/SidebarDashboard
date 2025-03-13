# Welcome to the Dashboard

## Quick Start Guide

### Running the Server

1. Start the server by running:
   ```bash
   ./server.py
   ```
   This will start a local server at http://localhost:8080

2. The server will:
   - Serve files from the `docs` directory
   - Handle publishing to GitHub Pages
   - Show real-time feedback during publishing

### Using the Publish Button

The green "Publish Dashboard" button at the top of the sidebar will:

1. Ask for confirmation before publishing
2. Show real-time output while publishing
3. Update the button to "Update Dashboard" after first publish
4. Display the live URL when complete

### Important Notes

- Changes are published to GitHub Pages via `publish_dashboard.sh`
- The docs directory contains the live site content
- It may take a few minutes for changes to appear on GitHub Pages
- You can check deployment status in GitHub Actions

### Getting Help

If you encounter any issues:
1. Make sure the server is running (`./server.py`)
2. Check the console for error messages
3. Try running `publish_dashboard.sh` directly from terminal
