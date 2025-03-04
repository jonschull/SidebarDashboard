# Sidebar Dashboard

A dynamic dashboard with a configurable sidebar that can be edited in real-time using markdown.

## Sidebar.md - Quick Guide

The sidebar is controlled by a simple markdown file (`sidebar.md`) that you can edit at any time. The dashboard will automatically refresh to show your changes.

### Link Structure Rules

All links in the sidebar follow these simple rules:

1. **Always include file extensions** in all links:
   - HTML files: `sample.html`, `matrix_view.html`
   - Text files: `document.txt`
   - Markdown files: `README.md`

2. **Special Handling**:
   - Markdown files (.md) are rendered as HTML with styling
   - HTML files are served directly
   - Text files are displayed with formatting
   - Other file types are downloaded or displayed according to browser capabilities

3. **External Links**: Use full URLs starting with http:// or https://
   - These are automatically detected and open in a new window

### Example Sidebar.md

```markdown
# Dashboard

## Local Content

- [Sample Content](sample.html)
- [Test File](test.txt)
- [Matrix View](matrix_view.html)
- [README](README.md)
- [Subfolder File](myfiles/myfile.txt)

## External Links

- [Gmail](https://gmail.com)
- [GitHub](https://github.com)
```

## Features

- **Dynamic Sidebar**: Automatically updates when the sidebar.md file is changed
- **Markdown Support**: Renders markdown files as HTML
- **URL Bar Updates**: The browser URL bar reflects the current content being viewed
- **External Links**: Opens external links in new, positioned browser windows
- **Error Handling**: Provides clear error messages for missing files
- **Subfolder Support**: Access files in any subdirectory of the project

## Setup and Installation

1. Clone the repository
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the dashboard:
   ```
   python app.py
   ```
   or use the provided shell script:
   ```
   ./start_dashboard.sh
   ```

## Usage

1. Access the dashboard at http://localhost:8081
2. Edit the `sidebar.md` file to customize the sidebar
3. Click on links in the sidebar to load content in the main frame

## Technical Details

The dashboard is built with:
- Flask (web framework)
- Python-Markdown (for markdown parsing)
- Watchdog (for file monitoring)
- JavaScript (for dynamic content loading)

## File Structure

- `app.py`: Main Flask application
- `sidebar.md`: Markdown file for sidebar content
- `static/`: Static assets (CSS, JS)
- `templates/`: HTML templates and other content
- `start_dashboard.sh`: Shell script to start the dashboard

## Contributing

Feel free to submit issues or pull requests to improve the dashboard.

## License

MIT

## Requirements

- Python 3.6+
- Flask
- Markdown
- Watchdog
