# SidebarDashboard

A simple, clean static dashboard with a markdown sidebar for GitHub Pages.

## Project Modes

This project supports two distinct working modes:

### Author Mode (Recommended for Content Creation)
- **Working Directory**: `/working-version/docs/`
- **For**: Content creators, writers, and documentation authors
- **Focus**: Creating and editing markdown content
- **Start Here**: [Author Mode Directory](/working-version/docs/)

### Development Mode (Current Directory)
- **Working Directory**: Project root (current directory)
- **For**: Developers and system administrators
- **Focus**: Modifying the system architecture, server, and scripts
- **Be Careful**: Changes here affect the underlying system

## Directory Structure

- `/docs/` - **DO NOT EDIT DIRECTLY** - GitHub Pages published content
- `/working-version/` - Development environment
  - `/working-version/docs/` - Content files to edit (Author Mode)
  - `/working-version/http_server_nocache.py` - Server implementation
  - `/working-version/publish.sh` - Publishing script
  - `/working-version/quick-test.sh` - Server management script

## Getting Started

1. For content creation, navigate to the Author Mode directory:
   ```
   cd working-version/docs
   ```

2. For system development, stay in this directory and use:
   ```
   cd working-version
   ./quick-test.sh
   ```

3. Access the dashboard at http://localhost:8080

## Key Features

- Fixed-width sidebar with markdown navigation
- Auto-refresh for content changes
- One-click publishing to GitHub Pages
- Clean, minimal implementation

## Documentation

For detailed documentation on how to use and develop for SidebarDashboard, see the [welcome.md](/working-version/docs/welcome.md) file.
