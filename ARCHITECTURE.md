# SidebarDashboard Architecture

## Core Principles
- Keep solutions simple, not over-engineered
- Trust working solutions (GitHub Pages)
- Focus on clean implementation
- Use markdown for content

## Directory Structure

```
SidebarDashboard/
├── Core Server Files
│   ├── server.py                # Main HTTP server implementation
│   ├── simple_server.py         # Simplified server with publish endpoint
│   ├── test_simple_server.py    # Server tests
│   ├── start_server.sh          # Server startup script
│   └── check_server.sh          # Server status verification
├── Dashboard Management
│   ├── create-dashboard.sh      # Creates new dashboards
│   ├── publish_dashboard.sh     # Publishes to GitHub Pages
│   ├── switch_dashboard.sh      # Switches active dashboard
│   └── active_dashboard.txt     # Tracks current dashboard
├── Mode Management
│   ├── author-mode.sh          # Enter author mode
│   ├── development-mode.sh      # Enter development mode
│   ├── author-mode.code-workspace    # Author VSCode config
│   ├── development-mode.code-workspace # Dev VSCode config
│   └── workspace_init.sh        # Workspace initialization
├── Documentation
│   ├── README.md               # Project overview
│   ├── ARCHITECTURE.md         # System architecture (this file)
│   ├── considerations.md       # Design decisions
│   ├── issues.md              # Known issues
│   └── dashboard_management_design.md # Dashboard system design
├── Mode Context
│   ├── AUTHOR_MODE_ACTIVE.md   # Author mode status
│   ├── AUTHOR_MODE_CONTEXT.md  # Author mode guidelines
│   ├── AUTHOR_MODE_INSTRUCTIONS.md # Author instructions
│   ├── DEVELOPMENT_MODE_ACTIVE.md  # Dev mode status
│   └── DEV_MODE_CONTEXT.md     # Dev mode guidelines
├── Version Control
│   ├── .gitignore             # Git ignore patterns
│   └── .ai-instructions.md    # AI assistant guidelines
├── dashboard_content/          # All dashboards live here
│   ├── dashboard1/            # Each dashboard is self-contained
│   │   ├── index.html        # Entry point
│   │   ├── dashboard_config.js
│   │   ├── sidebar.md        # Navigation content
│   │   ├── welcome.md        # Landing page
│   │   ├── css/ -> ../../dashboard_inclusions/css/  # Symlink
│   │   └── js/  -> ../../dashboard_inclusions/js/   # Symlink
│   └── dashboard2/
│       └── ...
└── dashboard_inclusions/      # Shared resources
    ├── css/
    │   └── styles.css        # Common styles
    ├── js/
    │   └── viewer.js         # Core dashboard functionality
    ├── index.html           # Template for new dashboards
    └── dashboard_config.js   # Template for new dashboards
```

## Key Components

### 1. Server (simple_server.py)
- Serves files from `dashboard_content/`
- Handles `/publish/<dashboard>` requests
- No path manipulation needed - matches GitHub Pages structure
- Must be started from project root to find publish script

### 2. Shared Resources
- Live in `dashboard_inclusions/`
- Each dashboard symlinks to these via relative paths:
  - `css/ -> ../../dashboard_inclusions/css/`
  - `js/ -> ../../dashboard_inclusions/js/`
- Symlinks ensure:
  - Single source of truth for code
  - Easy updates across all dashboards
  - Proper GitHub Pages publishing

### 3. Dashboard Structure
Each dashboard has:
- `index.html`: Entry point
- `dashboard_config.js`: Dashboard-specific settings
- `sidebar.md`: Navigation in markdown
- `welcome.md`: Landing page content
- Symlinked `css/` and `js/` directories

### 4. Publishing System

#### Flow
1. User clicks "Publish Dashboard" button in UI
2. Button shows confirmation dialog
3. On confirm, calls `/publish/<dashboard>`
4. Server runs `publish_dashboard.sh`
5. Script commits and pushes dashboard_content directly
6. Real-time output shown in popup window

