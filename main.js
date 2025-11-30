/* ═══════════════════════════════════════════════════════════════
   MICROSOFT DEFENDER FOR CLOUD - DOCUMENTATION SCRIPTS
   Interactive Components & Navigation
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initTabs();
    initAccordions();
    initCodeCopy();
    initSearch();
    initTOC();
    initNavGroups();
    initMobileMenu();
});

/* ─────────────────────────────────────────────────────────────────
   SIDEBAR TOGGLE
   ───────────────────────────────────────────────────────────────── */
function initSidebar() {
    const toggle = document.querySelector('.sidebar-toggle');
    const app = document.querySelector('.app-container');
    
    if (!toggle || !app) return;
    
    // Check for saved state
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
        app.classList.add('sidebar-collapsed');
    }
    
    toggle.addEventListener('click', function() {
        app.classList.toggle('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', app.classList.contains('sidebar-collapsed'));
    });
}

/* ─────────────────────────────────────────────────────────────────
   TABS COMPONENT
   ───────────────────────────────────────────────────────────────── */
function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs');
    
    tabContainers.forEach(container => {
        const buttons = container.querySelectorAll('.tab-btn');
        const panels = container.querySelectorAll('.tab-panel');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Remove active from all
                buttons.forEach(b => b.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                // Add active to clicked
                this.classList.add('active');
                const targetPanel = container.querySelector(`[data-panel="${tabId}"]`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    });
}

/* ─────────────────────────────────────────────────────────────────
   ACCORDIONS
   ───────────────────────────────────────────────────────────────── */
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.accordion-item');
        
        items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            
            header.addEventListener('click', function() {
                const isExpanded = item.classList.contains('expanded');
                
                // Close all items in this accordion (single open mode)
                // Comment out if you want multiple open
                // items.forEach(i => i.classList.remove('expanded'));
                
                // Toggle current
                item.classList.toggle('expanded', !isExpanded);
            });
        });
    });
}

/* ─────────────────────────────────────────────────────────────────
   CODE COPY BUTTON
   ───────────────────────────────────────────────────────────────── */
