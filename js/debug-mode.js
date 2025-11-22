// Debug Mode Logic

let spacingTooltip = null;

function createSpacingTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'debug-spacing-tooltip';
    tooltip.id = 'debug-spacing-tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
    return tooltip;
}

function updateSpacingTooltip(element, event) {
    if (!spacingTooltip) return;

    const styles = window.getComputedStyle(element);

    // Get padding values
    const paddingTop = parseInt(styles.paddingTop);
    const paddingRight = parseInt(styles.paddingRight);
    const paddingBottom = parseInt(styles.paddingBottom);
    const paddingLeft = parseInt(styles.paddingLeft);

    // Get margin values
    const marginTop = parseInt(styles.marginTop);
    const marginRight = parseInt(styles.marginRight);
    const marginBottom = parseInt(styles.marginBottom);
    const marginLeft = parseInt(styles.marginLeft);

    // Build tooltip content
    const roundTo4 = (val) => Math.round(val / 4) * 4;
    const content = `
        <div class="spacing-row"><span class="spacing-label">Padding</span></div>
        <div class="spacing-row"><span class="spacing-label">↑</span><span class="spacing-value padding">${roundTo4(paddingTop)}px</span></div>
        <div class="spacing-row"><span class="spacing-label">→</span><span class="spacing-value padding">${roundTo4(paddingRight)}px</span></div>
        <div class="spacing-row"><span class="spacing-label">↓</span><span class="spacing-value padding">${roundTo4(paddingBottom)}px</span></div>
        <div class="spacing-row"><span class="spacing-label">←</span><span class="spacing-value padding">${roundTo4(paddingLeft)}px</span></div>
        <div class="spacing-divider"></div>
        <div class="spacing-row"><span class="spacing-label">Margin</span></div>
        <div class="spacing-row"><span class="spacing-label">↑</span><span class="spacing-value margin">${roundTo4(marginTop)}px</span></div>
        <div class="spacing-row"><span class="spacing-label">→</span><span class="spacing-value margin">${roundTo4(marginRight)}px</span></div>
        <div class="spacing-row"><span class="spacing-label">↓</span><span class="spacing-value margin">${roundTo4(marginBottom)}px</span></div>
        <div class="spacing-row"><span class="spacing-label">←</span><span class="spacing-value margin">${roundTo4(marginLeft)}px</span></div>
    `;

    spacingTooltip.innerHTML = content;
    spacingTooltip.style.display = 'block';

    // Position tooltip near cursor
    const x = event.clientX + 15;
    const y = event.clientY + 15;

    spacingTooltip.style.left = `${x}px`;
    spacingTooltip.style.top = `${y}px`;
}

function hideSpacingTooltip() {
    if (spacingTooltip) {
        spacingTooltip.style.display = 'none';
    }
}

function enableSpacingInspector() {
    document.addEventListener('mouseover', (e) => {
        if (!document.body.classList.contains('debug-mode')) return;
        if (e.target.id === 'debug-spacing-tooltip') return;
        updateSpacingTooltip(e.target, e);
    });

    document.addEventListener('mouseout', (e) => {
        if (!document.body.classList.contains('debug-mode')) return;
        hideSpacingTooltip();
    });

    document.addEventListener('mousemove', (e) => {
        if (!document.body.classList.contains('debug-mode')) return;
        if (!spacingTooltip || spacingTooltip.style.display === 'none') return;

        const x = e.clientX + 15;
        const y = e.clientY + 15;
        spacingTooltip.style.left = `${x}px`;
        spacingTooltip.style.top = `${y}px`;
    });
}

function toggleDebugMode() {
    const body = document.body;
    body.classList.toggle('debug-mode');
    const isDebug = body.classList.contains('debug-mode');

    if (isDebug) {
        // Add Grid Overlay
        const grid = document.createElement('div');
        grid.className = 'debug-overlay-grid';
        grid.id = 'debug-grid';
        body.appendChild(grid);

        // Add Indicator
        const indicator = document.createElement('div');
        indicator.className = 'debug-indicator';
        indicator.id = 'debug-indicator';
        indicator.innerText = 'Debug Mode';
        indicator.title = 'Click to exit Debug Mode';
        indicator.addEventListener('click', toggleDebugMode);
        body.appendChild(indicator);

        // Create spacing tooltip
        if (!spacingTooltip) {
            spacingTooltip = createSpacingTooltip();
        }

        // Log to Terminal if available
        if (window.logToTerminal) window.logToTerminal('System', 'Debug Mode Activated');

        showToast('Debug Mode: ON');
    } else {
        // Remove Grid
        const grid = document.getElementById('debug-grid');
        if (grid) grid.remove();

        // Remove Indicator
        const indicator = document.getElementById('debug-indicator');
        if (indicator) indicator.remove();

        // Hide spacing tooltip
        hideSpacingTooltip();

        if (window.logToTerminal) window.logToTerminal('System', 'Debug Mode Deactivated');

        showToast('Debug Mode: OFF');
    }
}

// Initialize spacing inspector
enableSpacingInspector();

// Expose to window
window.toggleDebugMode = toggleDebugMode;
