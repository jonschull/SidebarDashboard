# Sidebar Dashboard

A Flask-based dashboard with a persistent sidebar and content area, featuring Markdown-based sidebar configuration.

## Features

- Persistent sidebar that stays visible at all times
- Content area that can display both local and external content
- External websites open in a new browser window positioned to the right of the sidebar
- Markdown-based sidebar configuration for easy authoring
- Automatic link handling based on URL type
- Real-time sidebar updates when the markdown file changes
- Clean separation of concerns with external CSS and JavaScript files

## Files

- `app.py` - The Flask application that serves the dashboard
- `sidebar.md` - Markdown file for configuring the sidebar content
- `templates/sidebar.html` - The sidebar template that renders the markdown content
- `templates/sample_content.html` - Example local content
- `templates/matrix_view.html` - Example data matrix view
- `static/css/styles.css` - CSS styles for the dashboard
- `static/js/sidebar.js` - JavaScript for handling sidebar interactions

## How to Use

1. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the Flask application:
   ```bash
   python app.py
   ```

3. Edit the `sidebar.md` file to customize your sidebar:
   - Use standard Markdown syntax
   - Add `{: .external}` after external links to mark them as external
   - Local links will load in the content frame
   - External links will open in a new browser window

## Sidebar Markdown Format

```markdown
# Dashboard Title

## Section Title
- [Local Link](/local_content/page)
- [External Link](https://example.com){: .external}

## Another Section
- [Another Local Link](/local_content/another)
```

## Running the Dashboard

The dashboard automatically opens in your default browser when you run the application. The server runs on http://localhost:8081 by default.

## Development

- The sidebar content is automatically refreshed when you edit the `sidebar.md` file
- You can add new local content by creating HTML files in the `templates` directory and adding routes in `app.py`
- CSS and JavaScript can be modified in the `static` directory

## Requirements

- Python 3.6+
- Flask
- Markdown
- Watchdog