function initCodeCopy() {
    const copyButtons = document.querySelectorAll('.code-copy-btn');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            const codeBlock = this.closest('.code-block') || this.parentElement.nextElementSibling;
            const code = codeBlock.querySelector('code');
            
            if (!code) return;
            
            try {
                await navigator.clipboard.writeText(code.textContent);
                
                // Visual feedback
                this.classList.add('copied');
                const originalText = this.innerHTML;
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                    Copied!
                `;
                
                setTimeout(() => {
                    this.classList.remove('copied');
                    this.innerHTML = originalText;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
    
    // Auto-add copy buttons to pre blocks without them
    document.querySelectorAll('pre:not(.no-copy)').forEach(pre => {
        if (!pre.previousElementSibling?.classList.contains('code-header')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            
            const header = document.createElement('div');
            header.className = 'code-header';
            
            const lang = pre.querySelector('code')?.className.match(/language-(\w+)/)?.[1] || 'code';
            header.innerHTML = `
                <span class="code-lang">${lang}</span>
                <button class="code-copy-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                        <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                    </svg>
                    Copy
                </button>
            `;
            
            pre.parentNode.insertBefore(header, pre);
        }
    });
    
    // Re-init copy buttons after adding new ones
    document.querySelectorAll('.code-copy-btn:not([data-initialized])').forEach(btn => {
        btn.dataset.initialized = 'true';
        btn.addEventListener('click', async function() {
            const pre = this.closest('.code-header')?.nextElementSibling;
            const code = pre?.querySelector('code') || pre;
            
            if (!code) return;
            
            try {
                await navigator.clipboard.writeText(code.textContent);
                
                this.classList.add('copied');
                const originalText = this.innerHTML;
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                    </svg>
                    Copied!
                `;
                
                setTimeout(() => {
                    this.classList.remove('copied');
                    this.innerHTML = originalText;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
}

/* ─────────────────────────────────────────────────────────────────
   SEARCH FUNCTIONALITY
   ───────────────────────────────────────────────────────────────── */
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchModal = document.querySelector('.search-modal');
    const modalInput = document.querySelector('.search-modal-input');
    const searchResults = document.querySelector('.search-results');
    
    // Search data - will be populated from page index
    let searchIndex = [];
    
    // Load search index
    loadSearchIndex();
    
    async function loadSearchIndex() {
        try {
            const response = await fetch('search-index.json');
            if (response.ok) {
                searchIndex = await response.json();
            }
        } catch (err) {
            // Generate basic index from navigation
            searchIndex = generateBasicIndex();
        }
    }
    
    function generateBasicIndex() {
        const index = [];
        document.querySelectorAll('.nav-item, .nav-subitem').forEach(link => {
            index.push({
                title: link.textContent.trim(),
                path: link.getAttribute('href'),
                section: link.closest('.nav-section')?.querySelector('.nav-section-title')?.textContent || ''
            });
        });
        return index;
    }
    
    // Open modal with keyboard shortcut
    document.addEventListener('keydown', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            openSearchModal();
        }
        
        if (e.key === 'Escape' && searchModal?.classList.contains('active')) {
            closeSearchModal();
        }
    });
    
    // Click on search input opens modal
    if (searchInput) {
        searchInput.addEventListener('focus', function(e) {
            e.preventDefault();
            this.blur();
            openSearchModal();
        });
    }
    
    function openSearchModal() {
        if (!searchModal) return;
        searchModal.classList.add('active');
        modalInput?.focus();
    }
    
    function closeSearchModal() {
        if (!searchModal) return;
        searchModal.classList.remove('active');
        if (modalInput) modalInput.value = '';
        if (searchResults) searchResults.innerHTML = '';
    }
    
    // Close on backdrop click
    searchModal?.addEventListener('click', function(e) {
        if (e.target === searchModal) {
            closeSearchModal();
        }
    });
    
    // Search as you type
    modalInput?.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        
        const results = searchIndex.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.section?.toLowerCase().includes(query)
        ).slice(0, 10);
        
        renderSearchResults(results, query);
    });
    
    // Keyboard navigation in results
    let selectedIndex = -1;
    
    modalInput?.addEventListener('keydown', function(e) {
        const items = searchResults?.querySelectorAll('.search-result-item') || [];
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            updateSelection(items);
        } else if (e.key === 'Enter' && selectedIndex >= 0 && items[selectedIndex]) {
            e.preventDefault();
            window.location.href = items[selectedIndex].getAttribute('href');
        }
    });
    
    function updateSelection(items) {
        items.forEach((item, i) => {
            item.classList.toggle('selected', i === selectedIndex);
        });
        items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
    
    function renderSearchResults(results, query) {
        if (!searchResults) return;
        
        selectedIndex = -1;
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <p>No results found for "${query}"</p>
                </div>
            `;
            return;
        }
        
        searchResults.innerHTML = results.map(item => `
            <a href="${item.path}" class="search-result-item">
                <div class="search-result-title">${highlightMatch(item.title, query)}</div>
                <div class="search-result-path">${item.section} → ${item.title}</div>
            </a>
        `).join('');
    }
    
    function highlightMatch(text, query) {
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

/* ─────────────────────────────────────────────────────────────────
   TABLE OF CONTENTS
   ───────────────────────────────────────────────────────────────── */
function initTOC() {
    const tocContainer = document.querySelector('.toc-list');
    const pageContent = document.querySelector('.page-content');
    
    if (!tocContainer || !pageContent) return;
    
    // Generate TOC from headings
    const headings = pageContent.querySelectorAll('h2, h3, h4');
    
    if (headings.length === 0) return;
    
    headings.forEach((heading, index) => {
        // Add ID if not present
        if (!heading.id) {
            heading.id = `heading-${index}-${slugify(heading.textContent)}`;
        }
        
        const li = document.createElement('li');
        li.className = 'toc-item';
        
        const a = document.createElement('a');
        a.className = `toc-link toc-${heading.tagName.toLowerCase()}`;
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent;
        
        li.appendChild(a);
        tocContainer.appendChild(li);
    });
    
    // Highlight active section on scroll
    const tocLinks = tocContainer.querySelectorAll('.toc-link');
    
    function highlightTOC() {
        let currentSection = null;
        
        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 100) {
                currentSection = heading;
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSection && link.getAttribute('href') === `#${currentSection.id}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', throttle(highlightTOC, 100));
    highlightTOC();
    
    // Smooth scroll on click
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

/* ─────────────────────────────────────────────────────────────────
   NAVIGATION GROUPS (Collapsible)
   ───────────────────────────────────────────────────────────────── */
function initNavGroups() {
    const navGroups = document.querySelectorAll('.nav-group');
    
    navGroups.forEach(group => {
        const header = group.querySelector('.nav-group-header');
        
        header?.addEventListener('click', function() {
            group.classList.toggle('expanded');
            
            // Save state
            const groupId = group.dataset.group;
            if (groupId) {
                const expanded = JSON.parse(localStorage.getItem('navExpanded') || '{}');
                expanded[groupId] = group.classList.contains('expanded');
                localStorage.setItem('navExpanded', JSON.stringify(expanded));
            }
        });
        
        // Restore state
        const groupId = group.dataset.group;
        if (groupId) {
            const expanded = JSON.parse(localStorage.getItem('navExpanded') || '{}');
            if (expanded[groupId]) {
                group.classList.add('expanded');
            }
        }
        
        // Auto-expand if contains active link
        if (group.querySelector('.nav-subitem.active')) {
            group.classList.add('expanded');
        }
    });
}

/* ─────────────────────────────────────────────────────────────────
   MOBILE MENU
   ───────────────────────────────────────────────────────────────── */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.mobile-overlay');
    
    menuBtn?.addEventListener('click', function() {
        sidebar?.classList.toggle('mobile-open');
        overlay?.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    overlay?.addEventListener('click', function() {
        sidebar?.classList.remove('mobile-open');
        overlay?.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
}

/* ─────────────────────────────────────────────────────────────────
   UTILITY FUNCTIONS
   ───────────────────────────────────────────────────────────────── */
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/* ─────────────────────────────────────────────────────────────────
   SYNTAX HIGHLIGHTING (Basic)
   ───────────────────────────────────────────────────────────────── */
function highlightSyntax() {
    // KQL Highlighting
    document.querySelectorAll('code.language-kql, code.language-kusto').forEach(block => {
        let html = block.innerHTML;
        
        // Keywords
        const keywords = ['where', 'project', 'extend', 'summarize', 'join', 'on', 'let', 'datatable', 
                         'union', 'take', 'top', 'sort', 'by', 'asc', 'desc', 'render', 'order',
                         'mv-expand', 'parse', 'evaluate', 'make-series', 'as', 'in', 'has', 'contains',
                         'startswith', 'endswith', 'matches regex', 'and', 'or', 'not', 'between'];
        
        keywords.forEach(kw => {
            const regex = new RegExp(`\\b(${kw})\\b`, 'gi');
            html = html.replace(regex, '<span class="token keyword">$1</span>');
        });
        
        // Functions
        const functions = ['count', 'sum', 'avg', 'min', 'max', 'ago', 'now', 'datetime', 'todatetime',
                          'tostring', 'toint', 'tolong', 'todouble', 'tobool', 'bin', 'floor', 'ceiling',
                          'strlen', 'substring', 'split', 'strcat', 'replace', 'trim', 'tolower', 'toupper',
                          'isempty', 'isnotempty', 'isnull', 'isnotnull', 'iff', 'case', 'coalesce',
                          'pack', 'pack_all', 'bag_keys', 'parse_json', 'todynamic'];
        
        functions.forEach(fn => {
            const regex = new RegExp(`\\b(${fn})\\s*\\(`, 'gi');
            html = html.replace(regex, '<span class="token function">$1</span>(');
        });
        
        // Strings
        html = html.replace(/"([^"\\]|\\.)*"/g, '<span class="token string">"$&"</span>');
        html = html.replace(/'([^'\\]|\\.)*'/g, '<span class="token string">\'$&\'</span>');
        
        // Numbers
        html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="token number">$1</span>');
        
        // Comments
        html = html.replace(/(\/\/.*)$/gm, '<span class="token comment">$1</span>');
        
        // Operators
        html = html.replace(/([=!<>]=?|[+\-*\/|])/g, '<span class="token operator">$1</span>');
        
        block.innerHTML = html;
    });
    
    // PowerShell Highlighting
    document.querySelectorAll('code.language-powershell, code.language-ps1').forEach(block => {
        let html = block.innerHTML;
        
        // Cmdlets
        html = html.replace(/\b([A-Z][a-z]+-[A-Z][a-zA-Z]+)\b/g, '<span class="token function">$1</span>');
        
        // Variables
        html = html.replace(/(\$[\w]+)/g, '<span class="token variable">$1</span>');
        
        // Strings
        html = html.replace(/"([^"\\]|\\.)*"/g, '<span class="token string">$&</span>');
        html = html.replace(/'([^'\\]|\\.)*'/g, '<span class="token string">$&</span>');
        
        // Comments
        html = html.replace(/(#.*)$/gm, '<span class="token comment">$1</span>');
        
        // Parameters
        html = html.replace(/(-[A-Za-z]+)/g, '<span class="token property">$1</span>');
        
        block.innerHTML = html;
    });
    
    // JSON Highlighting
    document.querySelectorAll('code.language-json').forEach(block => {
        let html = block.innerHTML;
        
        // Property names
        html = html.replace(/"([^"]+)":/g, '<span class="token property">"$1"</span>:');
        
        // Strings (values)
        html = html.replace(/: "([^"\\]|\\.)*"/g, ': <span class="token string">"$1"</span>');
        
        // Numbers
        html = html.replace(/: (\d+\.?\d*)/g, ': <span class="token number">$1</span>');
        
        // Booleans and null
        html = html.replace(/: (true|false|null)\b/g, ': <span class="token boolean">$1</span>');
        
        block.innerHTML = html;
    });
}

