// CSV Content Loader - Dynamically populate Webflow templates with CSV data

class CSVContentLoader {
    constructor() {
        this.worksData = [];
        this.worksWithCodesData = [];
        this.currentProject = null;
    }

    // Parse CSV text into array of objects
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length === headers.length) {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = values[index];
                });
                data.push(obj);
            }
        }

        return data;
    }

    // Parse a single CSV line, handling commas inside quoted strings
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current.trim());
        return values;
    }

    // Load CSV data from files
    async loadCSVData() {
        try {
            // Load Works CSV
            const worksResponse = await fetch('Lide\'s Portfolio - Works.csv');
            const worksCSV = await worksResponse.text();
            this.worksData = this.parseCSV(worksCSV);

            // Load Works with Codes CSV
            const worksWithCodesResponse = await fetch('Lide\'s Portfolio - Works_with_Codes.csv');
            const worksWithCodesCSV = await worksWithCodesResponse.text();
            this.worksWithCodesData = this.parseCSV(worksWithCodesCSV);

            console.log('CSV data loaded successfully');
            console.log('Works data:', this.worksData.length, 'items');
            console.log('Works with codes data:', this.worksWithCodesData.length, 'items');
            return true;
        } catch (error) {
            console.error('Error loading CSV data:', error);
            return false;
        }
    }

    // Get project data by slug
    getProjectBySlug(slug) {
        // First check works with codes
        let project = this.worksWithCodesData.find(item => item.Slug === slug);
        if (project) {
            project._source = 'works-with-codes';
            return project;
        }

        // Then check regular works
        project = this.worksData.find(item => item.Slug === slug);
        if (project) {
            project._source = 'works';
            return project;
        }

        return null;
    }

    // Get URL parameter
    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Populate HTML elements with project data
    populateProjectData(project) {
        if (!project) return;

        // Set page title
        document.title = project.Name || 'Lide\'s Portfolio';

        // Set meta descriptions
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', project['Project Description'] || '');
        }

        // Populate main heading
        const blogHeading = document.querySelector('.blog-heading.w-dyn-bind-empty');
        if (blogHeading) {
            blogHeading.textContent = project['Bigger Heading'] || project.Name || '';
            blogHeading.classList.remove('w-dyn-bind-empty');
        }

        // Populate main image
        const coverImage = document.querySelector('.cover-image.w-dyn-bind-empty');
        if (coverImage && project['Main Image']) {
            coverImage.src = project['Main Image'];
            coverImage.alt = project.Name || '';
            coverImage.classList.remove('w-dyn-bind-empty');
        }

        // Populate overview/project description
        const richTextElements = document.querySelectorAll('.w-richtext.w-dyn-bind-empty');
        richTextElements.forEach((element, index) => {
            if (index === 0 && project['Project Description']) {
                element.innerHTML = project['About the Project'] || project['Project Description'] || '';
                element.classList.remove('w-dyn-bind-empty');
            }
            if (index === 1 && project['Team Members']) {
                element.innerHTML = project['Team Members'];
                element.classList.remove('w-dyn-bind-empty');
            }
        });

        // Populate My Role
        const roleElements = document.querySelectorAll('.text-block-5.w-dyn-bind-empty');
        roleElements.forEach((element, index) => {
            if (index === 0 && project['My Role']) {
                element.textContent = project['My Role'];
                element.classList.remove('w-dyn-bind-empty');
            }
            if (index === 1 && project['Timeline']) {
                element.textContent = project['Timeline'];
                element.classList.remove('w-dyn-bind-empty');
            }
        });

        // Populate timeline/status info at the top
        const topInfoElements = document.querySelectorAll('.paragraph-top-content.smaller .text-size-small.w-dyn-bind-empty');
        if (topInfoElements.length >= 2) {
            if (project['Project Description']) {
                topInfoElements[0].textContent = project['Project Description'];
                topInfoElements[0].classList.remove('w-dyn-bind-empty');
            }
            if (project.Year) {
                topInfoElements[1].textContent = project.Year;
                topInfoElements[1].classList.remove('w-dyn-bind-empty');
            }
        }

        // Populate metrics/numbers
        this.populateMetrics(project);

        // Populate prototype link
        this.populatePrototypeLink(project);

        // Populate gallery images
        this.populateGallery(project);

        // Store current project
        this.currentProject = project;
    }

    // Populate metrics section
    populateMetrics(project) {
        const metricsElements = document.querySelectorAll('.big-numbers');
        if (metricsElements.length > 0) {
            const numbers = [project['Number 1'], project['Number 2'], project['Number 3']];
            const descriptions = [
                project['Number_Description_1'],
                project['Number_Description_2'], 
                project['Number_Description_3']
            ];

            metricsElements.forEach((element, index) => {
                if (numbers[index]) {
                    const numberEl = element.querySelector('.metrics-size.w-dyn-bind-empty');
                    const descEl = element.querySelector('.text-size-medium.w-dyn-bind-empty');
                    
                    if (numberEl) {
                        numberEl.textContent = numbers[index];
                        numberEl.classList.remove('w-dyn-bind-empty');
                    }
                    if (descEl && descriptions[index]) {
                        descEl.textContent = descriptions[index];
                        descEl.classList.remove('w-dyn-bind-empty');
                    }
                }
            });
        }
    }

    // Populate prototype link
    populatePrototypeLink(project) {
        if (project['Prototype Link']) {
            const prototypeButton = document.querySelector('a[data-w-id="44e83567-b53c-1ddf-9dce-30d53ca330e6"]');
            if (prototypeButton) {
                prototypeButton.href = project['Prototype Link'];
            }
        }
    }

    // Populate gallery images
    populateGallery(project) {
        if (project['Gallery final']) {
            const galleryUrls = project['Gallery final'].split(';').map(url => url.trim()).filter(url => url);
            
            // Find gallery container or create one
            let galleryContainer = document.querySelector('.gallery-container');
            if (!galleryContainer) {
                galleryContainer = document.createElement('div');
                galleryContainer.className = 'gallery-container';
                
                // Insert after the main content
                const mainContent = document.querySelector('.margin-blog');
                if (mainContent) {
                    mainContent.parentNode.insertBefore(galleryContainer, mainContent.nextSibling);
                }
            }

            // Clear existing gallery
            galleryContainer.innerHTML = '';

            // Add gallery images
            galleryUrls.forEach(url => {
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'project-image-wrapper margin-bottom';
                imgWrapper.innerHTML = `
                    <div class="mask-frame-works"></div>
                    <img loading="lazy" src="${url}" alt="Project Image" class="image">
                `;
                galleryContainer.appendChild(imgWrapper);
            });
        }
    }

    // Initialize the loader
    async initialize() {
        await this.loadCSVData();
        
        // Get project slug from URL parameter
        const projectSlug = this.getUrlParameter('project') || this.getUrlParameter('slug');
        
        if (projectSlug) {
            const project = this.getProjectBySlug(projectSlug);
            if (project) {
                this.populateProjectData(project);
            } else {
                console.error('Project not found:', projectSlug);
            }
        } else {
            // Try to detect which template we're on and load a default project
            const path = window.location.pathname;
            if (path.includes('detail_works-with-code')) {
                const firstProject = this.worksWithCodesData[0];
                if (firstProject) this.populateProjectData(firstProject);
            } else if (path.includes('detail_works')) {
                const firstProject = this.worksData[0];
                if (firstProject) this.populateProjectData(firstProject);
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const loader = new CSVContentLoader();
    loader.initialize();
});

// Export for use in other scripts
window.CSVContentLoader = CSVContentLoader;