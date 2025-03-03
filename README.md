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
