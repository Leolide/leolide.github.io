# Lide Li - Portfolio Website

## Overview
This is Lide Li's personal portfolio website - a static site showcasing product design work, professional experience, and creative projects. Originally exported from Webflow and enhanced with a custom CSV-based dynamic content system.

## Project Information
- **Type**: Static Portfolio Website
- **Tech Stack**: HTML, CSS, JavaScript
- **Content Management**: CSV-driven dynamic content loading
- **Hosting**: Currently running on Replit, originally hosted on GitHub Pages (www.lide.studio)
- **Author**: Lide Li - Product Designer at Palantir

## Recent Changes
- **Oct 19, 2025**: Initial Replit setup
  - Configured Python http.server to serve static files on port 5000
  - Set up workflow for automatic server start
  - Configured deployment settings for autoscale deployment
  - Added .gitignore for Python and Replit-specific files

## Project Architecture

### Directory Structure
```
/
├── index.html              # Homepage
├── fun.html               # Fun projects page
├── about.html             # About page
├── work.html              # Works listing
├── detail_*.html          # Various detail page templates
├── Lide's Portfolio - Works.csv                 # Portfolio projects data
├── Lide's Portfolio - Works_with_Codes.csv      # Professional projects data
├── css/                   # Stylesheets
│   ├── normalize.css
│   ├── webflow.css
│   ├── lides-portfolio.webflow.css
│   ├── navbar-override.css
│   └── works-section.css
├── js/                    # JavaScript files
│   ├── csv-content-loader.js      # CSV parsing
│   ├── index-content-loader.js    # Homepage content
│   ├── work-page-loader.js        # Portfolio listing
│   ├── project-router.js          # URL routing
│   ├── url-router.js              # Navigation
│   ├── detail-page-loader.js      # Detail pages
│   ├── password-protection.js     # Protected content
│   └── test-data.js               # Fallback data
├── images/                # Image assets
├── fonts/                 # Satoshi font family
└── videos/                # Video assets
```

### Core Technologies
- **Frontend**: Static HTML/CSS/JavaScript (Webflow-exported base)
- **Styling**: Webflow CSS + custom overrides
- **Fonts**: Self-hosted Satoshi font family
- **Dynamic Content**: CSV-based content management system
- **Routing**: Client-side routing via URL parameters (e.g., `?project=tofu`)

### Dynamic Content System
The website uses a sophisticated CSV-based content management system:

**Data Sources:**
- `Lide's Portfolio - Works.csv` - Portfolio projects (personal work)
- `Lide's Portfolio - Works_with_Codes.csv` - Professional projects (client work)

**Core Scripts:**
- `csv-content-loader.js` - CSV parsing and template population
- `project-router.js` - URL routing and navigation
- `index-content-loader.js` - Homepage selected works
- `work-page-loader.js` - Portfolio listing management
- `detail-page-loader.js` - Project detail pages
- `password-protection.js` - Password protection for sensitive projects

**How It Works:**
1. JavaScript loads CSV files on page load
2. Data populates Webflow's `w-dyn-bind-empty` template elements
3. URL parameters determine which project to display
4. Protected projects require password access

## Running Locally

The site runs via Python's built-in HTTP server:

```bash
python3 -m http.server 5000 --bind 0.0.0.0
```

The workflow is configured to start automatically in Replit.

## Deployment

The site is configured for Replit Autoscale deployment:
- **Deployment Type**: Autoscale (static site)
- **Port**: 5000
- **Command**: `python3 -m http.server 5000 --bind 0.0.0.0`

To deploy, use the Replit deployment interface.

## Content Management

### Adding New Portfolio Projects
1. Edit the appropriate CSV file:
   - `Lide's Portfolio - Works.csv` for personal portfolio pieces
   - `Lide's Portfolio - Works_with_Codes.csv` for professional projects
2. Include required fields: Name, Bigger Heading, Project Description, Images, Slug, etc.
3. Images can be hosted externally (CDN URLs in CSV)
4. The JavaScript will automatically populate the portfolio grid

### Protected Projects
Some projects are password-protected. Protected projects include:
- a-clientelling-app
- debrief-ai
- design-system
- technology-radar

### Styling Customizations
- **DO NOT** modify Webflow CSS directly (`lides-portfolio.webflow.css`)
- Use override files in `/css/` for customizations:
  - `navbar-override.css` - Navigation bar styles
  - `works-section.css` - Portfolio grid styles

## Key Features
1. **Template-Based Rendering**: Webflow's `w-dyn-bind-empty` classes mark injection points
2. **Client-Side Routing**: URL parameters for navigation (e.g., `?project=projectname`)
3. **Progressive Enhancement**: Static HTML enhanced with JavaScript functionality
4. **Responsive Assets**: Multiple image sizes for different breakpoints
5. **Password Protection**: Secure access to sensitive client work

## User Preferences
None configured yet.

## Notes
- The site includes a Spline 3D scene on the homepage (may not render in all environments)
- WebGL is used for interactive elements but gracefully degrades
- All navigation uses real file paths with query strings
- CSV files must be in the root directory for the JavaScript loaders to work
- The site is fully functional without JavaScript but enhanced with it
