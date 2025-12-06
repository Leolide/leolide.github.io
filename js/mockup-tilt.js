document.addEventListener('DOMContentLoaded', function() {
    const mockupContainers = document.querySelectorAll('.mockup-card-container');
    const tiltIntensity = 6;

    mockupContainers.forEach(container => {
        const wrapper = container.querySelector('.mockup-wrapper');
        if (!wrapper) return;

        container.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (mouseY / (rect.height / 2)) * -tiltIntensity;
            const rotateY = (mouseX / (rect.width / 2)) * tiltIntensity;
            
            wrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        container.addEventListener('mouseleave', () => {
            wrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });
});