// Run syntax highlighting on load
document.addEventListener('DOMContentLoaded', highlightSyntax);

/* ─────────────────────────────────────────────────────────────────
   PRINT FUNCTIONALITY
   ───────────────────────────────────────────────────────────────── */
function initPrint() {
    const printBtn = document.querySelector('.print-btn');
    
    printBtn?.addEventListener('click', function() {
        window.print();
    });
}

/* ─────────────────────────────────────────────────────────────────
   EXTERNAL LINK HANDLING
   ───────────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.getAttribute('target')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

/* ─────────────────────────────────────────────────────────────────
   BACK TO TOP BUTTON
   ───────────────────────────────────────────────────────────────── */
function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" />
        </svg>
    `;
    btn.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--accent-blue);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', throttle(function() {
        if (window.scrollY > 500) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    }, 100));
    
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

document.addEventListener('DOMContentLoaded', initBackToTop);

/* ─────────────────────────────────────────────────────────────────
   ANCHOR LINK COPY
   ───────────────────────────────────────────────────────────────── */
document.querySelectorAll('h2[id], h3[id], h4[id]').forEach(heading => {
    heading.style.cursor = 'pointer';
    heading.title = 'Click to copy link';
    
    heading.addEventListener('click', async function() {
        const url = `${window.location.origin}${window.location.pathname}#${this.id}`;
        
        try {
            await navigator.clipboard.writeText(url);
            
            // Visual feedback
            const originalText = this.innerHTML;
            this.innerHTML += ' <span style="color: var(--accent-green); font-size: 0.75em;">✓ Link copied!</span>';
            
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    });
});

