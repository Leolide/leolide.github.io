// Omnibar Logic

const omnibarHTML = `
<div id="omnibar-overlay">
    <div id="omnibar">
        <div class="omnibar-header">
            <svg class="omnibar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="omnibar-input" placeholder="Type a command..." autocomplete="off">
            <span class="omnibar-esc">ESC</span>
        </div>
        <div class="omnibar-results" id="omnibar-results">
            <!-- Items injected here -->
        </div>
    </div>
</div>
<div id="omnibar-toast"></div>
`;

// Inject HTML
document.body.insertAdjacentHTML('beforeend', omnibarHTML);

// State
let isOpen = false;
let selectedIndex = -1;

// Commands
// Dynamic Commands
function getCommands() {
    const isFunPage = window.location.pathname.includes('/fun/') || window.location.pathname.includes('fun.html');

    return [
        {
            label: 'About Me',
            icon: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
            action: () => {
                const section = document.getElementById('About') || document.querySelector('.section-3');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.href = 'index.html#About';
                }
            }
        },
        {
            label: 'Selected Works',
            icon: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>',
            action: () => {
                const section = document.getElementById('SelectedWorks');
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.href = 'index.html#SelectedWorks';
                }
            }
        },
        {
            label: 'Copy Email',
            icon: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',
            action: () => {
                navigator.clipboard.writeText('lideli.leo@gmail.com');
                showToast('Email copied to clipboard');
            }
        },
        {
            label: 'Contact',
            icon: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
            action: () => window.location.href = 'mailto:lideli.leo@gmail.com'
        },
        {
            label: isFunPage ? 'Home Page' : 'Fun Page',
            icon: isFunPage
                ? '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>'
                : '<polygon points="5 3 19 12 5 21 5 3"></polygon>',
            action: () => window.location.href = isFunPage ? 'index.html' : 'fun/'
        },
        {
            label: 'Toggle Debug Mode',
            icon: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>',
            action: () => window.toggleDebugMode()
        },
        {
            label: 'Toggle Terminal',
            icon: '<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>',
            action: () => window.toggleTerminal()
        }
    ];
}

// DOM Elements
const overlay = document.getElementById('omnibar-overlay');
const input = document.getElementById('omnibar-input');
const results = document.getElementById('omnibar-results');
const toast = document.getElementById('omnibar-toast');

// Render List
function renderList(filter = '') {
    const filtered = getCommands().filter(cmd => cmd.label.toLowerCase().includes(filter.toLowerCase()));

    results.innerHTML = filtered.map((cmd, index) => `
        <button class="omnibar-item ${index === selectedIndex ? 'selected' : ''}" data-command="${cmd.label}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${cmd.icon}
            </svg>
            ${cmd.label}
        </button>
    `).join('');
}

// Toggle
function toggleOmnibar() {
    isOpen = !isOpen;
    if (isOpen) {
        overlay.classList.add('active');
        input.value = '';
        input.focus();
        selectedIndex = -1;
        renderList();
    } else {
        overlay.classList.remove('active');
    }
}

// Execute
function execCommand(label) {
    const cmd = getCommands().find(c => c.label === label);
    if (cmd) {
        toggleOmnibar();
        // Execute after a small delay to allow UI to close smoothly
        setTimeout(() => cmd.action(), 100);
    }
}

// Toast
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleOmnibar();
    }
    if (e.key === 'Escape' && isOpen) {
        toggleOmnibar();
    }
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) toggleOmnibar();
});

input.addEventListener('input', (e) => {
    selectedIndex = 0;
    renderList(e.target.value);
});

// Handle clicks on command items
results.addEventListener('click', (e) => {
    const button = e.target.closest('.omnibar-item');
    if (button) {
        const commandLabel = button.getAttribute('data-command');
        if (commandLabel) {
            execCommand(commandLabel);
        }
    }
});

// Handle click on navbar trigger (Event Delegation)
document.addEventListener('click', (e) => {
    if (e.target.closest('.omnibar-trigger')) {
        e.preventDefault();
        toggleOmnibar();
    }
});

