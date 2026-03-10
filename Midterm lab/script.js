// Xbox Game Data - Loaded from data.json
let gamesData = [];
let filteredGames = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, loading games from data.json...');
    loadGames();
    
    // Add enter key support for search
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchGames();
        }
    });
    
    // Add keyboard shortcut for search (Ctrl+K or Cmd+K)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
    });
});

// Load games from JSON file
async function loadGames() {
    try {
        // Show loading state
        document.getElementById('gamesGrid').innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i> Loading games from data.json...
            </div>
        `;
        
        // Fetch the JSON file
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
            console.error('Unexpected JSON format:', data);
            gamesData = [];
        }
        
        console.log(`✅ Loaded ${gamesData.length} games from data.json`);
        
        // Initialize filtered games
        filteredGames = [...gamesData];
        
        // Update UI
        displayGames(filteredGames);
        updateStats();
        updateGameCount();
        
        // Update last updated time
        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
        
        // Show success notification
        showNotification(`✅ Loaded ${gamesData.length} games successfully!`, 'success');
        
    } catch (error) {
        console.error('❌ Error loading games:', error);
        document.getElementById('gamesGrid').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Games</h3>
                <p>Could not load data.json file. Make sure the file exists in the same folder as index.html.</p>
                <p class="error-detail">${error.message}</p>
                <button onclick="loadSampleData()" class="retry-btn">
                    <i class="fas fa-redo"></i> Load Sample Data
                </button>
            </div>
        `;
    }
}

// Load sample data if JSON fails
function loadSampleData() {
    gamesData = [
        {
            "game_title": "Starfield",
            "release_date": "September 6, 2023",
            "key_features": "Space exploration, RPG, Open world, Character customization",
            "platform_availability": "Xbox Series X|S, PC",
            "developer_information": "Bethesda Game Studios",
            "publisher_information": "Bethesda Softworks"
        },
        {
            "game_title": "Forza Motorsport",
            "release_date": "October 10, 2023",
            "key_features": "Racing, Simulation, Multiplayer, Realistic graphics",
            "platform_availability": "Xbox Series X|S, PC",
            "developer_information": "Turn 10 Studios",
            "publisher_information": "Xbox Game Studios"
        },
        {
            "game_title": "Halo Infinite",
            "release_date": "December 8, 2021",
            "key_features": "FPS, Multiplayer, Campaign, Battle pass",
            "platform_availability": "Xbox One, Xbox Series X|S, PC",
            "developer_information": "343 Industries",
            "publisher_information": "Xbox Game Studios"
        },
        {
            "game_title": "Gears 5",
            "release_date": "September 10, 2019",
            "key_features": "Third-person shooter, Co-op, Horde mode, Multiplayer",
            "platform_availability": "Xbox One, Xbox Series X|S, PC",
            "developer_information": "The Coalition",
            "publisher_information": "Xbox Game Studios"
        },
        {
            "game_title": "Sea of Thieves",
            "release_date": "March 20, 2018",
            "key_features": "Pirate adventure, Multiplayer, Co-op, Open world",
            "platform_availability": "Xbox One, Xbox Series X|S, PC",
            "developer_information": "Rare",
            "publisher_information": "Xbox Game Studios"
        },
        {
            "game_title": "Microsoft Flight Simulator",
            "release_date": "August 18, 2020",
            "key_features": "Flight simulation, Realistic, Open world, Multiplayer",
            "platform_availability": "Xbox Series X|S, PC",
            "developer_information": "Asobo Studio",
            "publisher_information": "Xbox Game Studios"
        },
        {
            "game_title": "Psychonauts 2",
            "release_date": "August 25, 2021",
            "key_features": "Platformer, Adventure, Comedy, Puzzle",
            "platform_availability": "Xbox One, Xbox Series X|S, PC",
            "developer_information": "Double Fine Productions",
            "publisher_information": "Xbox Game Studios"
        },
        {
            "game_title": "Grounded",
            "release_date": "September 27, 2022",
            "key_features": "Survival, Co-op, Open world, Crafting",
            "platform_availability": "Xbox One, Xbox Series X|S, PC",
            "developer_information": "Obsidian Entertainment",
            "publisher_information": "Xbox Game Studios"
        },
        {
            "game_title": "Pentiment",
            "release_date": "November 15, 2022",
            "key_features": "Historical, Narrative, Mystery, Choice-driven",
            "platform_availability": "Xbox One, Xbox Series X|S, PC",
            "developer_information": "Obsidian Entertainment",
            "publisher_information": "Xbox Game Studios"
        },
        {
            "game_title": "Hi-Fi Rush",
            "release_date": "January 25, 2023",
            "key_features": "Rhythm action, Combat, Stylish, Music-based",
            "platform_availability": "Xbox Series X|S, PC",
            "developer_information": "Tango Gameworks",
            "publisher_information": "Bethesda Softworks"
        }
    ];
    
    filteredGames = [...gamesData];
    displayGames(filteredGames);
    updateStats();
    updateGameCount();
    showNotification('📋 Loaded sample data successfully!', 'info');
}

