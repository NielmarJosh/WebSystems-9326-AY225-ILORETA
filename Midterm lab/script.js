// Xbox Game Pass Scraper Frontend
let gamesData = [];
let filteredGames = [];
let currentFilter = 'all';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Xbox Game Pass Explorer initialized');
    loadGames();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search input with debounce
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            searchGames();
        }, 300);
    });

    // Mobile menu toggle
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        document.querySelector('.nav-links').classList.toggle('show');
    });

    // Clear search button visibility
    searchInput.addEventListener('input', function() {
        const clearBtn = document.getElementById('clearSearch');
        if (this.value.length > 0) {
            clearBtn.style.display = 'flex';
        } else {
            clearBtn.style.display = 'none';
        }
    });

    // Keyboard shortcut (Ctrl+K)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// Load games from data.json
async function loadGames() {
    showLoading();
    
    try {
        const response = await fetch('data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle both formats (with or without scrape_info)
        if (data.games) {
            gamesData = data.games;
        } else if (Array.isArray(data)) {
            gamesData = data;
        } else {
            gamesData = [];
        }
        
        console.log(`✅ Loaded ${gamesData.length} games from data.json`);
        
        filteredGames = [...gamesData];
        updateAll();
        showNotification(`Loaded ${gamesData.length} games successfully`, 'success');
        
    } catch (error) {
        console.error('Error loading games:', error);
        showNotification('Failed to load data.json. Make sure the file exists.', 'error');
        
        // Load sample data as fallback
        loadSampleData();
    }
}

// Load sample data if JSON fails
function loadSampleData() {
    gamesData = [
        {
            "game_title": "Forza Horizon 6",
            "release_date": "Not Available",
            "key_features": "Discover the breathtaking landscapes of Japan in over 550 real-world cars and become a racing Legend in Forza Horizon's biggest open world driving adventure yet.",
            "platform_availability": "Xbox Console, PC, Cloud Gaming",
            "developer_information": "Not Available",
            "publisher_information": "Not Available"
        },
        {
            "game_title": "Kiln",
            "release_date": "Not Available",
            "key_features": "An online multiplayer pottery party brawler from Double Fine Productions. Assemble a team, sculpt pots on a pottery wheel, and team up to douse the enemy's kiln!",
            "platform_availability": "Xbox Console, PC, Cloud Gaming",
            "developer_information": "Double Fine Productions",
            "publisher_information": "Not Available"
        },
        {
            "game_title": "Fable",
            "release_date": "Not Available",
            "key_features": "Become the Hero you want to be in an immersive open world where each choice shapes your journey, reputation is everything, and fairytale endings are never guaranteed.",
            "platform_availability": "Xbox Console, PC, Cloud Gaming",
            "developer_information": "Playground Games",
            "publisher_information": "Xbox Game Studios"
        },
        {
            "game_title": "Beast of Reincarnation",
            "release_date": "Not Available",
            "key_features": "Explore what it means to be human in Beast of Reincarnation, an expansive one-person, one-dog action RPG built around demanding, technical combat.",
            "platform_availability": "Xbox Console, PC, Cloud Gaming",
            "developer_information": "Not Available",
            "publisher_information": "Not Available"
        },
        {
            "game_title": "Mixtape",
            "release_date": "Not Available",
            "key_features": "On their last night together, three friends embark on one final adventure. Play through a mixtape of memories, set to the soundtrack of a generation.",
            "platform_availability": "Xbox Console, PC, Cloud Gaming",
            "developer_information": "Not Available",
            "publisher_information": "Not Available"
        },
        {
            "game_title": "Fortnite Crew",
            "release_date": "Not Available",
            "key_features": "Get access to the current Battle Pass, OG Pass, LEGO Pass, Music Pass, and Rocket Pass Premium. In addition, get 1,000 V-Bucks each month.",
            "platform_availability": "Xbox Console, PC, Cloud Gaming",
            "developer_information": "Epic Games",
            "publisher_information": "Epic Games"
        },
        {
            "game_title": "Cyberpunk 2077",
            "release_date": "Not Available",
            "key_features": "Play Cyberpunk 2077 with Xbox Game Pass Premium and Ultimate.",
            "platform_availability": "Xbox Console, PC, Cloud Gaming",
            "developer_information": "CD Projekt Red",
            "publisher_information": "CD Projekt"
        },
        {
            "game_title": "Hollow Knight: Silksong",
            "release_date": "Not Available",
            "key_features": "Play Hollow Knight: Silksong with Xbox Game Pass Premium and Ultimate.",
            "platform_availability": "Xbox Console, PC, Cloud Gaming",
            "developer_information": "Team Cherry",
            "publisher_information": "Not Available"
        }
    ];
    
    filteredGames = [...gamesData];
    updateAll();
    showNotification('Loaded sample data (data.json not found)', 'warning');
}

// Update all UI components
function updateAll() {
    displayGames();
    updateStats();
    updateHeroStats();
    updateResultCount();
    updateLastUpdated();
}

// Display games in the grid
function displayGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    const noResults = document.getElementById('noResults');
    
    if (filteredGames.length === 0) {
        gamesGrid.innerHTML = '';
        noResults.style.display = 'flex';
        return;
    }
    
    noResults.style.display = 'none';
    
    let html = '';
    filteredGames.forEach((game, index) => {
        // Check if fields are available
        const title = game.game_title || 'Not Available';
        const releaseDate = game.release_date || 'Not Available';
        const features = game.key_features || 'Not Available';
        const platforms = game.platform_availability || 'Not Available';
        const developer = game.developer_information || 'Not Available';
        const publisher = game.publisher_information || 'Not Available';
        
        // Platform icons
        const hasXbox = platforms.toLowerCase().includes('xbox');
        const hasPC = platforms.toLowerCase().includes('pc');
        const hasCloud = platforms.toLowerCase().includes('cloud');
        
        html += `
            <div class="game-card" style="animation-delay: ${index * 0.05}s">
                <div class="game-card-header">
                    <h3 class="game-title">${escapeHtml(title)}</h3>
                    <div class="platform-icons">
                        ${hasXbox ? '<i class="fa-brands fa-xbox" title="Xbox"></i>' : ''}
                        ${hasPC ? '<i class="fas fa-desktop" title="PC"></i>' : ''}
                        ${hasCloud ? '<i class="fas fa-cloud" title="Cloud Gaming"></i>' : ''}
                    </div>
                </div>
                
                <div class="game-badges">
                    <span class="badge ${releaseDate === 'Not Available' ? 'badge-missing' : 'badge-date'}">
                        <i class="fas fa-calendar-alt"></i> ${releaseDate}
                    </span>
                </div>
                
                <p class="game-description">${escapeHtml(features)}</p>
                
                <div class="game-details">
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-code"></i> Developer:</span>
                        <span class="detail-value ${developer === 'Not Available' ? 'missing' : ''}">${escapeHtml(developer)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-building"></i> Publisher:</span>
                        <span class="detail-value ${publisher === 'Not Available' ? 'missing' : ''}">${escapeHtml(publisher)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    gamesGrid.innerHTML = html;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update statistics
function updateStats() {
    const statsGrid = document.getElementById('statsGrid');
    
    const totalGames = gamesData.length;
    const withRelease = gamesData.filter(g => g.release_date && g.release_date !== 'Not Available').length;
    const withDeveloper = gamesData.filter(g => g.developer_information && g.developer_information !== 'Not Available').length;
    const withPublisher = gamesData.filter(g => g.publisher_information && g.publisher_information !== 'Not Available').length;
    const xboxGames = gamesData.filter(g => g.platform_availability && g.platform_availability.toLowerCase().includes('xbox')).length;
    const cloudGames = gamesData.filter(g => g.platform_availability && g.platform_availability.toLowerCase().includes('cloud')).length;
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-database"></i></div>
            <div class="stat-content">
                <span class="stat-value">${totalGames}</span>
                <span class="stat-label">Total Games</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-calendar"></i></div>
            <div class="stat-content">
                <span class="stat-value">${withRelease}</span>
                <span class="stat-label">Release Dates</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-code"></i></div>
            <div class="stat-content">
                <span class="stat-value">${withDeveloper}</span>
                <span class="stat-label">Known Developers</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-building"></i></div>
            <div class="stat-content">
                <span class="stat-value">${withPublisher}</span>
                <span class="stat-label">Known Publishers</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fa-brands fa-xbox"></i></div>
            <div class="stat-content">
                <span class="stat-value">${xboxGames}</span>
                <span class="stat-label">Xbox Games</span>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-cloud"></i></div>
            <div class="stat-content">
                <span class="stat-value">${cloudGames}</span>
                <span class="stat-label">Cloud Gaming</span>
            </div>
        </div>
    `;
}

// Update hero stats
function updateHeroStats() {
    document.getElementById('totalGamesHero').textContent = gamesData.length;
    document.getElementById('availableNow').textContent = gamesData.filter(g => 
        g.release_date && g.release_date !== 'Not Available'
    ).length;
}

// Update result count
function updateResultCount() {
    const resultCount = document.getElementById('resultCount');
    if (filteredGames.length === gamesData.length) {
        resultCount.innerHTML = `<i class="fas fa-layer-group"></i> ${filteredGames.length} games`;
    } else {
        resultCount.innerHTML = `<i class="fas fa-filter"></i> ${filteredGames.length}/${gamesData.length} games`;
    }
}

// Update last updated time
function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', { 
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true 
    });
    document.getElementById('footerLastUpdated').textContent = `Today at ${timeString}`;
    document.getElementById('lastUpdatedHero').textContent = timeString;
}

