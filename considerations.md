# SidebarDashboard Architecture Improvements

## Current System Architecture

### Server Setup
1. **Server Root**
   - Server runs from `working-version/http_server_nocache.py`
   - Serves files from `working-version/docs/`
   - This docs directory is a symbolic link to active dashboard

### Dashboard Switching Mechanism
1. **Symlink Strategy**
   - Two types of symlinks:
     a. Content symlinks: `/css` and `/js` in each dashboard point to shared resources
     b. Active dashboard symlink: `working-version/docs` points to current dashboard
   - switch_dashboard.sh manages the active dashboard symlink
   - Server must restart to recognize active dashboard changes

2. **State Management**
   - active_dashboard.txt records current dashboard
   - Used by scripts but not by server
   - Server follows symlink instead of reading this file

### Current Issues
1. Server requires restarts when switching dashboards
2. Two symlinks can get out of sync (root /docs and working-version/docs)
3. Single "active" dashboard doesn't support multiple views
4. Symlink-based switching is fragile

## Proposed Architecture

### URL-Based Dashboard Access
- Clean URLs: `/<dashboard_name>/`
- No global "active" dashboard state
- Support multiple dashboard views simultaneously
- Bookmarkable and shareable URLs

### Server Improvements
1. **Direct Dashboard Selection**
   - Use URLs to select dashboard instead of symlinks
   - Keep existing symlinks for shared resources (/css and /js)
   - Serve dashboard content directly from `dashboard_content/<dashboard_name>/`
   - No restarts needed when switching dashboards

2. **Shared Resources**
   - Keep existing symlink strategy for `/css/` and `/js/`
   - Each dashboard maintains symlinks to shared resources
   - No changes needed to dashboard internal structure

3. **Root URL Handling**
   - Root URL (`/`) shows clickable dashboard list
   - Clicking a dashboard link changes the URL and loads that dashboard
   - Same page serves as fallback for invalid URLs
   - Reuse directory listing code for both root and error cases

### Dashboard Navigation
1. **Two Ways to Switch**
   - Click dashboard links in root directory
   - Use dropdown in dashboard view
   - Both simply change the URL path

2. **Dashboard Discovery**
   - Server scans `dashboard_content/` directory
   - No configuration files needed
   - Automatically handles new/deleted dashboards

## Implementation Steps
1. Verify test_dashboard as our reference implementation
2. Port working content to new dashboard structure
3. Once verified:
   - Remove old dashboard formats
   - Remove active dashboard symlink (keep shared resource symlinks)
   - Update scripts to use URL-based navigation

## Migration Strategy
1. Document test_dashboard as reference implementation
2. Port existing dashboard content to new format
3. Test each dashboard after porting
4. Only after all dashboards work:
   - Remove old dashboard formats
   - Remove active dashboard symlink mechanism
   - Keep shared resource symlinks (/css and /js)

## Testing Approach
1. Start server
2. Verify dashboard directory at root
3. Test navigation via links and dropdown
4. Confirm shared resources work
5. Check multiple windows/dashboards
6. Verify no server restarts needed

## Principles Maintained
- **Trust Working Solutions**:
  - Keep working shared resource symlinks
  - Maintain dashboard internal structure
  - Use standard URL navigation

- **Avoid Over-engineering**:
  - Remove active dashboard symlink
  - Keep simple resource sharing
  - Use standard HTTP patterns

- **Clean Implementation**:
  - Clear URL structure
  - Direct dashboard selection
  - No hidden state

- **Simple Testing**:
  - Easy to verify with browser
  - Clear success criteria
  - No complex state to validate
