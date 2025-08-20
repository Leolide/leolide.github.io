// Work Page Loader - Populate works page with all projects

class WorkPageLoader {
    constructor() {
        this.csvLoader = null;
    }

    // Initialize with CSV data
    async initialize() {
        this.csvLoader = new CSVContentLoader();
        await this.csvLoader.loadCSVData();
        this.populateWorksPage();
    }

    // Get all published projects, separated by type
    getProjectsByCategory() {
        const allProjects = [
            ...this.csvLoader.worksWithCodesData.map(p => ({ ...p, _source: 'works-with-codes' })),
            ...this.csvLoader.worksData.map(p => ({ ...p, _source: 'works' }))
        ];

        // Filter out drafts and archived items
        const publishedProjects = allProjects.filter(p => 
            p.Draft !== 'true' && p.Archived !== 'true'
        );

        // Sort by Sort order (lower numbers first)
        publishedProjects.sort((a, b) => {
            const sortA = parseInt(a['Sort order 1']) || 999;
            const sortB = parseInt(b['Sort order 1']) || 999;
            return sortA - sortB;
        });

        // Separate professional and other projects
        const professionalProjects = publishedProjects.filter(p => p._source === 'works-with-codes');
        const portfolioProjects = publishedProjects.filter(p => p._source === 'works');

        return {
            professional: professionalProjects,
            portfolio: portfolioProjects,
            all: publishedProjects
        };
    }

    // Generate project URL
    getProjectURL(project) {
        const template = project._source === 'works-with-codes' ? 
            'detail_works-with-code.html' : 'detail_works.html';
        return `${template}?project=${encodeURIComponent(project.Slug)}`;
    }

    // Populate the works page
    populateWorksPage() {
        const projects = this.getProjectsByCategory();
        const worksContainers = document.querySelectorAll('.collection-list-works.w-dyn-items');
        
        if (worksContainers.length === 0) {
            console.error('Works containers not found');
            return;
        }

        // First container - Professional projects (Works with Codes)
        if (worksContainers[0]) {
            this.populateContainer(worksContainers[0], projects.professional);
        }

        // Second container - Portfolio projects (if exists)
        if (worksContainers[1]) {
            this.populateContainer(worksContainers[1], projects.portfolio);
        }

        // If there's only one container, show all projects
        if (worksContainers.length === 1) {
            this.populateContainer(worksContainers[0], projects.all);
        }
    }

    // Populate a specific container with projects
    populateContainer(container, projects) {
        // Clear existing content
        container.innerHTML = '';

        // Create cards for each project
        projects.forEach((project, index) => {
            const card = this.createWorkCard(project, index);
            container.appendChild(card);
        });
    }

    // Create individual work card (similar to index page but adapted for work page)
    createWorkCard(project, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-rotate-works w-dyn-item';
        cardElement.setAttribute('role', 'listitem');
        
        const projectUrl = this.getProjectURL(project);
        const imageUrl = project['Sort order 1 image'] || project['Main Image'] || 'https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg';
        
        cardElement.innerHTML = `
            <div data-w-id="4e7d68c6-5d02-f5ec-ddaa-19fa5b9536ad" class="works-card-wrapper">
                <div class="works-card is-front">
                    <div class="works-card-image">
                        <img width="Auto" height="Auto" src="${imageUrl}" loading="lazy" alt="${project.Name}" class="image">
                    </div>
                    <div class="works-card-tittle">
                        <div class="max-width-30ch">
                            <h2 class="text-size-xlarge line-height-140 text-weight-regular">${project['Bigger Heading'] || project.Name || ''}</h2>
                        </div>
                        <div class="opacity-60">
                            <h2 class="text-size-small text-weight-regular">${project['Project Description'] || ''}</h2>
                        </div>
                        <div class="opacity-70 mobile">
                            <p class="text-size-small line-height-150">${project['My Role'] || ''}</p>
                        </div>
                    </div>
                    <a href="${projectUrl}" class="button-cards-home mobile w-inline-block"></a>
                </div>
                <div class="works-card-back is-back">
                    <div class="works-card-content">
                        <div class="image-mobile">
                            <img src="${imageUrl}" loading="lazy" alt="${project.Name}" />
                        </div>
                        <div class="works-back-card-content">
                            <div class="max-width-22ch">
                                <h2 class="text-size-xxlarge line-height-140 text-weight-regular">${project['Bigger Heading'] || project.Name || ''}</h2>
                            </div>
                            <div class="opacity-70 mobile">
                                <p class="text-size-small line-height-150">${this.truncateText(project['About the Project'] || project['Project Description'] || '', 120)}</p>
                            </div>
                        </div>
                        <a href="${projectUrl}" data-w-id="4e7d68c6-5d02-f5ec-ddaa-19fa5b9536e2" class="button-primary">
                            <div class="button-text-wrapper align-center">
                                <div class="text-size-small text-weight-medium">View project</div>
                            </div>
                            <div class="fill-top"></div>
                            <div class="fill-bottom"></div>
                            <div class="fill-left"></div>
                            <div class="fill-right"></div>
                            <div class="embed-border w-embed">
                                <svg width="166" height="50" viewbox="0 0 166 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 13V2C1 1.44772 1.44772 1 2 1H13M165 13V2C165 1.44772 164.552 1 164 1H153M1 39V50C1 50.5523 1.44772 51 2 51H13M165 39V50C165 50.5523 164.552 51 164 51H153" stroke="#EFEEEC" stroke-linecap="round"></path>
                                </svg>
                            </div>
                        </a>
                    </div>
                    <a href="${projectUrl}" class="button-cards-home mobile w-inline-block"></a>
                </div>
            </div>
        `;

        return cardElement;
    }

    // Helper function to truncate text
    truncateText(text, maxLength) {
        if (!text) return '';
        
        // Remove HTML tags for truncation
        const plainText = text.replace(/<[^>]*>/g, '');
        
        if (plainText.length <= maxLength) return plainText;
        return plainText.substr(0, maxLength).trim() + '...';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run on work page
    if (window.location.pathname.includes('work.html')) {
        const workLoader = new WorkPageLoader();
        workLoader.initialize();
    }
});

// Export for use in other scripts
window.WorkPageLoader = WorkPageLoader;