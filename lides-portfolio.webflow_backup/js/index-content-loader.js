// Index Content Loader - Populate selected works on homepage

class IndexContentLoader {
    constructor() {
        this.csvLoader = null;
    }

    // Initialize with CSV data
    async initialize() {
        this.csvLoader = new CSVContentLoader();
        let success = await this.csvLoader.loadCSVData();
        
        // If CSV loading fails, try fallback test data
        if (!success || (this.csvLoader.worksData.length === 0 && this.csvLoader.worksWithCodesData.length === 0)) {
            console.log('CSV loading failed, trying test data fallback...');
            if (window.TestContentLoader) {
                this.csvLoader = new TestContentLoader();
                success = true;
                console.log('Using test data fallback');
            }
        }
        
        if (success && (this.csvLoader.worksData.length > 0 || this.csvLoader.worksWithCodesData.length > 0)) {
            this.populateSelectedWorks();
            console.log('Selected works populated successfully');
        } else {
            console.error('Failed to load any data');
            this.showErrorMessage();
        }
    }

    // Show error message if CSV loading fails
    showErrorMessage() {
        const worksContainer = document.querySelector('.collection-list-works.w-dyn-items');
        if (worksContainer) {
            worksContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <p>Unable to load project data. Please check the console for details.</p>
                    <p><small>CSV files may need to be served from a web server to work properly.</small></p>
                </div>
            `;
        }
    }

    // Get featured/selected projects - ONLY professional projects (Works with Codes) excluding Technology Radar
    getSelectedProjects(count = 3) {
        // Only use professional projects from Works with Codes CSV
        const professionalProjects = this.csvLoader.worksWithCodesData.map(p => ({ ...p, _source: 'works-with-codes' }));

        // Filter out drafts, archived items, and Technology Radar
        const publishedProjects = professionalProjects.filter(p => 
            p.Draft !== 'true' && 
            p.Archived !== 'true' && 
            p.Slug !== 'technology-radar'
        );

        // Sort by Sort order (lower numbers first)
        publishedProjects.sort((a, b) => {
            const sortA = parseInt(a['Sort order 1']) || 999;
            const sortB = parseInt(b['Sort order 1']) || 999;
            return sortA - sortB;
        });

        return publishedProjects.slice(0, count);
    }

    // Generate project URL (matches live site structure)
    getProjectURL(project) {
        if (project._source === 'works-with-codes') {
            // Use the detail template directly with query parameter
            return `detail_works-with-code.html?project=${encodeURIComponent(project.Slug)}`;
        } else {
            // Regular portfolio projects
            return `detail_works.html?project=${encodeURIComponent(project.Slug)}`;
        }
    }

    // Populate the selected works section
    populateSelectedWorks() {
        const selectedProjects = this.getSelectedProjects();
        let worksContainer = document.querySelector('.collection-list-works.w-dyn-items');
        
        if (!worksContainer) {
            console.error('Works container not found, creating enhanced version');
            this.createEnhancedWorksSection();
            return;
        }

        // Replace existing container with enhanced version
        this.replaceWithEnhancedSection(worksContainer, selectedProjects);
    }

    // Create enhanced works section
    createEnhancedWorksSection() {
        const selectedProjects = this.getSelectedProjects();
        const worksSection = document.querySelector('#Work') || document.querySelector('.works-square-wrapper');
        
        if (!worksSection) {
            console.error('Works section not found');
            return;
        }

        const enhancedSection = document.createElement('div');
        enhancedSection.className = 'works-section-enhanced';
        enhancedSection.innerHTML = `
            <div class="works-container-inner">
                <h2 class="works-title-enhanced">Selected Works</h2>
                <div class="works-grid-enhanced" id="enhanced-works-grid">
                </div>
            </div>
        `;

        // Replace the existing works section
        worksSection.parentNode.replaceChild(enhancedSection, worksSection);

        // Add project cards
        const grid = enhancedSection.querySelector('#enhanced-works-grid');
        selectedProjects.forEach((project, index) => {
            const card = this.createWorkCard(project, index);
            grid.appendChild(card);
            console.log(`Added project: ${project.Name}`);
        });
    }

    // Replace existing section with enhanced version
    replaceWithEnhancedSection(container, projects) {
        const parentSection = container.closest('.works-square-wrapper') || container.closest('#Work');
        
        if (parentSection) {
            const enhancedSection = document.createElement('div');
            enhancedSection.className = 'works-section-enhanced';
            enhancedSection.innerHTML = `
                <div class="works-container-inner">
                    <h2 class="works-title-enhanced">Selected Works</h2>
                    <div class="works-grid-enhanced" id="enhanced-works-grid">
                    </div>
                </div>
            `;

            parentSection.parentNode.replaceChild(enhancedSection, parentSection);

            // Add project cards
            const grid = enhancedSection.querySelector('#enhanced-works-grid');
            projects.forEach((project, index) => {
                const card = this.createWorkCard(project, index);
                grid.appendChild(card);
                console.log(`Added project: ${project.Name}`);
            });
        } else {
            // Fallback: just replace the container
            container.className = 'works-grid-enhanced';
            container.innerHTML = '';
            
            projects.forEach((project, index) => {
                const card = this.createWorkCard(project, index);
                container.appendChild(card);
                console.log(`Added project: ${project.Name}`);
            });
        }
    }

    // Create individual work card with enhanced styling (matches live site)
    createWorkCard(project, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'work-card-enhanced work-card-loading';
        cardElement.setAttribute('role', 'listitem');
        
        const projectUrl = this.getProjectURL(project);
        const imageUrl = project['Sort order 1 image'] || project['Main Image'] || 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg';
        
        // Extract tags from project data
        const tags = this.extractTags(project);
        const tagsHtml = tags.map(tag => `<span class="work-tag-enhanced">${tag}</span>`).join('');
        
        // Format date
        const dateFormatted = this.formatProjectDate(project);
        
        cardElement.innerHTML = `
            <a href="${projectUrl}" class="work-link-enhanced"></a>
            <div class="work-image-container-enhanced">
                <img src="${imageUrl}" alt="${project.Name}" class="work-image-enhanced" loading="lazy">
                ${project['Project Description']?.includes('Protected') ? '<div class="protected-badge-enhanced">🔒 Protected</div>' : ''}
            </div>
            <div class="work-content-enhanced">
                <h3 class="work-title-enhanced">
                    ${project['Bigger Heading'] || project.Name || ''}
                </h3>
                <div class="work-date-enhanced">${dateFormatted}</div>
                <div class="work-tags-enhanced">${tagsHtml}</div>
            </div>
        `;

        return cardElement;
    }

    // Extract tags from project data (use CSV Tag column)
    extractTags(project) {
        if (project.Tag) {
            return project.Tag.split(',').map(tag => tag.trim()).slice(0, 4); // Limit to 4 tags
        }
        
        // Fallback: extract from My Role or other fields
        const tags = [];
        const role = project['My Role'] || '';
        const commonTags = ['UI/UX Design', 'Product Design', 'User Research', 'Branding', 'B2B SaaS', 'Website', 'iOS', 'Design System'];
        
        commonTags.forEach(tag => {
            if (role.includes(tag)) {
                tags.push(tag);
            }
        });
        
        return tags.slice(0, 3); // Limit to 3 tags for fallback
    }

    // Format slug for display (convert kebab-case to Title Case)
    formatSlug(slug) {
        if (!slug) return '';
        
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Format project date
    formatProjectDate(project) {
        const year = project.Year;
        const timeline = project.Timeline;
        
        if (year) {
            return year;
        } else if (timeline) {
            // Smart extraction from timeline
            const yearMatch = timeline.match(/(\d{4})/);
            if (yearMatch) {
                return yearMatch[1];
            }
            
            // Try to extract from project description or other fields
            const description = project['Project Description'] || '';
            const descYearMatch = description.match(/(\d{4})/);
            if (descYearMatch) {
                return descYearMatch[1];
            }
            
            // Default fallback based on project context
            return '2024';
        }
        
        return 'Recent';
    }

    // Helper function to truncate text
    truncateText(text, maxLength) {
        if (!text) return '';
        
        // Remove HTML tags for truncation
        const plainText = text.replace(/<[^>]*>/g, '');
        
        if (plainText.length <= maxLength) return plainText;
        return plainText.substr(0, maxLength).trim() + '...';
    }

    // Update existing hardcoded links in other sections
    updateProjectLinks() {
        // Update any hardcoded project links to use the new dynamic URLs
        const projectLinks = document.querySelectorAll('a[href*="works/"]');
        
        projectLinks.forEach(link => {
            const href = link.getAttribute('href');
            const slugMatch = href.match(/works\/([^\/\?]+)/);
            
            if (slugMatch) {
                const slug = slugMatch[1];
                const project = this.csvLoader.getProjectBySlug(slug);
                
                if (project) {
                    const newUrl = this.getProjectURL(project);
                    link.setAttribute('href', newUrl);
                    console.log(`Updated link from ${href} to ${newUrl}`);
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run on index page
    if (window.location.pathname.includes('index.html') || 
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/')) {
        
        const indexLoader = new IndexContentLoader();
        indexLoader.initialize().then(() => {
            indexLoader.updateProjectLinks();
        });
    }
});

// Export for use in other scripts
window.IndexContentLoader = IndexContentLoader;