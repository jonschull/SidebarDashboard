# Implementation Considerations

* I'm going to have mutliple dashboards.  This prototye but others as well.  I need a way of switching between them, hopefully without having to proliferate project foldrs.
* 

## Simplified Multi-Dashboard Approach

### Creating Additional Dashboards

We'll implement a simple dropdown during publication:

- Select existing dashboard or create new one
- Each dashboard will be a separate GitHub repository
- Single GitHub account can host multiple dashboards
- Each dashboard has its own GitHub Pages URL (username.github.io/DashboardName)

Much simpler than complex management tools - just a dropdown during publication

### Helping Others Create Their Own Dashboards

The AI concierge will guide users through the process:

- Setting up a GitHub account
- Creating their first dashboard
- Publishing content
- Managing multiple dashboards if needed

Let the concierge walk the user through the process rather than creating complex documentation

## minor edits

* It would be nice to be able to make edits by clicking on the browser rather than switching to cascade and looking for the file in the sidebar
  1. in github pages
  2. in localhost
* we need to figure out a pathway for

1. * me to create additional dashboards *
2. * other people to create their own dashboard (they'd need help setting up a github account etc.). *

* For both functions the Cascade AI can act as a "concierge" *
* Options and considerations? *

## AI Concierge Guidance

The AI assistant will provide different guidance based on the mode:

### Author Mode AI Guidance (Content Creation)

- Help with markdown formatting and content organization
- Do web-based research or co-authoring when requested
- Explain how to publish to different dashboards
- Guide through creating new dashboards when needed
- Troubleshoot publishing issues
- Use friendly, encouraging language focused on content creation
- Avoid technical implementation details unless specifically asked

### Development Mode AI Guidance (System Development)

- Provide technical details about the dashboard architecture
- Explain how the multi-dashboard system works
- Help with customizing the dashboard appearance or functionality
- Use more technical language appropriate for developers
- Focus on system functionality and implementation

## The Three Modes of SidebarDashboard

1. **Reader Mode**: Users view published content on GitHub Pages

- No AI assistance (just standard web browsing)
- Clean, distraction-free reading experience
- Access via username.github.io/DashboardName

2. **Author Mode**: Content creators work in Windsurf IDE

- AI assistance focused on content creation
- Limited view of project files (docs directory only)
- Green-themed workspace for clear context

3. **Development Mode**: Developers work in Windsurf IDE

- AI assistance focused on technical implementation
- Full access to all project files and directories
- Standard workspace theme

## Why Separate Repositories for Each Dashboard?

Using separate GitHub repositories for each dashboard offers several key advantages:

1. **Independent Publishing and Versioning**

- Each dashboard has its own commit history
- Changes to one dashboard don't affect others
- Update dashboards independently without risk

2. **Clean URLs and Organization**

- Predictable URLs: username.github.io/DashboardName
- Clear separation in GitHub's interface
- Easy for users to remember and share

3. **Simplified Access Control**

- Grant different collaborators access to different dashboards
- Some dashboards can be private while others are public
- Easier to transfer ownership of a specific dashboard if needed

4. **Reduced Complexity**

- No complex branch management or subdirectory organization
- Avoids potential conflicts between dashboards
- Simpler mental model for both authors and developers

## Staged Development Plan

### Phase 1: Stabilize Current Implementation (Current)

- Ensure Author Mode and Development Mode work reliably
- Fix server management in mode-switching scripts
- Clarify documentation for existing functionality
- Establish clear AI personalities for each mode

### Phase 2: Single-Dashboard Publishing Enhancement (Next)

- Improve the publish.sh script with better feedback
- Add configuration file to store GitHub repository information
- Enhance error handling during publishing
- Update documentation with clear publishing instructions
- Test publishing workflow thoroughly

### Phase 3: Multi-Dashboard Selection (Future)

- Add simple dashboard configuration storage
- Implement dashboard selection dropdown in publish dialog
- Create "new dashboard" option with repository creation
- Update AI guidance to explain multi-dashboard features
- Test with multiple dashboard repositories

### Phase 4: User Onboarding Improvements (Future)

- Develop clear first-time user experience
- Enhance AI concierge guidance for new users
- Create sample content templates
- Improve documentation for GitHub account setup
- Test with users unfamiliar with the system

### Phase 5: Advanced Features (Optional)

- Dashboard theme customization
- Content sharing between dashboards
- Dashboard analytics and insights
- Enhanced collaboration features
- Mobile-friendly improvements

This staged approach ensures we can make incremental improvements without breaking existing functionality. Each phase builds on the previous one, and we can validate each step before moving to the next.
