# Static Sidebar Dashboard

A minimal, static implementation of the Sidebar Dashboard designed for GitHub Pages. This version provides a clean and efficient way to organize documentation and links, with all content opening in positioned windows.

## Features

- **Simple Sidebar**: Fixed 300px sidebar with Markdown support
- **Smart Windows**: All links open in windows positioned to the right of the sidebar
- **GitHub Pages Ready**: Pure static implementation, no server-side code
- **Minimal Dependencies**: Only requires marked.js for Markdown rendering

## File Structure

```
docs/
├── js/
│   └── viewer.js      # Core functionality
├── css/
│   └── styles.css     # Sidebar and link styles
├── index.html         # Main entry point
├── sidebar.md         # Navigation content (Markdown)
├── about.html         # About page
└── test-content.html  # Example content
```

## Usage

1. Edit `sidebar.md` to define your navigation links
2. Add content files (HTML or Markdown)
3. All links will automatically open in positioned windows

## Development

This implementation follows a dual-development strategy:
- Original version remains untouched in the root directory
- Static version optimized for GitHub Pages deployment

## Window Positioning

Windows are automatically sized and positioned:
- Width: Screen width minus sidebar (300px) and margins
- Height: Screen height minus margins
- Position: Right of sidebar with consistent spacing

## Dependencies

- [marked.js](https://marked.js.org/): For Markdown rendering
- No other external dependencies required

## GitHub Pages Setup

1. Enable GitHub Pages in your repository settings
2. Point it to the `docs` directory
3. Your dashboard will be available at `https://[username].github.io/[repository]`

## Documentation

All code is documented with:
- Function purposes and behaviors
- Parameter descriptions
- Side effects and state changes
- Dependencies and requirements

## License

MIT License - See LICENSE file for details
