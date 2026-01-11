// ========================================
// Theme Management
// ========================================

const THEME_KEY = 'pwa-theme';
const themeToggleBtn = document.getElementById('theme-toggle');
const themeColorMeta = document.getElementById('theme-color-meta');

// Theme colors for status bar (matching main app slate palette)
const THEME_COLORS = {
	light: 'rgb(248, 250, 252)',  // --color-background light
	dark: 'rgb(15, 23, 42)'       // --color-background dark
};

function getStoredTheme() {
	return localStorage.getItem(THEME_KEY) || 'light';
}

function setTheme(theme) {
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem(THEME_KEY, theme);

	// Update status bar color
	themeColorMeta.setAttribute('content', THEME_COLORS[theme]);
}

function toggleTheme() {
	const currentTheme = getStoredTheme();
	const newTheme = currentTheme === 'light' ? 'dark' : 'light';
	setTheme(newTheme);
}

// Initialize theme on page load
setTheme(getStoredTheme());

themeToggleBtn.addEventListener('click', toggleTheme);

// ========================================
// PWA Controls
// ========================================

const clearCacheBtn = document.getElementById('clear-cache-btn');
const unregisterBtn = document.getElementById('unregister-btn');
const statusMessage = document.getElementById('status-message');

function showStatus(message, type = '') {
	statusMessage.textContent = message;
	statusMessage.className = 'status ' + type;

	// Auto-clear after 5 seconds
	setTimeout(() => {
		statusMessage.textContent = '';
		statusMessage.className = 'status';
	}, 5000);
}

// Clear all caches
async function clearAllCaches() {
	try {
		const cacheNames = await caches.keys();

		if (cacheNames.length === 0) {
			showStatus('No caches found.', 'success');
			return;
		}

		await Promise.all(cacheNames.map(name => caches.delete(name)));
		showStatus(`Cleared ${cacheNames.length} cache(s) successfully!`, 'success');
	} catch (error) {
		console.error('Error clearing caches:', error);
		showStatus('Failed to clear caches.', 'error');
	}
}

// Unregister all service workers
async function unregisterServiceWorkers() {
	try {
		if (!('serviceWorker' in navigator)) {
			showStatus('Service Workers not supported.', 'error');
			return;
		}

		const registrations = await navigator.serviceWorker.getRegistrations();

		if (registrations.length === 0) {
			showStatus('No Service Workers registered.', 'success');
			return;
		}

		await Promise.all(registrations.map(reg => reg.unregister()));
		showStatus(`Unregistered ${registrations.length} Service Worker(s)!`, 'success');
	} catch (error) {
		console.error('Error unregistering service workers:', error);
		showStatus('Failed to unregister Service Workers.', 'error');
	}
}

clearCacheBtn.addEventListener('click', clearAllCaches);
unregisterBtn.addEventListener('click', unregisterServiceWorkers);

// ========================================
// Service Worker Registration
// ========================================

if ('serviceWorker' in navigator) {
	window.addEventListener('load', async () => {
		try {
			const registration = await navigator.serviceWorker.register('sw.js');
			console.log('SW registered:', registration.scope);
		} catch (error) {
			console.error('SW registration failed:', error);
		}
	});
}