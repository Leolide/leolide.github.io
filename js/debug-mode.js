// Debug Mode Logic

let spacingTooltip = null;
let paddingOverlay = null;
let marginOverlay = null;
let measurementLines = null;

function createSpacingTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'debug-spacing-tooltip';
    tooltip.id = 'debug-spacing-tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
    return tooltip;
}

function createOverlays() {
    // Padding overlay
    const padding = document.createElement('div');
    padding.className = 'debug-padding-overlay';
    padding.id = 'debug-padding-overlay';
    padding.style.display = 'none';
    document.body.appendChild(padding);

    // Margin overlay container
    const margin = document.createElement('div');
    margin.className = 'debug-margin-overlay';
    margin.id = 'debug-margin-overlay';
    margin.style.display = 'none';
    document.body.appendChild(margin);

    // Measurement lines container
    const lines = document.createElement('div');
    lines.className = 'debug-measurement-lines';
    lines.id = 'debug-measurement-lines';
    lines.style.display = 'none';
    document.body.appendChild(lines);

    return { padding, margin, lines };
}

function updateSpacingTooltip(element, event) {
    if (!spacingTooltip || !paddingOverlay || !marginOverlay || !measurementLines) return;

    const styles = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

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

    // Update padding overlay
    paddingOverlay.style.display = 'block';
    paddingOverlay.style.left = `${rect.left}px`;
    paddingOverlay.style.top = `${rect.top}px`;
    paddingOverlay.style.width = `${rect.width}px`;
    paddingOverlay.style.height = `${rect.height}px`;

    // Update margin overlay and measurement lines
    updateMarginOverlay(rect, marginTop, marginRight, marginBottom, marginLeft);
    updateMeasurementLines(rect, paddingTop, paddingRight, paddingBottom, paddingLeft, marginTop, marginRight, marginBottom, marginLeft);
}

function updateMarginOverlay(rect, top, right, bottom, left) {
    if (!marginOverlay) return;
    
    marginOverlay.style.display = 'block';
    
    // Clear previous lines
    marginOverlay.innerHTML = '';
    
    // Create margin boxes for each side
    if (top > 0) {
        const marginTop = document.createElement('div');
        marginTop.className = 'debug-margin-box debug-margin-top';
        marginTop.style.left = `${rect.left}px`;
        marginTop.style.top = `${rect.top - top}px`;
        marginTop.style.width = `${rect.width}px`;
        marginTop.style.height = `${top}px`;
        marginOverlay.appendChild(marginTop);
    }
    
    if (right > 0) {
        const marginRight = document.createElement('div');
        marginRight.className = 'debug-margin-box debug-margin-right';
        marginRight.style.left = `${rect.right}px`;
        marginRight.style.top = `${rect.top}px`;
        marginRight.style.width = `${right}px`;
        marginRight.style.height = `${rect.height}px`;
        marginOverlay.appendChild(marginRight);
    }
    
    if (bottom > 0) {
        const marginBottom = document.createElement('div');
        marginBottom.className = 'debug-margin-box debug-margin-bottom';
        marginBottom.style.left = `${rect.left}px`;
        marginBottom.style.top = `${rect.bottom}px`;
        marginBottom.style.width = `${rect.width}px`;
        marginBottom.style.height = `${bottom}px`;
        marginOverlay.appendChild(marginBottom);
    }
    
    if (left > 0) {
        const marginLeft = document.createElement('div');
        marginLeft.className = 'debug-margin-box debug-margin-left';
        marginLeft.style.left = `${rect.left - left}px`;
        marginLeft.style.top = `${rect.top}px`;
        marginLeft.style.width = `${left}px`;
        marginLeft.style.height = `${rect.height}px`;
        marginOverlay.appendChild(marginLeft);
    }
}

