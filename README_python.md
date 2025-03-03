# Sidebar Dashboard with Python Browser Control

A Flask-based dashboard that uses JavaScript to control external browser windows based on sidebar clicks.

## Features

- Persistent sidebar that stays visible at all times
- Local content loads in an iframe within the dashboard
- External websites (like Gmail, Airtable) open in separate browser windows
- JavaScript positions these windows to appear next to the sidebar
- Clean separation between navigation and content

## Components

### Backend (Python/Flask)

- `app.py` - Flask application that serves the dashboard
- `templates/` - Directory containing HTML templates
  - `sidebar.html` - The main dashboard interface with sidebar
  - `sample_content.html` - Example local content
  - `matrix_view.html` - Example data matrix view

### Frontend (HTML/CSS/JavaScript)

- Sidebar interface with navigation links
- JavaScript to handle sidebar interactions and control browser windows
- Communication with the Flask backend

## How It Works

1. The Flask app serves the sidebar interface
2. When clicking on a local content link:
   - Content loads in an iframe within the dashboard
3. When clicking on an external link:
   - JavaScript opens a new browser window
   - The window is positioned to the right of the sidebar
   - The window size is calculated based on screen dimensions
   - The sidebar shows which external service is active

## Setup and Running

1. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the Flask application:
   ```bash
   python app.py
   ```

3. The dashboard will automatically open in your default browser at http://127.0.0.1:8081

## Browser Compatibility

This solution works on most modern browsers, with no platform-specific dependencies.

## Limitations

- Some websites may still block being opened in certain ways
- Multiple monitors may require additional configuration

## Future Improvements

- Save and restore window positions
- Add more configuration options for window size and position
- Implement a more robust window management system
