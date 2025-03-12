# SidebarDashboard Architecture Improvements

## Current Issues
1. Server requires restarts when switching dashboards
2. Symlink-based dashboard switching is fragile
3. Single "active" dashboard concept doesn't support multiple views
4. Root `/docs` directory adds unnecessary complexity

## Proposed Architecture

### URL-Based Dashboard Access
- Clean URLs: `/<dashboard_name>/`
- No global "active" dashboard state
- Support multiple dashboard views simultaneously
- Bookmarkable and shareable URLs

### Server Improvements
1. **Direct File Serving**
   - Serve directly from `dashboard_content/<dashboard_name>/`
   - Remove symlink complexity
   - No restarts needed when switching dashboards

2. **Shared Resources**
   - `/css/` and `/js/` served from `dashboard_inclusions/`
   - Works from any dashboard URL path
   - Maintains existing relative paths

3. **Root and Error Handling**
   - Root URL (`/`) shows dashboard directory
   - Invalid paths show same directory view
   - Simple HTML links to available dashboards
   - Clean fallback for deleted dashboards

### Dashboard Navigation
1. **Two Ways to Switch**
   - Click directory links
   - Use dropdown in dashboard view
   - Both update URL for consistency

2. **Dashboard Discovery**
   - Server scans `dashboard_content/` directory
   - No configuration files needed
   - Automatically handles new/deleted dashboards

## Implementation Steps
1. Remove `/docs` directory (vestigial)
2. Update server to serve files directly
3. Create dashboard directory view
4. Add dashboard dropdown to UI
5. Update scripts to remove symlink handling

## Testing Approach
1. Start server
2. Verify dashboard directory at root
3. Test navigation via links and dropdown
4. Confirm shared resources work
5. Check multiple windows/dashboards

## Principles Maintained
- **Trust Working Solutions**: URL-based navigation, standard web patterns
- **Avoid Over-engineering**: No state files, simple directory structure
- **Clean Implementation**: Remove complexity, use proven patterns
- **Simple Testing**: Easy to verify with browser and curl
