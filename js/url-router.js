// URL Router for handling project URLs like /works-with-code/project-slug

class URLRouter {
    constructor() {
        this.routes = {
            'works-with-code': 'detail_works-with-code.html',
            'works': 'detail_works.html'
        };
    }

    // Parse current URL and redirect to appropriate page
    handleRouting() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment);
        
        // Handle /works-with-code/project-slug format
        if (segments.length >= 2) {
            const category = segments[segments.length - 2];
            const projectSlug = segments[segments.length - 1];
            
            if (this.routes[category]) {
                const targetPage = this.routes[category];
                const targetUrl = `${targetPage}?project=${encodeURIComponent(projectSlug)}`;
                
                // Only redirect if we're not already on the target page
                if (!window.location.href.includes(targetPage)) {
                    console.log(`Routing ${path} to ${targetUrl}`);
                    window.location.replace(targetUrl);
                    return;
                }
            }
        }

        // Handle direct access to project folders (create index pages)
        if (segments.length === 1) {
            const category = segments[0];
            if (category === 'works-with-code') {
                this.showProjectIndex('works-with-codes');
                return;
            } else if (category === 'works') {
                this.showProjectIndex('works');
                return;
            }
        }
    }

    // Show project index page for a category
    showProjectIndex(category) {
        document.body.innerHTML = `
            <div style="padding: 2rem; text-align: center; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                <h1>Projects - ${category.replace('-', ' ').toUpperCase()}</h1>
                <p>Loading projects...</p>
                <script>
                    setTimeout(() => {
                        window.location.href = '../index.html#Work';
                    }, 1000);
                </script>
            </div>
        `;
    }

    // Generate clean URLs for projects
    generateCleanURL(projectSlug, category = 'works-with-code') {
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
        return `${baseUrl}/${category}/${projectSlug}`;
    }

    // Initialize router
    initialize() {
        // Only run routing if we're on a project URL pattern
        const path = window.location.pathname;
        if (path.includes('/works-with-code/') || path.includes('/works/') || 
            path.endsWith('/works-with-code') || path.endsWith('/works')) {
            this.handleRouting();
        }
    }
}

// Initialize routing on page load
document.addEventListener('DOMContentLoaded', () => {
    const router = new URLRouter();
    router.initialize();
    
    window.urlRouter = router;
});

// Export for use in other scripts
window.URLRouter = URLRouter;