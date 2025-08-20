// Password Protection System for Protected Projects

class PasswordProtection {
    constructor() {
        this.accessGranted = sessionStorage.getItem('lide_portfolio_access') === 'granted';
        this.protectedProjects = ['a-clientelling-app', 'debrief-ai', 'design-system', 'technology-radar'];
    }

    // Check if current project is protected
    isProtectedProject(projectSlug) {
        return this.protectedProjects.includes(projectSlug);
    }

    // Check if access is granted
    hasAccess() {
        return this.accessGranted;
    }

    // Redirect to password protection page
    redirectToPasswordPage(redirectUrl) {
        const protectionUrl = `password-protection.html?redirect=${encodeURIComponent(redirectUrl)}`;
        window.location.href = protectionUrl;
    }

    // Grant access (called after successful password entry)
    grantAccess() {
        sessionStorage.setItem('lide_portfolio_access', 'granted');
        this.accessGranted = true;
    }

    // Revoke access
    revokeAccess() {
        sessionStorage.removeItem('lide_portfolio_access');
        this.accessGranted = false;
    }

    // Initialize protection for current page
    initializeProtection() {
        const urlParams = new URLSearchParams(window.location.search);
        const projectSlug = urlParams.get('project');
        
        if (projectSlug && this.isProtectedProject(projectSlug) && !this.hasAccess()) {
            this.redirectToPasswordPage(window.location.href);
            return false;
        }
        
        return true;
    }

    // Create protected links with interception
    createProtectedLink(projectSlug, originalUrl) {
        if (this.isProtectedProject(projectSlug)) {
            return this.hasAccess() ? originalUrl : `javascript:void(0)`;
        }
        return originalUrl;
    }

    // Handle protected link clicks
    handleProtectedClick(event, projectSlug, targetUrl) {
        if (this.isProtectedProject(projectSlug) && !this.hasAccess()) {
            event.preventDefault();
            this.redirectToPasswordPage(targetUrl);
            return false;
        }
        return true;
    }

    // Update project URLs in the index to handle protection
    updateProjectUrls() {
        const projectLinks = document.querySelectorAll('a[href*="detail_works-with-code.html"]');
        
        projectLinks.forEach(link => {
            const href = link.getAttribute('href');
            const urlObj = new URL(href, window.location.origin);
            const projectSlug = urlObj.searchParams.get('project');
            
            if (projectSlug && this.isProtectedProject(projectSlug)) {
                link.addEventListener('click', (e) => {
                    if (!this.handleProtectedClick(e, projectSlug, href)) {
                        e.stopPropagation();
                    }
                });
                
                // Add visual indicator for protected projects
                if (!this.hasAccess()) {
                    const existingBadge = link.querySelector('.protected-badge-enhanced');
                    if (!existingBadge) {
                        const badge = document.createElement('div');
                        badge.className = 'protected-badge-enhanced';
                        badge.innerHTML = '🔒 Protected';
                        
                        const imageContainer = link.querySelector('.work-image-container-enhanced');
                        if (imageContainer) {
                            imageContainer.appendChild(badge);
                        }
                    }
                }
            }
        });
    }

    // Show access status in console (for debugging)
    showAccessStatus() {
        console.log(`Password Protection Status: ${this.hasAccess() ? 'Access Granted' : 'Access Required'}`);
        console.log(`Protected Projects: ${this.protectedProjects.join(', ')}`);
    }
}

// Initialize password protection
document.addEventListener('DOMContentLoaded', () => {
    window.passwordProtection = new PasswordProtection();
    
    // Check protection for current page
    const canProceed = window.passwordProtection.initializeProtection();
    
    if (canProceed) {
        // Update project URLs after page loads
        setTimeout(() => {
            window.passwordProtection.updateProjectUrls();
        }, 1000);
    }
    
    // Show status in console
    window.passwordProtection.showAccessStatus();
});

// Export for use in other scripts
window.PasswordProtection = PasswordProtection;