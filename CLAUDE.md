# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Lide Li's personal portfolio website built with Webflow. The project contains a static HTML/CSS/JS website exported from Webflow, showcasing various design and development projects.

## Project Structure

- `lides-portfolio.webflow/` - Main website directory containing all exported Webflow files
  - `index.html` - Main homepage
  - `css/` - Stylesheets including custom Webflow CSS and third-party libraries
  - `js/` - JavaScript files (primarily Webflow's generated JS)
  - `images/` - All image assets including portfolio work samples
  - `fonts/` - Custom Satoshi font family files
  - `videos/` - Video assets for portfolio pieces
  - Various HTML pages for different sections (about, contact, work, etc.)

## Content Management

Portfolio project data is managed through CSV files:
- `Lide's Portfolio - Works.csv` - Contains all portfolio project information
- `Lide's Portfolio - Works_with_Codes.csv` - Additional project data

These CSV files contain structured data that appears to be used for populating the Webflow CMS, including project details, images, descriptions, team members, and prototype links.

## Development Notes

- This is a static website exported from Webflow - no build process required
- The main stylesheet is `lides-portfolio.webflow.css` with custom styling
- Uses Satoshi font family (multiple weights/styles included)
- Responsive design with mobile-specific assets and breakpoints
- No package.json or build tools - direct HTML/CSS/JS development

## Key Features

- Multi-page portfolio structure with different layout variants
- Project detail pages with image galleries and case study content
- Contact forms and interactive elements
- Video backgrounds and animations
- Responsive navigation and mobile menu
- External links to prototypes and live projects (Figma, App Store, etc.)

## Content Updates

When updating portfolio content, modify the CSV files as they contain the structured project data. Images and assets are referenced by CDN URLs in the CSV files.

## Dynamic Content System

The website now includes a dynamic content system that connects CSV data to HTML templates:

### Files Added:
- `js/csv-content-loader.js` - Parses CSV files and populates HTML templates
- `js/project-router.js` - Handles navigation between projects and generates project listings
- `js/index-content-loader.js` - Populates selected works on homepage from CSV data
- `js/work-page-loader.js` - Populates all works on the work listing page
- `project-index.html` - Test page showing all projects dynamically

### How It Works:
1. **CSV Parsing**: JavaScript reads the CSV files and converts them to structured data
2. **Template Population**: Finds HTML elements with `w-dyn-bind-empty` class and fills them with CSV data
3. **URL Routing**: Uses URL parameters like `?project=tofu` to load specific projects
4. **Navigation**: Automatically adds Previous/Next buttons for project navigation

### Usage:
- **Homepage** (`index.html`): Selected works are automatically populated from CSV data
- **Works page** (`work.html`): All published projects are displayed dynamically  
- **Individual projects**: `detail_works.html?project=project-slug` or `detail_works-with-code.html?project=project-slug`
- **Project index** (`project-index.html`): Test page showing all projects in a grid layout
- Templates automatically detect which CSV file to use and populate accordingly

### Pages Updated:
- `index.html` - Homepage with dynamic "Selected Works" section
- `work.html` - Works listing page with dynamic project cards  
- `detail_works.html` - Individual project template (for portfolio projects)
- `detail_works-with-code.html` - Individual project template (for professional projects)

### Supported Fields:
The system maps CSV columns to HTML elements based on Webflow's dynamic binding classes:
- Project name, descriptions, images, team members, metrics, prototype links
- Gallery images (from semicolon-separated URLs in 'Gallery final' field)
- Navigation between projects with Previous/Next buttons

### Development:
To add new dynamic fields, update the `populateProjectData()` function in `csv-content-loader.js` and ensure the HTML template has the appropriate `w-dyn-bind-empty` classes.