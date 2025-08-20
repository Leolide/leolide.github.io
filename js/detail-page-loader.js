// Detail Page Loader - Populate individual project pages

class DetailPageLoader {
    constructor() {
        this.csvLoader = null;
        this.currentProject = null;
    }

    // Initialize with CSV data
    async initialize() {
        console.log('🚀 Initializing DetailPageLoader...');
        this.csvLoader = new CSVContentLoader();
        let success = await this.csvLoader.loadCSVData();
        
        console.log('📊 CSV Loading result:', success);
        console.log('📋 Works data length:', this.csvLoader.worksData?.length || 0);
        console.log('🗂️ Works with codes data length:', this.csvLoader.worksWithCodesData?.length || 0);
        
        // Use real CSV data if available
        if (success && this.csvLoader.worksWithCodesData && this.csvLoader.worksWithCodesData.length > 0) {
            console.log('✅ Using real CSV data');
            console.log('🎯 Sample project from CSV:', this.csvLoader.worksWithCodesData[0]?.Name);
        } else {
            // Fallback to test data if CSV fails
            console.log('📋 CSV loading failed or empty, trying test data fallback...');
            if (window.TestContentLoader) {
                this.csvLoader = new TestContentLoader();
                success = true;
                console.log('✅ Using test data fallback');
                console.log('🗂️ Test data loaded:', this.csvLoader.worksWithCodesData.length, 'projects');
            } else {
                console.error('❌ TestContentLoader not available');
            }
        }
        
        if (success) {
            this.loadProjectFromURL();
        } else {
            console.error('Failed to load any data');
            this.showErrorMessage();
        }
    }

