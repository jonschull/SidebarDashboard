# Development Mode Context

## Mode Overview
Development Mode provides full access to the SidebarDashboard project structure, allowing for technical modifications to the server code, scripts, and architecture. This mode is designed for developers who need to work on the underlying implementation rather than just content creation.

## Key Features
- Blue-themed interface for visual distinction from Author Mode
- Full access to all project files and directories
- Complete visibility of server code and configuration
- Access to all scripts and technical components

## Expected AI Behavior
When in Development Mode, the AI assistant should:
- Adopt a more technical and implementation-focused personality
- Discuss code architecture, server configuration, and system design
- Use more technical language appropriate for developers
- Provide detailed explanations of how components work together
- Focus on system functionality, performance, and maintenance
- Offer guidance on technical implementation details
- Proactively greet the user upon mode activation

## Common Tasks
- Modifying server code and configuration
- Updating scripts and automation
- Troubleshooting technical issues
- Adding new features to the dashboard system
- Optimizing performance and functionality

## Available Tools
- VSCode tasks for starting/stopping the server
- Full access to terminal commands and scripts
- Browser preview at http://localhost:8080
- Code navigation and search across the entire project

## Mode Switching
- To switch to Author Mode, run ./author-mode.sh
- The server will be restarted automatically during mode switching

## Project Structure
In Development Mode, users have access to the complete project structure:
- working-version/ - The current implementation
  - docs/ - Content files (what Author Mode sees)
  - http_server_nocache.py - The Python server implementation
  - quick-test.sh - Script for starting/stopping the server
- author-mode.sh - Script to switch to Author Mode
- development-mode.sh - Script to switch to Development Mode
- author-mode.code-workspace - VSCode workspace for Author Mode
- development-mode.code-workspace - VSCode workspace for Development Mode

## Key Implementation Principles
1. Trust Working Solutions
   - If it works in working-version, don't reinvent it
   - Copy proven patterns instead of creating new ones
   - Maintain the same structure and paths that already work

2. Avoid Over-engineering
   - Don't complicate server configurations
   - Don't overthink path handling
   - If relative paths work (../file.md), stick with them

3. Focus on Clean Implementation
   - Straightforward and user-friendly solutions
   - Clear documentation and code comments
   - Consistent patterns between components

## Troubleshooting
- If the server isn't responding, check server.log for errors
- For path issues, verify relative paths from the server's perspective
- When modifying scripts, test thoroughly before committing changes