// Display games in the grid
function displayGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    const noResults = document.getElementById('noResults');
    
    if (games.length === 0) {
        gamesGrid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    let html = '';
    games.forEach((game, index) => {
        html += `
            <div class="game-card" style="animation-delay: ${index * 0.05}s">
                <div class="game-header">
                    <h3 class="game-title">${game.game_title || 'Not Available'}</h3>
                    <span class="release-badge">
                        <i class="fas fa-calendar-alt"></i> ${game.release_date || 'Not Available'}
                    </span>
                </div>
                
                <div class="game-details">
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-star"></i> Features:</span>
                        <span class="detail-value">${game.key_features || 'Not Available'}</span>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-tv"></i> Platforms:</span>
                        <span class="detail-value">${game.platform_availability || 'Not Available'}</span>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-code"></i> Developer:</span>
                        <span class="detail-value">${game.developer_information || 'Not Available'}</span>
                    </div>
                    
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-building"></i> Publisher:</span>
                        <span class="detail-value">${game.publisher_information || 'Not Available'}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    gamesGrid.innerHTML = html;
}

// Update statistics
function updateStats() {
    const statsSection = document.getElementById('statsSection');
    
    const totalGames = gamesData.length;
    const withReleaseDates = gamesData.filter(g => g.release_date && g.release_date !== 'Not Available').length;
    const withDevelopers = gamesData.filter(g => g.developer_information && g.developer_information !== 'Not Available').length;
    const withPublishers = gamesData.filter(g => g.publisher_information && g.publisher_information !== 'Not Available').length;
    
    statsSection.innerHTML = `
        <div class="stat-card">
            <i class="fas fa-database stat-icon"></i>
            <span class="stat-label">Total Games</span>
            <span class="stat-value">${totalGames}</span>
        </div>
        <div class="stat-card">
            <i class="fas fa-calendar stat-icon"></i>
            <span class="stat-label">With Release Dates</span>
            <span class="stat-value">${withReleaseDates}</span>
        </div>
        <div class="stat-card">
            <i class="fas fa-code stat-icon"></i>
            <span class="stat-label">With Developers</span>
            <span class="stat-value">${withDevelopers}</span>
        </div>
        <div class="stat-card">
            <i class="fas fa-building stat-icon"></i>
            <span class="stat-label">With Publishers</span>
            <span class="stat-value">${withPublishers}</span>
        </div>
    `;
}

// Update game count
function updateGameCount() {
    const gameCount = document.getElementById('gameCount');
    if (filteredGames.length === gamesData.length) {
        gameCount.innerHTML = `<i class="fas fa-gamepad"></i> ${gamesData.length} Games`;
    } else {
        gameCount.innerHTML = `<i class="fas fa-filter"></i> ${filteredGames.length}/${gamesData.length} Games`;
    }
}

// Search functionality
function searchGames() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredGames = [...gamesData];
    } else {
        filteredGames = gamesData.filter(game => {
            return (game.game_title && game.game_title.toLowerCase().includes(searchTerm)) ||
                   (game.key_features && game.key_features.toLowerCase().includes(searchTerm)) ||
                   (game.developer_information && game.developer_information.toLowerCase().includes(searchTerm)) ||
                   (game.publisher_information && game.publisher_information.toLowerCase().includes(searchTerm)) ||
                   (game.platform_availability && game.platform_availability.toLowerCase().includes(searchTerm));
        });
    }
    
    displayGames(filteredGames);
    updateGameCount();
    
    if (filteredGames.length === 0) {
        showNotification('🔍 No games found matching your search', 'info');
    } else {
        showNotification(`🔍 Found ${filteredGames.length} games`, 'success');
    }
}

// Reset all filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    filteredGames = [...gamesData];
    displayGames(filteredGames);
    updateGameCount();
    showNotification('✅ Filters reset', 'info');
}

// Export to CSV
function exportToCSV() {
    if (gamesData.length === 0) {
        showNotification('❌ No data to export', 'error');
        return;
    }

    // Create CSV content
    const headers = ['Game Title', 'Release Date', 'Key Features', 'Platforms', 'Developer', 'Publisher'];
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    gamesData.forEach(game => {
        const row = [
            `"${game.game_title || 'Not Available'}"`,
            `"${game.release_date || 'Not Available'}"`,
            `"${game.key_features || 'Not Available'}"`,
            `"${game.platform_availability || 'Not Available'}"`,
            `"${game.developer_information || 'Not Available'}"`,
            `"${game.publisher_information || 'Not Available'}"`
        ];
        csvRows.push(row.join(','));
    });
    
    // Create and download CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `xbox_games_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('📥 CSV file downloaded successfully!', 'success');
}

// Show notification
function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}