function updateMeasurementLines(rect, pTop, pRight, pBottom, pLeft, mTop, mRight, mBottom, mLeft) {
    if (!measurementLines) return;
    
    measurementLines.style.display = 'block';
    measurementLines.innerHTML = '';
    
    const roundTo4 = (val) => Math.round(val / 4) * 4;
    
    // Padding measurement lines
    if (pTop > 0) {
        measurementLines.innerHTML += `
            <div class="debug-measure-line debug-measure-padding" style="
                left: ${rect.left + rect.width / 2 - 1}px;
                top: ${rect.top}px;
                width: 2px;
                height: ${pTop}px;
            ">
                <span class="debug-measure-label">${roundTo4(pTop)}</span>
            </div>
        `;
    }
    
    if (pBottom > 0) {
        measurementLines.innerHTML += `
            <div class="debug-measure-line debug-measure-padding" style="
                left: ${rect.left + rect.width / 2 - 1}px;
                top: ${rect.bottom - pBottom}px;
                width: 2px;
                height: ${pBottom}px;
            ">
                <span class="debug-measure-label">${roundTo4(pBottom)}</span>
            </div>
        `;
    }
    
    if (pLeft > 0) {
        measurementLines.innerHTML += `
            <div class="debug-measure-line debug-measure-padding" style="
                left: ${rect.left}px;
                top: ${rect.top + rect.height / 2 - 1}px;
                width: ${pLeft}px;
                height: 2px;
            ">
                <span class="debug-measure-label">${roundTo4(pLeft)}</span>
            </div>
        `;
    }
    
    if (pRight > 0) {
        measurementLines.innerHTML += `
            <div class="debug-measure-line debug-measure-padding" style="
                left: ${rect.right - pRight}px;
                top: ${rect.top + rect.height / 2 - 1}px;
                width: ${pRight}px;
                height: 2px;
            ">
                <span class="debug-measure-label">${roundTo4(pRight)}</span>
            </div>
        `;
    }
    
    // Margin measurement lines
    if (mTop > 0) {
        measurementLines.innerHTML += `
            <div class="debug-measure-line debug-measure-margin" style="
                left: ${rect.left + rect.width / 2 - 1}px;
                top: ${rect.top - mTop}px;
                width: 2px;
                height: ${mTop}px;
            ">
                <span class="debug-measure-label">${roundTo4(mTop)}</span>
            </div>
        `;
    }
    
    if (mBottom > 0) {
        measurementLines.innerHTML += `
            <div class="debug-measure-line debug-measure-margin" style="
                left: ${rect.left + rect.width / 2 - 1}px;
                top: ${rect.bottom}px;
                width: 2px;
                height: ${mBottom}px;
            ">
                <span class="debug-measure-label">${roundTo4(mBottom)}</span>
            </div>
        `;
    }
    
    if (mLeft > 0) {
        measurementLines.innerHTML += `
            <div class="debug-measure-line debug-measure-margin" style="
                left: ${rect.left - mLeft}px;
                top: ${rect.top + rect.height / 2 - 1}px;
                width: ${mLeft}px;
                height: 2px;
            ">
                <span class="debug-measure-label">${roundTo4(mLeft)}</span>
            </div>
        `;
    }
    
    if (mRight > 0) {
        measurementLines.innerHTML += `
            <div class="debug-measure-line debug-measure-margin" style="
                left: ${rect.right}px;
                top: ${rect.top + rect.height / 2 - 1}px;
                width: ${mRight}px;
                height: 2px;
            ">
                <span class="debug-measure-label">${roundTo4(mRight)}</span>
            </div>
        `;
    }
}

function hideSpacingTooltip() {
    if (spacingTooltip) {
        spacingTooltip.style.display = 'none';
    }
    if (paddingOverlay) {
        paddingOverlay.style.display = 'none';
    }
    if (marginOverlay) {
        marginOverlay.style.display = 'none';
    }
    if (measurementLines) {
        measurementLines.style.display = 'none';
    }
}

function enableSpacingInspector() {
    document.addEventListener('mouseover', (e) => {
        if (!document.body.classList.contains('debug-mode')) return;
        // Ignore debug elements themselves
        if (e.target.id === 'debug-spacing-tooltip' || 
            e.target.id === 'debug-padding-overlay' ||
            e.target.id === 'debug-margin-overlay' ||
            e.target.id === 'debug-measurement-lines' ||
            e.target.closest('.debug-margin-box') ||
            e.target.closest('.debug-measure-line')) {
            return;
        }
        updateSpacingTooltip(e.target, e);
    });

    document.addEventListener('mouseout', (e) => {
        if (!document.body.classList.contains('debug-mode')) return;
        hideSpacingTooltip();
    });

    document.addEventListener('mousemove', (e) => {
        if (!document.body.classList.contains('debug-mode')) return;
        if (!spacingTooltip || spacingTooltip.style.display === 'none') return;

        const x = event.clientX + 15;
        const y = event.clientY + 15;
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

        // Create spacing tooltip and overlays
        if (!spacingTooltip) {
            spacingTooltip = createSpacingTooltip();
        }
        
        if (!paddingOverlay) {
            const overlays = createOverlays();
            paddingOverlay = overlays.padding;
            marginOverlay = overlays.margin;
            measurementLines = overlays.lines;
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

        // Hide spacing tooltip and overlays
        hideSpacingTooltip();

        if (window.logToTerminal) window.logToTerminal('System', 'Debug Mode Deactivated');

        showToast('Debug Mode: OFF');
    }
}

// Initialize spacing inspector
enableSpacingInspector();

// Expose to window
window.toggleDebugMode = toggleDebugMode;
