# Sidebar Dashboard

A simple HTML-based dashboard with a persistent sidebar and content area.

## Features

- Persistent sidebar that stays visible at all times
- Content area that can display both local and external content
- External websites (like Gmail, Airtable) load in the main panel
- Simple implementation using HTML frames
- Minimal JavaScript required
- Works with most modern browsers

## Files

- `index.html` - The main frameset that defines the layout
- `sidebar.html` - The sidebar navigation panel
- `sample-content.html` - Example local content
- `matrix-view.html` - Example data matrix view

## How to Use

1. Open `index.html` in a web browser
2. Use the links in the sidebar to navigate:
   - Local content loads in the main panel
   - External websites also load in the main panel

## Testing External Services

The sidebar includes links to:
- Gmail
- Airtable
- Google Groups

Clicking these links will load these services in the main panel while keeping the sidebar visible.

## Limitations

- Some websites may use X-Frame-Options headers to prevent being displayed in frames
- For these websites, you'll typically see a blank page or an error message
- This is a security feature of those websites and cannot be bypassed

## Running Locally

You can run this dashboard using a local web server:

```bash
cd /path/to/SidebarDashboard
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.
