// Terminal Footer Logic

const terminalHTML = `
<div id="terminal-footer">
    <div class="terminal-header" onclick="toggleTerminal()">
        <div class="terminal-title">
            <div class="terminal-status"></div>
            LIDE_OS_TERMINAL_V4.0
        </div>
        <div style="color: #666;">▼</div>
    </div>
    <div class="terminal-body" id="terminal-logs">
        <div class="terminal-line">
            <span class="timestamp">[${new Date().toLocaleTimeString()}]</span>
            <span class="source">System</span>
            <span class="message">Initializing Lide OS... Ready.</span>
        </div>
    </div>
</div>
`;

// Inject HTML
document.body.insertAdjacentHTML('beforeend', terminalHTML);

const terminal = document.getElementById('terminal-footer');
const logs = document.getElementById('terminal-logs');
let isTerminalOpen = false;

function toggleTerminal() {
    isTerminalOpen = !isTerminalOpen;
    if (isTerminalOpen) {
        terminal.classList.add('open');
    } else {
        terminal.classList.remove('open');
    }
}

function logToTerminal(source, message) {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    const time = new Date().toLocaleTimeString();

    line.innerHTML = `
        <span class="timestamp">[${time}]</span>
        <span class="source">${source}</span>
        <span class="message">${message}</span>
    `;

    logs.appendChild(line);
    logs.scrollTop = logs.scrollHeight;
}

// Expose
window.toggleTerminal = toggleTerminal;
window.logToTerminal = logToTerminal;

// Event Listeners for Logging
document.addEventListener('click', (e) => {
    const target = e.target.tagName.toLowerCase();
    const text = e.target.innerText.substring(0, 20);
    if (target === 'a' || target === 'button') {
        logToTerminal('User', `Clicked <${target}> "${text}..."`);
    }
});

// Scroll Logging (Throttled)
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScroll > 1000) {
        const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        logToTerminal('System', `Viewport scrolled to ${pct}%`);
        lastScroll = now;
    }
});
