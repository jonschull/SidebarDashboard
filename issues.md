# SidebarDashboard Issues

This document tracks known issues and bugs in the SidebarDashboard project.

## Server Issues

### 1. Unreliable Server Startup (Low Priority)
- **Description**: The `quick-test.sh` script doesn't reliably start the server. After running the script, the server page is only reachable about every 3rd attempt.
- **Reproduction Steps**: 
  1. Run `./quick-test.sh`
  2. Press Ctrl+C to stop
  3. Run it again
  4. Try to access http://localhost:8080
- **Impact**: Users may need to restart the server multiple times before it becomes accessible.
- **Possible Causes**:
  - Port 8080 might not be fully released between restarts
  - Server process might not be properly terminated
  - Race condition in server initialization
  - **Observation**: The server may simply need more time to start up than currently allowed
- **Potential Solutions**:
  - Add a more robust port checking mechanism
  - Implement a proper server shutdown procedure
  - Add longer delays between server shutdown and restart
  - **Consider**: Increase the wait time after server startup before checking if it's accessible
  - Consider using a more reliable server implementation

## Workspace Issues

### 2. Ugly Execute Task Message (Low Priority)
- **Description**: Double-clicking on workspace files (development-mode.code-workspace and author-mode.code-workspace) shows an ugly execute task message.
- **Impact**: Poor user experience when opening workspace files.
- **Current Workaround**: Created a workspace_init.sh script that handles mode initialization.
- **Potential Solutions**:
  - Further investigate VSCode task execution behavior
  - Consider alternative approaches to workspace initialization
