(function() {
    'use strict';

    function scaleIframeContent(iframe, isInitial) {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const wrapper = iframeDoc.querySelector('.mockup-scale-wrapper');
            
            if (!wrapper) return;

            const container = iframe.parentElement;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            // Hide during initial calculation to prevent flash
            if (isInitial) {
                wrapper.style.opacity = '0';
                wrapper.style.transition = 'none';
            }

            wrapper.style.transform = 'none';
            
            const contentWidth = wrapper.scrollWidth;
            const contentHeight = wrapper.scrollHeight;

            const scaleX = containerWidth / contentWidth;
            const scaleY = containerHeight / contentHeight;
            const scale = Math.min(scaleX, scaleY) * 0.85;

            // Apply scale immediately without transition for initial load
            if (isInitial) {
                wrapper.style.transform = `scale(${scale})`;
                // Force reflow then fade in
                wrapper.offsetHeight;
                wrapper.style.transition = 'opacity 0.3s ease, transform 0.2s ease';
                wrapper.style.opacity = '1';
            } else {
                wrapper.style.transform = `scale(${scale})`;
            }
        } catch (e) {
            console.log('Could not scale iframe:', e);
        }
    }

    function initIframeScaling() {
        const iframes = document.querySelectorAll('.mockup-iframe');
        
        iframes.forEach(iframe => {
            iframe.addEventListener('load', function() {
                setTimeout(() => scaleIframeContent(iframe, true), 100);
            });
            
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                setTimeout(() => scaleIframeContent(iframe, true), 100);
            }
        });

        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                iframes.forEach(iframe => scaleIframeContent(iframe, false));
            }, 150);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIframeScaling);
    } else {
        initIframeScaling();
    }
})();
