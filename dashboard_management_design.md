# Multiple Dashboard Management Design

## Overview

This document outlines a design for managing multiple dashboards within a single SidebarDashboard project folder, allowing users to easily switch between different document sets without duplicating the entire project structure.

## User Scenarios

### Scenario 1: Content Creator with Multiple Projects
A writer maintains several distinct projects (e.g., a technical documentation site, a personal blog, and a project portfolio). They want to use SidebarDashboard for all projects but need to easily switch between them without managing multiple installations.

### Scenario 2: Team Member Working on Multiple Dashboards
A team member contributes to several dashboards (e.g., department documentation, project documentation, and training materials). They need to switch between these dashboards during their workday without changing directories or workspaces.

### Scenario 3: Developer Maintaining Multiple Client Dashboards
A developer maintains dashboards for multiple clients. Each dashboard has its own content, structure, and GitHub repository, but the developer wants to use the same tooling and workflow for all of them.

## Implementation Considerations

### Core Principles
- Maintain a single codebase/installation
- Keep dashboard content sets separate and swappable
- Preserve the existing Author/Development mode distinction
- Follow our key principles: trust working solutions, avoid over-engineering, focus on clean implementation

## Proposed Solution: Dashboard Profiles

### Design Overview

1. **Dashboard Profiles System**
   - Each dashboard is a "profile" with its own content directory
   - Profiles are stored in a `dashboards/` directory at the project root
   - Each profile contains:
     - `docs/` - The content displayed in the dashboard
     - `metadata.json` - Configuration, GitHub repo info, and other settings
     - `sidebar.md` - The sidebar content specific to this dashboard

2. **Profile Selection Mechanism**
   - Add a dropdown menu to the top of the sidebar
   - Store the active profile in a configuration file
   - Provide a simple UI for creating new profiles

3. **Server Enhancements**
   - Modify the server to serve content from the active profile's directory
   - Add API endpoints for profile management (list, switch, create, etc.)

## User Flow Diagram

```
┌─────────────────────┐
│                     │
│  Launch Dashboard   │
│                     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐     ┌─────────────────────┐
│                     │     │                     │
│  Select Dashboard   │────▶│  Switch Content     │
│  from Dropdown      │     │  Directory          │
│                     │     │                     │
└─────────────────────┘     └──────────┬──────────┘
                                       │
                                       ▼
┌─────────────────────┐     ┌─────────────────────┐
│                     │     │                     │
│  Edit Content       │◀────│  Reload Dashboard   │
│  (Author Mode)      │     │  with New Content   │
│                     │     │                     │
└─────────────────────┘     └─────────────────────┘
           │
           ▼
┌─────────────────────┐     ┌─────────────────────┐
│                     │     │                     │
│  Publish Dashboard  │────▶│  Push to Correct    │
│                     │     │  GitHub Repository  │
│                     │     │                     │
└─────────────────────┘     └─────────────────────┘
```

## Technical Implementation

### 1. Directory Structure

```
SidebarDashboard/
├── working-version/
│   ├── http_server_nocache.py
│   └── ...
├── dashboards/
│   ├── default/
│   │   ├── docs/
│   │   │   ├── index.html
│   │   │   └── ...
│   │   ├── sidebar.md
│   │   └── metadata.json
│   ├── dashboard2/
│   │   ├── docs/
│   │   │   └── ...
│   │   ├── sidebar.md
│   │   └── metadata.json
│   └── ...
├── active_dashboard.json
└── ...
```

### 2. Dashboard Switching Logic

1. User selects a dashboard from the dropdown
2. Client-side JavaScript sends a request to the server
3. Server updates `active_dashboard.json`
4. Server redirects to the dashboard page, now serving from the new content directory
5. Sidebar displays the content from the selected dashboard's `sidebar.md`

### 3. Publishing Logic

1. User clicks "Publish" button
2. System reads the GitHub repository information from the active dashboard's `metadata.json`
3. Git commands are executed to push changes to the correct repository
4. Confirmation message shows the specific GitHub Pages URL for that dashboard

## Implementation Phases

### Phase 1: Basic Profile Support
- Create the `dashboards/` directory structure
- Modify the server to read from the active dashboard
- Implement a simple profile switcher in the UI

### Phase 2: Profile Management
- Add UI for creating new dashboard profiles
- Implement dashboard metadata editing
- Add dashboard deletion/renaming capabilities

### Phase 3: Enhanced Publishing
- Update the publishing system to handle multiple GitHub repositories
- Add repository management features
- Implement dashboard-specific settings

## Compatibility Considerations

- Existing content will be migrated to the `dashboards/default/` directory
- Current workflows (Author Mode, Development Mode) remain unchanged
- Server modifications will be minimal and focused on the content source

This design maintains the simplicity of the current system while adding the flexibility to manage multiple dashboards from a single installation.
