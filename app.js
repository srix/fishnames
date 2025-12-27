
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cardView = document.getElementById('card-view');
    const tableView = document.getElementById('table-view');
    const btnCardView = document.getElementById('btn-card-view');
    const btnTableView = document.getElementById('btn-table-view');
    const searchInput = document.getElementById('search-input');
    const fishTable = document.getElementById('fish-table');
    const fishTableHead = fishTable.querySelector('thead tr');
    const fishTableBody = document.getElementById('fish-table-body');
    const noResults = document.getElementById('no-results');

    // Column Controls
    const tableControls = document.getElementById('table-controls');
    const btnCustomizeCols = document.getElementById('btn-customize-cols');
    const colDialog = document.getElementById('column-selector-dialog');
    const colCheckboxes = document.getElementById('column-checkboxes');
    const btnCloseCols = document.getElementById('btn-close-cols');

    let fishData = [];

    // Config
    const SUPPORTED_LANGUAGES = [
        "assamese", "bengali", "bodo", "dogri", "gujarati", "hindi", "kannada",
        "kashmiri", "konkani", "maithili", "malayalam", "manipuri", "marathi",
        "nepali", "odia", "punjabi", "sanskrit", "santali", "sindhi", "tamil",
        "telugu", "urdu"
    ];

    const DEFAULT_LANGUAGES = ["hindi", "tamil", "malayalam", "kannada", "telugu"];
    let activeColumns = JSON.parse(localStorage.getItem('fishColumns')) || DEFAULT_LANGUAGES;

    // Initialize
    init();

    async function init() {
        try {
            const response = await fetch('data/fish.json');
            fishData = await response.json();

            // Restore view state
            const savedView = localStorage.getItem('fishView') || 'card';
            renderApp(fishData);
            switchView(savedView); // Set correct view after render
            renderColumnSelector();
        } catch (error) {
            console.error('Failed to load fish data:', error);
            cardView.innerHTML = '<p class="error">Failed to load data. Please try again.</p>';
        }

        // Event Listeners
        btnCardView.addEventListener('click', () => switchView('card'));
        btnTableView.addEventListener('click', () => switchView('table'));
        searchInput.addEventListener('input', handleSearch);

        btnCustomizeCols.addEventListener('click', () => {
            colDialog.hidden = !colDialog.hidden;
        });

        btnCloseCols.addEventListener('click', () => {
            colDialog.hidden = true;
        });
    }

    function renderApp(data) {
        renderCards(data);
        renderTable(data);

        if (data.length === 0) {
            noResults.hidden = false;
        } else {
            noResults.hidden = true;
        }
    }

    function renderCards(data) {
        cardView.innerHTML = '';
        data.forEach(fish => {
            const card = document.createElement('div');
            card.className = 'fish-card';

            // Prioritize Default Languages
            const defaultLangs = DEFAULT_LANGUAGES.filter(l => fish.names[l]);
            const otherLangs = SUPPORTED_LANGUAGES.filter(l => !DEFAULT_LANGUAGES.includes(l) && fish.names[l]);

            const renderGrid = (langs) => langs.map(lang => `
                <div class="lang-group">
                    <span class="lang-label">${lang}</span>
                    <span class="lang-value">${fish.names[lang] ? fish.names[lang].join(' / ') : '-'}</span>
                </div>
            `).join('');

            card.innerHTML = `
                <div class="fish-header">
                    <img src="${fish.photo}" alt="${fish.names.english[0]}" class="fish-thumbnail" onerror="this.src='https://placehold.co/60x60?text=Fish'">
                    <div class="fish-title">
                        <h2>${fish.names.english.join(' / ')}</h2>
                        <div class="scientific-name">${fish.scientificName}</div>
                    </div>
                </div>
                
                <div class="fish-names-grid">
                    ${renderGrid(defaultLangs)}
                </div>
                
                ${otherLangs.length > 0 ? `
                    <details class="more-langs">
                        <summary>Show all 22 languages</summary>
                        <div class="fish-names-grid dense">
                            ${renderGrid(otherLangs)}
                        </div>
                    </details>
                ` : ''}

                ${fish.notes ? `<div class="fish-notes">💡 ${fish.notes}</div>` : ''}
            `;
            cardView.appendChild(card);
        });
    }

    function renderTable(data) {
        // Render Header
        fishTableHead.innerHTML = `
            <th class="sticky-col">Fish</th>
            ${activeColumns.map(lang => `<th>${lang.charAt(0).toUpperCase() + lang.slice(1)}</th>`).join('')}
            <th>Details</th>
        `;

        // Render Body
        fishTableBody.innerHTML = '';
        data.forEach(fish => {
            const row = document.createElement('tr');

            const cols = activeColumns.map(lang => {
                const val = fish.names[lang] ? fish.names[lang].join('<br>') : '-';
                return `<td>${val}</td>`;
            }).join('');

            row.innerHTML = `
                <td class="sticky-col">
                    <div class="table-fish-name">
                        <span>${fish.names.english[0]}</span>
                        <img src="${fish.photo}" class="table-thumb" onerror="this.src='https://placehold.co/80x80?text=F'">
                    </div>
                </td>
                ${cols}
                <td>${fish.notes || '-'}</td>
            `;
            fishTableBody.appendChild(row);
        });
    }

    function renderColumnSelector() {
        colCheckboxes.innerHTML = SUPPORTED_LANGUAGES.map(lang => `
            <label class="col-option">
                <input type="checkbox" value="${lang}" ${activeColumns.includes(lang) ? 'checked' : ''}>
                ${lang.charAt(0).toUpperCase() + lang.slice(1)}
            </label>
        `).join('');

        colCheckboxes.querySelectorAll('input').forEach(cb => {
            cb.addEventListener('change', (e) => {
                if (e.target.checked) {
                    if (!activeColumns.includes(e.target.value)) activeColumns.push(e.target.value);
                } else {
                    activeColumns = activeColumns.filter(l => l !== e.target.value);
                }
                localStorage.setItem('fishColumns', JSON.stringify(activeColumns));
                renderTable(fishData);
            });
        });
    }

    function switchView(view) {
        localStorage.setItem('fishView', view);
        if (view === 'card') {
            cardView.hidden = false;
            tableView.hidden = true;
            tableControls.hidden = true;
            btnCardView.classList.add('active');
            btnTableView.classList.remove('active');
        } else {
            cardView.hidden = true;
            tableView.hidden = false;
            tableControls.hidden = false;
            btnCardView.classList.remove('active');
            btnTableView.classList.add('active');
        }
    }

    function handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();

        const filtered = fishData.filter(fish => {
            if (fish.notes && fish.notes.toLowerCase().includes(query)) return true;
            if (fish.scientificName && fish.scientificName.toLowerCase().includes(query)) return true;

            for (const [lang, names] of Object.entries(fish.names)) {
                if (names.some(n => n.toLowerCase().includes(query))) return true;
            }

            return false;
        });

        renderApp(filtered);
    }
});