/* ─────────────────────────────────────────────────────────────────
   IMAGE ZOOM (Lightbox)
   ───────────────────────────────────────────────────────────────── */
function initImageZoom() {
    const images = document.querySelectorAll('.page-content img:not(.no-zoom)');
    
    images.forEach(img => {
        img.style.cursor = 'zoom-in';
        
        img.addEventListener('click', function() {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                cursor: zoom-out;
                padding: 40px;
            `;
            
            const zoomedImg = document.createElement('img');
            zoomedImg.src = this.src;
            zoomedImg.style.cssText = `
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                animation: fadeIn 0.3s ease;
            `;
            
            overlay.appendChild(zoomedImg);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
            
            overlay.addEventListener('click', function() {
                this.remove();
                document.body.style.overflow = '';
            });
            
            document.addEventListener('keydown', function closeOnEsc(e) {
                if (e.key === 'Escape') {
                    overlay.remove();
                    document.body.style.overflow = '';
                    document.removeEventListener('keydown', closeOnEsc);
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', initImageZoom);

/* ─────────────────────────────────────────────────────────────────
   LOCAL STORAGE FOR USER PREFERENCES
   ───────────────────────────────────────────────────────────────── */
const UserPrefs = {
    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(`mdc-docs-${key}`);
            return value ? JSON.parse(value) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(`mdc-docs-${key}`, JSON.stringify(value));
        } catch (err) {
            console.warn('Failed to save preference:', err);
        }
    },
    
    remove(key) {
        localStorage.removeItem(`mdc-docs-${key}`);
    }
};

// Export for use in other scripts
window.MDCDocs = {
    UserPrefs,
    highlightSyntax,
    throttle,
    debounce,
    slugify
};
