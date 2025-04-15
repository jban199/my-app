/**
 * PWA Core Application Script (app.js)
 * - Registers Service Worker
 * - Handles update notifications
 * - Manages offline state
 */

// ========================
// Configuration
// ========================
const APP_NAME = 'TretAgni';
const UPDATE_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes

// ========================
// Service Worker Registration
// ========================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('https://jban199.github.io/my-app/service-worker.js');
        console.log(`${APP_NAME}: ServiceWorker registration successful`);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, UPDATE_CHECK_INTERVAL);

        // Track updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Update available
                showUpdateToast();
              }
            }
          });
        });
      } catch (err) {
        console.error(`${APP_NAME}: ServiceWorker registration failed`, err);
      }
    });
  }
}

// ========================
// Update Notification
// ========================
function createUpdateToast() {
  const toast = document.createElement('div');
  toast.id = 'update-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 16px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 1000;
    display: none;
    max-width: 300px;
    animation: fadeIn 0.3s;
  `;

  toast.innerHTML = `
    <p style="margin: 0 0 12px 0;">New version available!</p>
    <div style="display: flex; gap: 8px;">
      <button id="update-now" style="
        background: white;
        color: #4CAF50;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        flex: 1;
      ">Update Now</button>
      <button id="update-later" style="
        background: transparent;
        color: white;
        border: 1px solid white;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      ">Later</button>
    </div>
  `;

  document.body.appendChild(toast);
  return toast;
}

function showUpdateToast() {
  const toast = document.getElementById('update-toast') || createUpdateToast();
  toast.style.display = 'block';

  document.getElementById('update-now').addEventListener('click', () => {
    window.location.reload();
  });

  document.getElementById('update-later').addEventListener('click', () => {
    toast.style.display = 'none';
  });

  // Auto-hide after 15 seconds
  setTimeout(() => {
    toast.style.display = 'none';
  }, 15000);
}

// ========================
// Offline Detection
// ========================
function setupOfflineDetection() {
  const offlineBanner = document.createElement('div');
  offlineBanner.id = 'offline-banner';
  offlineBanner.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f44336;
    color: white;
    text-align: center;
    padding: 8px;
    z-index: 999;
    display: none;
  `;
  offlineBanner.textContent = 'You are currently offline. Some features may not be available.';
  document.body.appendChild(offlineBanner);

  window.addEventListener('online', () => {
    offlineBanner.style.display = 'none';
  });

  window.addEventListener('offline', () => {
    offlineBanner.style.display = 'block';
  });

  // Initial check
  if (!navigator.onLine) {
    offlineBanner.style.display = 'block';
  }
}

// ========================
// Initialize App
// ========================
function initApp() {
  registerServiceWorker();
  setupOfflineDetection();

  // Add global styles for toast animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

// Start the application
document.addEventListener('DOMContentLoaded', initApp);

// For modern modules (optional)
// export { initApp }; // Uncomment if using modules