#### URLs
- Local Development: `http://localhost:8080/<dashboard>`
- Published: `https://<username>.github.io/SidebarDashboard/<dashboard>/`

## Root Directory Files

### Core Server Files
- `server.py`: Main HTTP server implementation
- `simple_server.py`: Simplified server with publish endpoint support
- `test_simple_server.py`: Tests for the simple server implementation
- `start_server.sh`: Script to start the server from the correct directory
- `check_server.sh`: Utility to verify server status and port availability

### Dashboard Management
- `create-dashboard.sh`: Script to create new dashboards with proper structure
- `publish_dashboard.sh`: Handles publishing dashboards to GitHub Pages
- `switch_dashboard.sh`: Tool for switching between different dashboards
- `active_dashboard.txt`: Tracks which dashboard is currently active

### Mode Management
- `author-mode.sh`: Script to enter author mode for content creation
- `development-mode.sh`: Script to enter development mode for system changes
- `author-mode.code-workspace`: VSCode workspace config for author mode
- `development-mode.code-workspace`: VSCode workspace config for development mode
- `workspace_init.sh`: Initializes workspace settings and environment

### Documentation
- `README.md`: Project overview and getting started guide
- `ARCHITECTURE.md`: This file - system architecture documentation
- `considerations.md`: Design considerations and decisions
- `issues.md`: Known issues and their status
- `dashboard_management_design.md`: Design doc for dashboard management system

### Mode Context Files
- `AUTHOR_MODE_ACTIVE.md`: Indicates author mode is currently active
- `AUTHOR_MODE_CONTEXT.md`: Context and guidelines for author mode
- `AUTHOR_MODE_INSTRUCTIONS.md`: Detailed instructions for authors
- `DEVELOPMENT_MODE_ACTIVE.md`: Indicates development mode is active
- `DEV_MODE_CONTEXT.md`: Context and guidelines for development mode

### Version Control
- `.gitignore`: Specifies which files Git should ignore
- `.ai-instructions.md`: Instructions for AI assistants (like me)

## Core Files

### Server Files
- `simple_server.py`: HTTP server and publish endpoint
- `start_server.sh`: Ensures server starts from correct directory

### Dashboard Management
- `create-dashboard.sh`: Creates new dashboard with proper structure
- `publish_dashboard.sh`: Publishes dashboard to GitHub Pages

### Templates
- `dashboard_inclusions/index.html`: Base dashboard HTML
- `dashboard_inclusions/dashboard_config.js`: Dashboard settings template

### Core Logic
- `viewer.js`: 
  - Renders markdown
  - Handles navigation
  - Manages publish button
  - Shows real-time publish status

## Publishing Details

### What publish_dashboard.sh Should Do
1. Verify dashboard exists in `dashboard_content/`
2. Stage all changes in `dashboard_content/`
3. Commit changes with clear message
4. Push to GitHub Pages branch
5. Output clear status messages

### How Publishing Gets Triggered
1. Dashboard config sets `publishStatus` and URLs:
```javascript
window.DASHBOARD_CONFIG = {
    name: 'dashboard1',
    githubUsername: 'username',
    githubRepo: 'SidebarDashboard',
    githubPagesUrl: 'https://username.github.io/SidebarDashboard/dashboard1/',
    githubStatusUrl: 'https://github.com/username/SidebarDashboard/actions',
    publishStatus: 'unpublished' // Changes to 'published' after first publish
};
```

2. Viewer.js uses this config to:
   - Show correct button text ("Publish" or "Update")
   - Display correct GitHub Pages URL
   - Call correct publish endpoint
   - Update button state after publish

3. Server handles publish request:
```python
# In simple_server.py
if path.startswith('/publish/'):
    dashboard = path[9:]  # Remove /publish/
    result = subprocess.run(['./publish_dashboard.sh', dashboard],
                          capture_output=True,
                          text=True,
                          cwd=self.base_path)
```

## Development Notes
- Always run server from project root
- Test symlinks work before publishing
- Verify both local and GitHub Pages URLs
- Keep publish script output clear and informative
- GitHub Pages serves directly from dashboard_content
