// Project Router - Handle navigation between individual projects

class ProjectRouter {
    constructor() {
        this.projects = [];
        this.currentIndex = 0;
    }

    // Initialize router with project data
    initialize(worksData, worksWithCodesData) {
        // Combine both datasets with source information
        this.projects = [
            ...worksWithCodesData.map(p => ({ ...p, _source: 'works-with-codes', _template: 'detail_works-with-code.html' })),
            ...worksData.map(p => ({ ...p, _source: 'works', _template: 'detail_works.html' }))
        ];

        // Sort by creation date or sort order
        this.projects.sort((a, b) => {
            const sortA = parseInt(a['Sort order 1']) || 999;
            const sortB = parseInt(b['Sort order 1']) || 999;
            return sortA - sortB;
        });

        this.setupNavigationLinks();
    }

    // Get project URL with parameters
    getProjectURL(project) {
        const template = project._source === 'works-with-codes' ? 'detail_works-with-code.html' : 'detail_works.html';
        return `${template}?project=${encodeURIComponent(project.Slug)}`;
    }

    // Setup next/previous navigation
    setupNavigationLinks() {
        const currentSlug = new URLSearchParams(window.location.search).get('project');
        if (!currentSlug) return;

        this.currentIndex = this.projects.findIndex(p => p.Slug === currentSlug);
        if (this.currentIndex === -1) return;

        this.createNavigationButtons();
    }

    // Create navigation buttons
    createNavigationButtons() {
        const navContainer = document.createElement('div');
        navContainer.className = 'project-navigation';
        navContainer.innerHTML = `
            <style>
                .project-navigation {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    display: flex;
                    gap: 1rem;
                    z-index: 1000;
                }
                
                .nav-button {
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 0.75rem 1rem;
                    border-radius: 2rem;
                    text-decoration: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }
                
                .nav-button:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }
                
                .nav-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                @media (max-width: 768px) {
                    .project-navigation {
                        bottom: 1rem;
                        right: 1rem;
                        flex-direction: column;
                    }
                }
            </style>
        `;

        const buttonsHtml = `
            ${this.currentIndex > 0 ? 
                `<a href="${this.getProjectURL(this.projects[this.currentIndex - 1])}" class="nav-button">← Previous</a>` : 
                ''
            }
            ${this.currentIndex < this.projects.length - 1 ? 
                `<a href="${this.getProjectURL(this.projects[this.currentIndex + 1])}" class="nav-button">Next →</a>` : 
                ''
            }
        `;

        navContainer.innerHTML += buttonsHtml;
        document.body.appendChild(navContainer);
    }

    // Generate project index for work listing pages
    generateProjectIndex(container, source = 'all') {
        if (!container) return;

        let projectsToShow = this.projects;
        if (source === 'works') {
            projectsToShow = this.projects.filter(p => p._source === 'works');
        } else if (source === 'works-with-codes') {
            projectsToShow = this.projects.filter(p => p._source === 'works-with-codes');
        }

        const projectGrid = document.createElement('div');
        projectGrid.className = 'project-grid';
        projectGrid.innerHTML = `
            <style>
                .project-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin: 2rem 0;
                }
                
                .project-card {
                    border: 1px solid rgba(239, 238, 236, 0.2);
                    border-radius: 8px;
                    overflow: hidden;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .project-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }
                
                .project-card img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                
                .project-card-content {
                    padding: 1.5rem;
                }
                
                .project-card h3 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.125rem;
                    font-weight: 600;
                }
                
                .project-card p {
                    margin: 0 0 1rem 0;
                    color: rgba(0, 0, 0, 0.7);
                    font-size: 0.875rem;
                }
                
                .project-card a {
                    color: inherit;
                    text-decoration: none;
                }
            </style>
        `;

        projectsToShow.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <a href="${this.getProjectURL(project)}">
                    <img src="${project['Sort order 1 image'] || project['Main Image'] || ''}" alt="${project.Name}">
                    <div class="project-card-content">
                        <h3>${project['Bigger Heading'] || project.Name}</h3>
                        <p>${project['Project Description'] || ''}</p>
                        <p><strong>Timeline:</strong> ${project.Timeline || 'N/A'}</p>
                    </div>
                </a>
            `;
            projectGrid.appendChild(card);
        });

        container.appendChild(projectGrid);
    }
}

// Export for global use
window.ProjectRouter = ProjectRouter;