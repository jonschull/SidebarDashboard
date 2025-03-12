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

## Dashboard Management

### Creating New Dashboards

The project uses a template-based approach with symbolic links to manage multiple dashboards:

1. The `test_dashboard` serves as the template for new dashboards
2. Shared resources (JS, CSS) are linked rather than copied to ensure consistency
3. Only dashboard-specific content needs to be customized

#### Creating a New Dashboard

```bash
# Replace "new_dashboard_name" with your dashboard name
NEW_DASHBOARD="new_dashboard_name"
TEMPLATE_DIR="dashboard_content/test_dashboard"
TARGET_DIR="dashboard_content/$NEW_DASHBOARD"

# Create the dashboard directory
mkdir -p "$TARGET_DIR"

# Create content files (these are dashboard-specific)
cp "$TEMPLATE_DIR/index.html" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/test.html" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/sidebar.md" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/welcome.md" "$TARGET_DIR/"
cp "$TEMPLATE_DIR/dashboard_config.js" "$TARGET_DIR/"

# Create directories for shared resources
mkdir -p "$TARGET_DIR/js"
mkdir -p "$TARGET_DIR/css"

# Create symbolic links to shared resources
ln -sf "../../test_dashboard/js/viewer.js" "$TARGET_DIR/js/viewer.js"
ln -sf "../../test_dashboard/css/styles.css" "$TARGET_DIR/css/styles.css"

# Update dashboard configuration
# Edit $TARGET_DIR/dashboard_config.js with appropriate settings
```

#### Updating Core Files

When core files (like viewer.js) are updated in the template dashboard, all other dashboards automatically get the updates through the symbolic links.

### Dashboard Configuration

Each dashboard has its own `dashboard_config.js` file with settings for:
- Dashboard name
- GitHub repository information
- Publication status

## Documentation

For detailed documentation on how to use and develop for SidebarDashboard, see the [welcome.md](/working-version/docs/welcome.md) file.
