# SidebarDashboard Architecture

## Overview
The SidebarDashboard project follows a clean, simple architecture that allows multiple dashboards to coexist under a single GitHub Pages site.

## Key Principles
1. Trust working solutions (GitHub Pages)
2. Avoid over-engineering
3. Focus on clean implementation
4. Simple testing approach

## Structure

### Dashboard Organization
- All dashboards live in `dashboard_content/`
- Each dashboard has its own subdirectory
- Published content goes to `docs/` with subdirectories

### Shared Resources
- Common resources in `dashboard_inclusions/`
  - CSS styles
  - JavaScript utilities
  - Core functionality
- Symlinked into each dashboard

### URLs and Access
- Main repository: github.com/jonschull/SidebarDashboard
- Published dashboards: jonschull.github.io/SidebarDashboard/dashboard_name
- Local development: localhost:8080/dashboard_name

## Core Scripts

### create-dashboard.sh
- Creates new dashboard directory
- Sets up symlinks to shared resources
- Configures dashboard-specific files

### publish_dashboard.sh
- Copies dashboard content to docs/dashboard_name
- Commits and pushes to GitHub
- Updates GitHub Pages

## Modes of Operation

### Reader Mode
- Standard web browsing on GitHub Pages
- No AI assistance needed
- Clean, fast content delivery

### Author Mode
- Content creation with AI assistance
- Markdown editing support
- Publishing guidance

### Development Mode
- Technical implementation details
- Customization support
- Architecture modifications
