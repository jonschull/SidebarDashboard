# SidebarDashboard Vision

## Core Philosophy
SidebarDashboard provides a minimal, clean way to create and publish linked documents. It follows two key principles:
1. **Author Simplicity**: Everything the author needs is immediately visible and simple to use
2. **Clean Implementation**: All complexity is hidden "under the hood"

## Directory Structure
```
SidebarDashboard/
├── QuickStart.md         # Author's entry point
├── sidebar.md           # Navigation
├── *.md, *.png, etc    # Author's content (flat structure)
└── under_the_hood/     # Implementation details
```

## Author Experience

### QuickStart Content
```markdown
# SidebarDashboard QuickStart

Create your dashboard in 3 simple steps:

1. Edit sidebar.md to build your navigation:
   ```markdown
   # My Dashboard
   - [About](about.md)
   - [Demo](demo.png)
   ```

2. Add your content files right here
   - Just put files in this folder
   - Use simple links like about.md
   - Create folders only if you want to

3. Preview as you work
   - See changes instantly at http://localhost:8081
   - Everything updates in real-time
   - When ready, it's live on GitHub Pages

That's it! The AI Assistant can help you create and organize content.
Note to AI: See under_the_hood/dev/ for technical details.
```

## Theory of Operation

### Two Views, One Content Source

1. **Development View** (Flask ERA)
   - Author's working environment
   - Real-time preview
   - Instant updates
   - Direct file access
   - Local development at http://localhost:8081

2. **Published View** (Clean Static)
   - Exactly 300px fixed sidebar
   - Windows at sidebar + 25px
   - Single marked.js dependency
   - No special characters or emojis
   - Clean, minimal interface

### Key Features

1. **Content First**
   - Files in root directory
   - Simple direct links
   - No mandatory structure
   - Author controls organization

2. **Window Positioning**
   - Fixed 300px sidebar
   - Content windows:
     - Width: screen - sidebar - 50px margin
     - Height: screen - 100px margin
     - Position: sidebar + 25px left, 50px top

3. **Navigation**
   - Clean markdown sidebar
   - No internal navigation
   - External links in new windows
   - Proper window positioning

## Implementation Requirements

### Clean Implementation
1. Single dependency (marked.js)
2. Fixed 300px sidebar
3. Precise window positioning
4. No internal navigation
5. UTF-8 encoding
6. No special characters

### AI-Ready Documentation
1. Function Documentation
   - Clear purpose statements
   - All parameters explained
   - Return values specified
   - Side effects noted
   - Dependencies listed

2. System Documentation
   - Architecture diagrams
   - Data flow maps
   - Error handling
   - State management
   - Recovery procedures

3. Knowledge Transfer
   - All assumptions documented
   - No implicit knowledge
   - Clear handover points
   - Complete workflow coverage

## Development Guidelines

1. **Author's Perspective**
   - Everything at root level
   - No path complexity
   - Instant feedback
   - Simple links

2. **Implementation Details**
   - All complexity under_the_hood/
   - Clean separation
   - No leaky abstractions
   - Author never needs internals

3. **Dual Operation**
   - Development for feedback
   - Production for clean delivery
   - Same content source
   - No translation needed
