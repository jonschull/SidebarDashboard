# Multiple Dashboard Management Design

## Overview

This document outlines a simple approach for managing multiple dashboards within a single SidebarDashboard project folder using symbolic links. This design allows users to easily switch between different document sets without duplicating the entire project structure or modifying the server.

## Core Design: Symbolic Link Approach

### Key Principles
- Maintain a single codebase/installation
- Use symbolic links to swap document sets
- Keep the server configuration unchanged
- Ensure publishing targets the correct GitHub repository

### Implementation

1. **Directory Structure**
   ```
   SidebarDashboard/
   ├── working-version/
   │   ├── docs/ -> ../dashboard_content/dashboard1/  (symbolic link)
   │   └── ...
   ├── dashboard_content/
   │   ├── dashboard1/
   │   │   ├── index.html
   │   │   ├── sidebar.md
   │   │   └── ...
   │   ├── dashboard2/
   │   │   ├── index.html
   │   │   ├── sidebar.md
   │   │   └── ...
   │   └── ...
   ├── dashboard_config/
   │   ├── dashboard1.json  (contains GitHub repo info)
   │   ├── dashboard2.json
   │   └── ...
   └── ...
   ```

2. **Dashboard Switching**
   - A simple script removes the existing symbolic link
   - Creates a new symbolic link pointing to the selected dashboard directory
   - Updates a config file to track the active dashboard
   - Server continues to serve from `working-version/docs/` as it always has

3. **Publishing to Correct GitHub Pages**
   - Each dashboard has a configuration file with GitHub repository details
   - When publishing, the system reads the config for the active dashboard
   - Git commands use the correct repository information for the current dashboard
   - Ensures changes are pushed to the appropriate GitHub Pages site

## Implementation Plan

### Phase 1: Test Implementation
- Create test directories with sample content
- Implement symbolic link switching
- Verify server correctly serves content through the symbolic link

### Phase 2: Dashboard Configuration
- Add configuration files for each dashboard
- Modify publish script to read active dashboard config
- Ensure git operations target the correct repository

### Phase 3: User Interface
- Add simple dropdown to select dashboards
- Create dashboard management UI (create/rename/delete)
- Implement dashboard switching from the UI

## Advantages of This Approach

1. **Simplicity**: No server modifications required
2. **Reliability**: Uses standard OS features (symbolic links)
3. **Compatibility**: Works with existing Author/Development modes
4. **Flexibility**: Each dashboard can have its own GitHub repository
5. **Minimal Changes**: Preserves the current workflow and functionality

This design follows our key principles: trust working solutions, avoid over-engineering, focus on clean implementation, and use a simple testing approach.