// Search games
function searchGames() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        applyFilter(currentFilter);
    } else {
        filteredGames = gamesData.filter(game => {
            return (game.game_title && game.game_title.toLowerCase().includes(searchTerm)) ||
                   (game.key_features && game.key_features.toLowerCase().includes(searchTerm)) ||
                   (game.developer_information && game.developer_information.toLowerCase().includes(searchTerm)) ||
                   (game.publisher_information && game.publisher_information.toLowerCase().includes(searchTerm));
        });
    }
    
    displayGames();
    updateResultCount();
}

// Filter games
function filterGames(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    applyFilter(filter);
}

// Apply current filter
function applyFilter(filter) {
    switch(filter) {
        case 'all':
            filteredGames = [...gamesData];
            break;
        case 'available':
            filteredGames = gamesData.filter(g => g.release_date && g.release_date !== 'Not Available');
            break;
        case 'xbox':
            filteredGames = gamesData.filter(g => 
                g.platform_availability && g.platform_availability.toLowerCase().includes('xbox')
            );
            break;
        case 'pc':
            filteredGames = gamesData.filter(g => 
                g.platform_availability && g.platform_availability.toLowerCase().includes('pc')
            );
            break;
        case 'cloud':
            filteredGames = gamesData.filter(g => 
                g.platform_availability && g.platform_availability.toLowerCase().includes('cloud')
            );
            break;
        default:
            filteredGames = [...gamesData];
    }
    
    displayGames();
    updateResultCount();
}

