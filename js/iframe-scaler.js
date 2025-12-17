(function() {
    'use strict';

    function scaleIframeContent(iframe) {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const wrapper = iframeDoc.querySelector('.mockup-scale-wrapper');
            
            if (!wrapper) return;

            const container = iframe.parentElement;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            wrapper.style.transform = 'none';
            
            const contentWidth = wrapper.scrollWidth;
            const contentHeight = wrapper.scrollHeight;

            const scaleX = containerWidth / contentWidth;
            const scaleY = containerHeight / contentHeight;
            const scale = Math.min(scaleX, scaleY) * 0.85;

            wrapper.style.transform = `scale(${scale})`;
        } catch (e) {
            console.log('Could not scale iframe:', e);
        }
    }

    function initIframeScaling() {
        const iframes = document.querySelectorAll('.mockup-iframe');
        
        iframes.forEach(iframe => {
            iframe.addEventListener('load', function() {
                setTimeout(() => scaleIframeContent(iframe), 100);
            });
            
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                setTimeout(() => scaleIframeContent(iframe), 100);
            }
        });

        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                iframes.forEach(iframe => scaleIframeContent(iframe));
            }, 150);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIframeScaling);
    } else {
        initIframeScaling();
    }
})();
