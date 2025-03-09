# Welcome to Static Dashboard!

This is a simple, clean static dashboard with a markdown sidebar that allows you to:

1. Create and organize content using markdown files
2. View content in properly positioned windows
3. Publish your changes to GitHub Pages with one click

## Getting Started

### Running the Server

The dashboard requires a local server to function properly. You can start the server by running:

```bash
./quick-test.sh start
```

from the root directory of the project. This will start a server on http://localhost:8080 that serves files from the `docs` directory.

To stop the server, run:

```bash
./quick-test.sh stop
```

### File Structure

All content is served from the `docs` directory:

- `docs/sidebar.md` - The main navigation sidebar content
- `docs/js/viewer.js` - The JavaScript that powers the dashboard
- `docs/css/styles.css` - The styling for the dashboard
- `docs/*.md` - Your markdown content files
- `docs/*.html` - Your HTML content files

### Adding Content

1. Create new markdown (`.md`) or HTML (`.html`) files in the `docs` directory
2. Add links to these files in `sidebar.md`
3. The sidebar will automatically refresh when you update `sidebar.md`

Example sidebar entry:

```markdown
- [My New Page](my-new-page.md)
```

### Publishing to GitHub Pages

When you're ready to publish your changes to GitHub Pages:

1. Click the "Publish to GitHub Pages" button at the top of the sidebar
2. Confirm that you want to publish
3. Wait for the publishing process to complete

Your content will be available at: https://jonschull.github.io/SidebarDashboard/

All previous versions are preserved in the Git history on GitHub.

## Tips

- Markdown files (`.md`) are rendered automatically with proper formatting
- External links open in new windows
- The sidebar is fixed at 300px width
- All content windows open at sidebar + 25px position for clean layout
- Changes to markdown files are reflected immediately when you refresh the page
