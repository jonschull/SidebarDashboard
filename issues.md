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

### 2. False Server Status Reporting (High Priority)
- **Description**: The `quick-test.sh` script reports "Server stopped" without properly verifying that the server process has actually terminated.
- **Reproduction Steps**: 
  1. Run `./quick-test.sh start` to start the server
  2. Run `./quick-test.sh stop` to stop the server (script reports "Server stopped")
  3. Run `lsof -i:8080` (may show no output, falsely suggesting server is stopped)
  4. Try to start the server again with `python3 http_server_nocache.py`
  5. Observe "Address already in use" error, revealing the server was never stopped
- **Impact**: 
  - Misleading status messages cause confusion
  - Subsequent server starts fail because port is still in use
  - Difficult to debug server issues when status reporting is unreliable
- **Possible Causes**:
  - Script doesn't wait for process termination before reporting success
  - Single verification method (kill command) without checking actual port status
  - No retry logic to handle delayed process termination
  - `lsof` command may not always detect active server processes reliably
- **Potential Solutions**:
  - Implement multiple verification methods (process check, port check, connection attempt)
  - Add retry logic with appropriate timeouts
  - Only report success after confirming through multiple independent checks
  - Provide accurate error messages when verification fails

## Workspace Issues

### 3. Ugly Execute Task Message (Low Priority)
- **Description**: Double-clicking on workspace files (development-mode.code-workspace and author-mode.code-workspace) shows an ugly execute task message.
- **Impact**: Poor user experience when opening workspace files.
- **Current Workaround**: Created a workspace_init.sh script that handles mode initialization.
- **Potential Solutions**:
  - Further investigate VSCode task execution behavior
  - Consider alternative approaches to workspace initialization
