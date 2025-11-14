// Configuration
const API_URL = 'http://localhost:3000/api/live'; // Change this to your backend URL in production
const REFRESH_INTERVAL = 10000; // 10 seconds

// State
let streams = [];
let filteredStreams = [];
let refreshInterval = null;

// DOM Elements
const streamsContainer = document.getElementById('streamsContainer');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const retryBtn = document.getElementById('retryBtn');
const noResults = document.getElementById('noResults');
const hashtagInput = document.getElementById('hashtagInput');
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const sortSelect = document.getElementById('sortSelect');
const streamCount = document.getElementById('streamCount');
const lastUpdate = document.getElementById('lastUpdate');
const statusIndicator = document.getElementById('statusIndicator');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchStreams();
    setupEventListeners();
    startAutoRefresh();
});

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    clearSearch.addEventListener('click', clearSearchInput);
    sortSelect.addEventListener('change', handleSort);
    retryBtn.addEventListener('click', fetchStreams);
    
    // Hashtag input - fetch on Enter key or after 1 second of no typing
    let hashtagTimeout;
    hashtagInput.addEventListener('input', () => {
        clearTimeout(hashtagTimeout);
        hashtagTimeout = setTimeout(() => {
            fetchStreams();
        }, 1000); // Wait 1 second after user stops typing
    });
    hashtagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(hashtagTimeout);
            fetchStreams();
        }
    });
}

// Fetch streams from API
async function fetchStreams() {
    try {
        showLoading();
        hideError();
        
        // Build URL with hashtags if provided
        let url = API_URL;
        const hashtags = hashtagInput.value.trim();
        if (hashtags) {
            const params = new URLSearchParams({ hashtags: hashtags });
            url = `${API_URL}?${params.toString()}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch streams');
        }

        if (data.success && data.data) {
            streams = data.data;
            applyFiltersAndSort();
            updateStatusIndicator(true);
            updateLastUpdate();
        } else {
            throw new Error(data.message || 'Invalid response from server');
        }
    } catch (err) {
        console.error('Error fetching streams:', err);
        showError(err.message);
        updateStatusIndicator(false);
    } finally {
        hideLoading();
    }
}

// Display streams
function renderStreams() {
    if (filteredStreams.length === 0) {
        streamsContainer.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    streamsContainer.innerHTML = filteredStreams.map(stream => createStreamCard(stream)).join('');
    
    // Add click handlers to cards
    document.querySelectorAll('.stream-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            window.open(filteredStreams[index].streamUrl, '_blank');
        });
    });
}

// Create stream card HTML
function createStreamCard(stream) {
    const viewerCount = formatNumber(stream.viewerCount);
    const startTime = formatTime(stream.publishedAt);
    
    return `
        <div class="stream-card">
            <div class="thumbnail-container">
                <img src="${stream.thumbnail}" alt="${escapeHtml(stream.title)}" class="thumbnail" 
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3C/svg%3E'">
                <div class="live-badge">LIVE</div>
                <div class="viewer-count">👁 ${viewerCount}</div>
            </div>
            <div class="stream-info">
                <div class="stream-title">${escapeHtml(stream.title)}</div>
                <div class="channel-name">${escapeHtml(stream.channelName)}</div>
                <div class="stream-meta">
                    <div class="start-time">🕐 ${startTime}</div>
                </div>
            </div>
        </div>
    `;
}

// Search functionality
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query) {
        clearSearch.style.display = 'block';
    } else {
        clearSearch.style.display = 'none';
    }
    
    applyFiltersAndSort();
}

function clearSearchInput() {
    searchInput.value = '';
    clearSearch.style.display = 'none';
    applyFiltersAndSort();
}

// Sort functionality
function handleSort() {
    applyFiltersAndSort();
}

// Apply filters and sorting
function applyFiltersAndSort() {
    const query = searchInput.value.toLowerCase().trim();
    
    // Filter
    filteredStreams = streams.filter(stream => {
        if (!query) return true;
        return stream.title.toLowerCase().includes(query) ||
               stream.channelName.toLowerCase().includes(query);
    });
    
    // Sort
    const sortValue = sortSelect.value;
    filteredStreams.sort((a, b) => {
        switch (sortValue) {
            case 'viewers-desc':
                return b.viewerCount - a.viewerCount;
            case 'viewers-asc':
                return a.viewerCount - b.viewerCount;
            case 'time-desc':
                return new Date(b.publishedAt) - new Date(a.publishedAt);
            case 'time-asc':
                return new Date(a.publishedAt) - new Date(b.publishedAt);
            case 'channel-asc':
                return a.channelName.localeCompare(b.channelName);
            case 'channel-desc':
                return b.channelName.localeCompare(a.channelName);
            default:
                return 0;
        }
    });
    
    // Update UI
    streamCount.textContent = `${filteredStreams.length} stream${filteredStreams.length !== 1 ? 's' : ''}`;
    renderStreams();
}

// Auto-refresh
function startAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    
    refreshInterval = setInterval(() => {
        fetchStreams();
    }, REFRESH_INTERVAL);
}

// UI Helpers
function showLoading() {
    loading.style.display = 'block';
    streamsContainer.innerHTML = '';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    error.style.display = 'block';
    errorMessage.textContent = message;
}

function hideError() {
    error.style.display = 'none';
}

function updateStatusIndicator(isActive) {
    statusIndicator.className = `status-indicator ${isActive ? 'active' : 'inactive'}`;
}

function updateLastUpdate() {
    const now = new Date();
    lastUpdate.textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) {
        return 'Just now';
    } else if (diffMins < 60) {
        return `${diffMins}m ago`;
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else {
        return `${diffDays}d ago`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

