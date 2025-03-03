# Sidebar Dashboard

A dynamic dashboard with a configurable sidebar that can be edited in real-time using markdown.

## Sidebar.md - Quick Guide

The sidebar is controlled by a simple markdown file (`sidebar.md`) that you can edit at any time. The dashboard will automatically refresh to show your changes.

### Link Structure Rules

All links in the sidebar follow these simple rules:

1. **Always include file extensions** in all links:
   - HTML files: `sample_content.html`, `matrix_view.html`
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

- [Sample Content](templates/sample_content.html)
- [Test File](test.txt)
- [Matrix View](templates/matrix_view.html)
- [README](README.md)

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
- `templates/`: HTML templates
- `start_dashboard.sh`: Shell script to start the dashboard

## Contributing

Feel free to submit issues or pull requests to improve the dashboard.

## License

MIT

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
   - Links starting with http:// or https:// are automatically detected as external
   - External links will open in a new browser window
   - All local links should include the file extension (e.g., `sample.html`, `test.txt`, `matrix_view.html`)
   - Markdown files (.md) will be rendered as HTML

## Sidebar Markdown Format

```markdown
# Dashboard Title

## Section Title
- [Local HTML File](sample.html)
- [Local Text File](test.txt)
- [Template HTML](matrix_view.html)
- [Markdown File](README.md)
- [External Link](https://example.com)

## Another Section
- [Another HTML](calculator.html)
```

## Link Rules

The sidebar dashboard uses simple, intuitive rules for hyperlinks:

1. **File Links**: Always include the file extension
   ```markdown
   - [Sample HTML](sample.html)
   - [Text File](document.txt)
   - [PDF Document](report.pdf)
   - [Markdown File](README.md)
   ```

2. **HTML Templates**: Reference with .html extension
   ```markdown
   - [Matrix View](matrix_view.html)
   - [Calculator](calculator.html)
   ```

3. **External Links**: Use full URLs (automatically detected)
   ```markdown
   - [Google](https://google.com)
   - [GitHub](https://github.com)
   ```

4. **Special Handling**:
   - Markdown files (.md) are rendered as HTML with styling
   - HTML files are served directly
   - Other file types are downloaded or displayed according to browser capabilities

## File Organization

The dashboard supports two types of content:

1. **Files in Root Directory**: Any files placed in the root directory can be referenced directly:
   ```markdown
   - [Text File](document.txt)
   - [README](README.md)
   ```

2. **HTML Templates**: HTML files in the `templates` directory can be referenced directly:
   ```markdown
   - [Matrix View](matrix_view.html)
   - [Calculator](calculator.html)
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