    // Get project slug from URL parameters
    getProjectSlugFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('project');
    }

    // Find project by slug
    findProjectBySlug(slug) {
        if (!slug) return null;

        // Check works-with-codes first
        let project = this.csvLoader.worksWithCodesData.find(item => item.Slug === slug);
        if (project) {
            return { ...project, _source: 'works-with-codes' };
        }

        // Check regular works
        project = this.csvLoader.worksData.find(item => item.Slug === slug);
        if (project) {
            return { ...project, _source: 'works' };
        }

        return null;
    }

    // Load project based on URL parameter
    loadProjectFromURL() {
        const slug = this.getProjectSlugFromURL();
        this.currentProject = this.findProjectBySlug(slug);
        
        if (this.currentProject) {
            console.log('🚀 Loading project:', this.currentProject.Name, 'Slug:', slug);
            console.log('🗂️ Full project data:', this.currentProject);
            this.populateProjectDetails();
        } else {
            console.error('❌ Project not found:', slug);
            console.log('🔍 Available projects:', this.csvLoader.worksWithCodesData.map(p => ({name: p.Name, slug: p.Slug})));
            this.showProjectNotFound();
        }
    }

    // Populate project details in the page
    populateProjectDetails() {
        if (!this.currentProject) return;

        const project = this.currentProject;

        // Update page title
        document.title = `${project['Bigger Heading'] || project.Name} - Lide Li`;

        // Update main heading
        const mainHeading = document.querySelector('.blog-heading.w-dyn-bind-empty');
        if (mainHeading) {
            mainHeading.textContent = project['Bigger Heading'] || project.Name;
            mainHeading.classList.remove('w-dyn-bind-empty');
        }

        // Update cover image - use Main Image as the big hero image (NOT Sort order 1 image)
        const coverImage = document.querySelector('.cover-image.w-dyn-bind-empty');
        if (coverImage && project['Main Image']) {
            coverImage.src = project['Main Image'];
            coverImage.alt = project.Name;
            coverImage.classList.remove('w-dyn-bind-empty');
            console.log('✅ Set cover image (Main Image):', project['Main Image']);
        } else {
            console.log('❌ No Main Image found for cover');
        }

        // Update project info sections
        this.updateTextBlocks(project);
        
        // Add a delay to ensure DOM is fully loaded and rendered
        setTimeout(() => {
            console.log('Attempting to update project images after DOM load...');
            this.updateProjectImages(project);
        }, 500);
        
        this.handleVideoSection(project);
        
        console.log('Project details populated successfully');
    }

    // Update text content blocks using semantic targeting
    updateTextBlocks(project) {
        // Overview section (rich text)
        const overviewSection = document.querySelector('.align-center-richtext .text-block-5.w-dyn-bind-empty.w-richtext');
        if (overviewSection && project['About the Project']) {
            overviewSection.innerHTML = project['About the Project'];
            overviewSection.classList.remove('w-dyn-bind-empty');
        }

        // My Role section  
        const roleSection = document.querySelector('.text-block-3 + .text-block-5.w-dyn-bind-empty');
        if (roleSection && project['My Role']) {
            if (roleSection.classList.contains('w-richtext')) {
                roleSection.innerHTML = project['My Role'];
            } else {
                roleSection.textContent = project['My Role'];
            }
            roleSection.classList.remove('w-dyn-bind-empty');
        }

        // Team section (rich text)
        const teamSection = document.querySelector('.text-block-2 + .text-block-5.w-dyn-bind-empty.w-richtext');
        if (teamSection && project['Team Members']) {
            teamSection.innerHTML = project['Team Members'];
            teamSection.classList.remove('w-dyn-bind-empty');
        }

        // Timeline section
        const timelineSection = document.querySelector('.text-block-4 + .text-block-5.w-dyn-bind-empty:not(.w-richtext)');
        if (timelineSection && project['Timeline']) {
            timelineSection.textContent = project['Timeline'];
            timelineSection.classList.remove('w-dyn-bind-empty');
        }

        // Header info fields (if any)
        const headerInfoFields = document.querySelectorAll('.paragraph-top-content .text-size-small.w-dyn-bind-empty');
        headerInfoFields.forEach((field, index) => {
            let content = '';
            
            switch(index) {
                case 0:
                    // First field: Show timeline/year info
                    content = project['Year'] || project['Timeline'] || '';
                    break;
                case 1:
                    // Second field: Show project name/slug
                    content = project['Name'] || project['Slug'] || '';
                    break;
            }
            
            if (content) {
                field.textContent = content;
                field.classList.remove('w-dyn-bind-empty');
            }
        });
    }

    // Handle video section visibility based on project
    handleVideoSection(project) {
        const videoSection = document.querySelector('.video-section.debrief-ai');
        if (videoSection) {
            // Only show video section for Debrief AI project
            if (project.Slug === 'debrief-ai' || project.Name === 'Debrief AI') {
                videoSection.style.display = 'block';
                console.log('Showing video section for Debrief AI');
            } else {
                videoSection.style.display = 'none';
                console.log(`Hiding video section for ${project.Name}`);
            }
        }
    }

    // Update project images from gallery
    updateProjectImages(project) {
        // Try multiple selectors to find all placeholder images
        const imageSelectors = [
            '.image.w-dyn-bind-empty',
            '.project-image.w-dyn-bind-empty', 
            'img.w-dyn-bind-empty'
        ];
        
        let images = [];
        imageSelectors.forEach(selector => {
            const found = document.querySelectorAll(selector);
            console.log(`Selector "${selector}" found ${found.length} elements`);
            images.push(...found);
        });
        
        // Remove duplicates
        images = [...new Set(images)];
        
        console.log(`Total ${images.length} unique placeholder images found`);
        images.forEach((img, index) => {
            console.log(`Placeholder ${index + 1}:`, img.src, img.className, img.tagName);
        });
        
        // Get gallery images
        const galleryImages = this.getGalleryImages(project);
        
        console.log(`Found ${galleryImages.length} gallery images for ${project.Name}`);
        console.log('Gallery images:', galleryImages);
        
        // Populate existing image placeholders
        images.forEach((img, index) => {
            if (galleryImages[index]) {
                console.log(`🔄 Setting image ${index + 1} from:`, img.src);
                console.log(`🔄 Setting image ${index + 1} to:`, galleryImages[index]);
                img.src = galleryImages[index];
                img.alt = `${project.Name} - Image ${index + 1}`;
                img.classList.remove('w-dyn-bind-empty');
                console.log(`✅ Populated image ${index + 1}: ${galleryImages[index]}`);
            } else {
                console.log(`❌ No gallery image available for placeholder ${index + 1}`);
            }
        });

        // If we have more images than placeholders, create additional image containers
        if (galleryImages.length > images.length) {
            console.log(`Creating ${galleryImages.length - images.length} additional image containers`);
            this.createAdditionalImageContainers(project, galleryImages, images.length);
        }
    }

    // Extract gallery images from project data in specific order
    getGalleryImages(project) {
        const images = [];
        
        console.log('🔍 Processing images for project:', project.Name, project.Slug);
        console.log('📋 All project fields:', Object.keys(project));
        console.log('🖼️ Available image fields:', Object.keys(project).filter(key => key.includes('image') || key.includes('Image') || key === 'Gallery final'));
        console.log('📊 Gallery final content:', project['Gallery final']);
        console.log('🖼️ Main Image:', project['Main Image']);
        
        // Check if this project has Work images or only Gallery final
        const hasWorkImages = Object.keys(project).some(key => key.startsWith('Work — image #'));
        console.log(`📊 Project has Work images: ${hasWorkImages}`);
        
        if (hasWorkImages) {
            // For projects with Work images: Add Work images #1 to #8 in order (only existing ones)
            console.log('📸 Processing Work images...');
            for (let i = 1; i <= 8; i++) {
                const imageField = project[`Work — image #${i}`];
                console.log(`Checking Work — image #${i}:`, imageField);
                if (imageField && imageField.trim()) {
                    images.push(imageField.trim());
                    console.log(`✅ Added Work image #${i}:`, imageField);
                } else {
                    console.log(`❌ Work — image #${i} is empty or undefined`);
                }
            }
            
            // Then add Gallery final images that aren't already included
            if (project['Gallery final']) {
                console.log(`🔍 Adding remaining Gallery final images...`);
                const galleryImages = project['Gallery final'].split(';').map(url => url.trim()).filter(url => url);
                console.log(`📋 Parsed Gallery final URLs:`, galleryImages);
                
                galleryImages.forEach((imageUrl, index) => {
                    if (imageUrl && !images.includes(imageUrl)) {
                        images.push(imageUrl);
                        console.log(`✅ Added Gallery final image #${index + 1}:`, imageUrl);
                    } else if (images.includes(imageUrl)) {
                        console.log(`⚠️ Duplicate image skipped:`, imageUrl);
                    }
                });
            }
        } else {
            // For projects without Work images (like Clientelling App): Use Gallery final with custom sequencing
            console.log('📸 No Work images found, processing Gallery final sequence...');
            if (project['Gallery final']) {
                console.log(`🔍 Raw Gallery final content:`, project['Gallery final']);
                const galleryImages = project['Gallery final'].split(';').map(url => url.trim()).filter(url => url);
                console.log(`📋 Parsed Gallery final URLs (${galleryImages.length} images):`, galleryImages);
                
                // Add Gallery final images in their original sequence - no weird mapping!
                galleryImages.forEach((imageUrl, index) => {
                    if (imageUrl) {
                        images.push(imageUrl);
                        console.log(`✅ Added Gallery final image #${index + 1}:`, imageUrl);
                    }
                });
                
                console.log(`📊 Added ${images.length} images from Gallery final`);
            } else {
                console.log(`❌ No Gallery final field found`);
            }
        }
        
        // Add Last Image (Conclusion) if exists and not already included
        if (project['Last Image (Conclusion)'] && !images.includes(project['Last Image (Conclusion)'])) {
            images.push(project['Last Image (Conclusion)']);
            console.log('✅ Added Last Image (Conclusion):', project['Last Image (Conclusion)']);
        }
        
        console.log(`🎯 Total gallery images: ${images.length}`);
        console.log(`🖼️ Final image sequence:`, images);
        return images;
    }

    // Create additional image containers for extra gallery images
    createAdditionalImageContainers(project, galleryImages, startIndex) {
        const aboutProjectContainer = document.querySelector('.about-the-project');
        if (!aboutProjectContainer) return;

        console.log(`Creating additional containers for ${galleryImages.length - startIndex} extra images`);
        
        // Create additional image containers for remaining images
        for (let i = startIndex; i < galleryImages.length; i++) {
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'project-image-wrapper';
            
            const maskFrame = document.createElement('div');
            maskFrame.className = 'mask-frame-works';
            
            const img = document.createElement('img');
            img.src = galleryImages[i];
            img.alt = `${project.Name} - Image ${i + 1}`;
            img.loading = 'lazy';
            img.className = 'project-image';
            
            imageWrapper.appendChild(maskFrame);
            imageWrapper.appendChild(img);
            aboutProjectContainer.appendChild(imageWrapper);
            
            console.log(`Created additional image container ${i + 1}: ${galleryImages[i]}`);
        }
    }

    // Show error message
    showErrorMessage() {
        const container = document.querySelector('.main-wrapper') || document.body;
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: #666;">
                <h1>Unable to Load Project</h1>
                <p>There was an error loading the project data. Please check the console for details.</p>
                <p><small>CSV files may need to be served from a web server to work properly.</small></p>
                <a href="index.html" style="color: #fe4f32; text-decoration: none;">← Back to Home</a>
            </div>
        `;
    }

    // Show project not found message
    showProjectNotFound() {
        const container = document.querySelector('.main-wrapper') || document.body;
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem; color: #666;">
                <h1>Project Not Found</h1>
                <p>The requested project could not be found.</p>
                <a href="index.html" style="color: #fe4f32; text-decoration: none;">← Back to Home</a>
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only run on detail pages
    if (window.location.pathname.includes('detail_works-with-code.html') || 
        window.location.pathname.includes('detail_works.html')) {
        
        const detailLoader = new DetailPageLoader();
        detailLoader.initialize();
    }
});

// Export for use in other scripts
window.DetailPageLoader = DetailPageLoader;