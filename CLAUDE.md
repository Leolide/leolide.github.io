# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Lide's personal portfolio website - a static site originally exported from Webflow and enhanced with a custom CSV-based dynamic content system. The site is hosted on GitHub Pages with a custom domain (www.lide.studio).

## Architecture

### Core Technologies
- **Frontend**: Static HTML/CSS/JavaScript (Webflow-exported base)
- **Content Management**: CSV-driven dynamic content loading
- **Hosting**: GitHub Pages with custom domain
- **Styling**: Webflow CSS + custom overrides
- **Fonts**: Self-hosted Satoshi font family

### Key Files Structure
- `index.html`, `work.html`, `about.html`, `fun.html` - Main pages
- `/css/` - Webflow stylesheets + custom overrides (`navbar-override.css`, `works-section.css`)
- `/js/` - Dynamic content system and routing
- `/images/`, `/videos/` - Asset directories
- `CNAME` - Custom domain configuration for GitHub Pages
- `.nojekyll` - Disables Jekyll processing for GitHub Pages

### Dynamic Content System
The website uses a sophisticated CSV-based content management system:

- **Data Sources**: 
  - `Lide's Portfolio - Works.csv` - Portfolio projects
  - `Lide's Portfolio - Works_with_Codes.csv` - Professional projects
- **Core Scripts**:
  - `js/csv-content-loader.js` - CSV parsing and template population
  - `js/project-router.js` - URL routing (e.g., `?project=tofu`)
  - `js/index-content-loader.js` - Homepage content loading
  - `js/work-page-loader.js` - Portfolio listing management

### Content Update Workflow
1. Modify CSV files to update portfolio content
2. Images are referenced via CDN URLs in the CSV
3. JavaScript dynamically populates HTML templates using Webflow's `w-dyn-bind-empty` classes

## Development Commands

Since this is a static site, no build process is required:

```bash
# Serve locally (any simple HTTP server)
python -m http.server 8000
# or
npx serve .

# Deploy to GitHub Pages
git push origin main  # Triggers automatic deployment via GitHub Actions
```

## GitHub Pages Configuration

The site deploys automatically when pushing to the `main` branch via `.github/workflows/static.yml`. The workflow configuration requires:
- Files in repository root (current structure is correct)
- `CNAME` file for custom domain
- `.nojekyll` file to bypass Jekyll processing

**Important**: The GitHub workflow only triggers on pushes to `main` branch. If working on other branches, merge to `main` to deploy.

## Content Management

### Adding New Portfolio Projects
1. Add entry to appropriate CSV file (`Lide's Portfolio - Works.csv` for portfolio pieces)
2. Include required fields: Title, Description, Image URLs, Project URL, etc.
3. Images should be hosted externally (CDN URLs in CSV)
4. The JavaScript will automatically populate the portfolio grid

### Styling Customizations
- Webflow CSS should not be modified directly (`lides-portfolio.webflow.css`)
- Use override files in `/css/` for customizations
- Follow existing pattern: `navbar-override.css`, `works-section.css`

## Key Architectural Patterns

1. **Template-Based Rendering**: Webflow's `w-dyn-bind-empty` classes mark injection points
2. **Client-Side Routing**: URL parameters for navigation (e.g., `?project=projectname`)
3. **Progressive Enhancement**: Static HTML enhanced with JavaScript functionality
4. **Responsive Assets**: Multiple image sizes and formats for different breakpoints