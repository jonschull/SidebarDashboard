# SidebarDashboard - Author Mode Instructions

This document explains how to use the Author Mode workspace for SidebarDashboard.

## Opening Author Mode

To enter Author Mode:

1. **From Terminal**: 
   - Navigate to the SidebarDashboard directory
   - Run `./author-mode.sh`
   - This is the recommended method

2. **From Finder**:
   - Double-click the `author-mode.sh` file while holding Control
   - Select "Open" from the context menu
   - Click "Open" in the security dialog
   - This will open VSCode with a green-themed interface
   - Only the content files will be visible in the file explorer

## Starting the Server

Once in Author Mode, you can start the server using VSCode's built-in tasks:

1. You can ask the AI assistant to start the server
2. Or press `Cmd+Shift+B` (or use the menu: Terminal → Run Build Task)
3. This will automatically run the "Start Dashboard Server" task
4. A terminal will open showing the server output
5. The dashboard will be accessible at [http://localhost:8080](http://localhost:8080)

Alternatively, you can:

1. Open the Command Palette (`Cmd+Shift+P`)
2. Type "Tasks: Run Task"
3. Select "Start Dashboard Server"

## Stopping the Server

To stop the server:

1. Open the Command Palette (`Cmd+Shift+P`)
2. Type "Tasks: Run Task"
3. Select "Stop Dashboard Server"

## Editing Content

In Author Mode, you can focus on editing these key files:

- `sidebar.md` - The navigation sidebar
- `welcome.md` - The welcome page content
- Create new .md files for additional content

All changes will automatically refresh in the browser thanks to the auto-refresh functionality.

## Publishing Changes

When you're ready to publish:

1. Click the "Publish to GitHub Pages" button at the top of the sidebar
2. This will copy your content to the GitHub Pages directory and push to GitHub

## Returning to Development Mode

To switch back to Development Mode:

1. From Terminal, run `./development-mode.sh` in the SidebarDashboard directory
2. This will close the current workspace and open the development workspace

## AI Assistant

The AI assistant in Author Mode is configured with a friendly, content-focused personality. It will:

1. Automatically greet you when you open Author Mode
2. Provide guidance on content creation and organization
3. Help with markdown formatting and structure
4. Assist with publishing your content

You do not need to "wake up" the AI by asking "Who are you?" - it should proactively engage with you when you enter Author Mode.