// Reset all filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').style.display = 'none';
    currentFilter = 'all';
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach((tab, index) => {
        if (index === 0) tab.classList.add('active');
        else tab.classList.remove('active');
    });
    
    filteredGames = [...gamesData];
    displayGames();
    updateResultCount();
    showNotification('Filters reset', 'info');
}

// Clear search
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').style.display = 'none';
    searchGames();
}

// Refresh data (reload from JSON)
function refreshData() {
    showNotification('Refreshing data...', 'info');
    loadGames();
}

// Show loading state
function showLoading() {
    document.getElementById('gamesGrid').innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading your game collection...</p>
        </div>
    `;
}

// Show notification
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Export to CSV
function exportToCSV() {
    if (gamesData.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }

    const headers = ['Game Title', 'Release Date', 'Key Features', 'Platforms', 'Developer', 'Publisher'];
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    gamesData.forEach(game => {
        const row = [
            `"${(game.game_title || 'Not Available').replace(/"/g, '""')}"`,
            `"${(game.release_date || 'Not Available').replace(/"/g, '""')}"`,
            `"${(game.key_features || 'Not Available').replace(/"/g, '""')}"`,
            `"${(game.platform_availability || 'Not Available').replace(/"/g, '""')}"`,
            `"${(game.developer_information || 'Not Available').replace(/"/g, '""')}"`,
            `"${(game.publisher_information || 'Not Available').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `xbox_gamepass_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('CSV exported successfully!', 'success');
}

// Add export button to panel
document.addEventListener('DOMContentLoaded', function() {
    const panelActions = document.querySelector('.panel-actions');
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn-export';
    exportBtn.innerHTML = '<i class="fas fa-download"></i> Export CSV';
    exportBtn.onclick = exportToCSV;
    panelActions.appendChild(exportBtn);
});``
}
