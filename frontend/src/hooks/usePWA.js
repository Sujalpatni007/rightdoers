import { useState, useEffect, useCallback } from 'react';

/**
 * PWA Hook for HI AI-APP
 * 
 * Features:
 * - Online/Offline detection
 * - Service Worker registration
 * - Install prompt handling
 * - Cache management
 * - Background sync
 * 
 * Mission: 7G Neom City → Nagara Village (Thirthahalli)
 */

export function usePWA() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [swVersion, setSwVersion] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Check if app is installed
  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = window.navigator.standalone === true;
      setIsInstalled(isStandalone || isIOS);
    };
    
    checkInstalled();
    
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkInstalled);
    return () => {
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkInstalled);
    };
  }, []);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('[HI AI-APP] Network: Online');
      
      // Trigger background sync
      if (swRegistration && 'sync' in swRegistration) {
        swRegistration.sync.register('sync-gemma-conversations').catch(err => {
          console.log('[HI AI-APP] Background sync registration failed:', err);
        });
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      console.log('[HI AI-APP] Network: Offline - Using cached data');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [swRegistration]);

  // Install prompt handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log('[HI AI-APP] Install prompt captured');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('[HI AI-APP] App installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('[HI AI-APP] Service Worker registered:', registration.scope);
          setSwRegistration(registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                  console.log('[HI AI-APP] Update available');
                }
              });
            }
          });
          
          // Get SW version
          if (registration.active) {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
              setSwVersion(event.data.version);
            };
            registration.active.postMessage({ type: 'GET_VERSION' }, [messageChannel.port2]);
          }
        })
        .catch((error) => {
          console.error('[HI AI-APP] Service Worker registration failed:', error);
        });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[HI AI-APP] New service worker activated');
      });
    }
  }, []);

  // Install app
  const installApp = useCallback(async () => {
    if (!deferredPrompt) {
      console.log('[HI AI-APP] No install prompt available');
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[HI AI-APP] Install prompt outcome:', outcome);
      
      setDeferredPrompt(null);
      setIsInstallable(false);
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('[HI AI-APP] Install error:', error);
      return false;
    }
  }, [deferredPrompt]);

  // Update app
  const updateApp = useCallback(() => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, [swRegistration]);

  // Cache Gemma data for offline use
  const cacheGemmaData = useCallback((data) => {
    if (swRegistration && swRegistration.active) {
      swRegistration.active.postMessage({
        type: 'CACHE_GEMMA_DATA',
        payload: data
      });
      console.log('[HI AI-APP] Gemma data sent to service worker for caching');
    }
  }, [swRegistration]);

  // Clear all caches
  const clearCaches = useCallback(async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('[HI AI-APP] All caches cleared');
    }
  }, []);

  // Get cache size
  const getCacheSize = useCallback(async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const { usage, quota } = await navigator.storage.estimate();
      return {
        used: Math.round(usage / 1024 / 1024), // MB
        total: Math.round(quota / 1024 / 1024), // MB
        percentage: Math.round((usage / quota) * 100)
      };
    }
    return null;
  }, []);

  // Request persistent storage
  const requestPersistentStorage = useCallback(async () => {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      const granted = await navigator.storage.persist();
      console.log('[HI AI-APP] Persistent storage:', granted ? 'granted' : 'denied');
      return granted;
    }
    return false;
  }, []);

  return {
    // State
    isOnline,
    isInstallable,
    isInstalled,
    swVersion,
    updateAvailable,
    
    // Actions
    installApp,
    updateApp,
    cacheGemmaData,
    clearCaches,
    getCacheSize,
    requestPersistentStorage
  };
}

/**
 * Hook for offline data storage using IndexedDB
 */
export function useOfflineStorage() {
  const [db, setDb] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize IndexedDB
  useEffect(() => {
    const request = indexedDB.open('hi-ai-app-db', 2);

    request.onerror = (event) => {
      console.error('[HI AI-APP] IndexedDB error:', event);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      // Store for Gemma conversations
      if (!database.objectStoreNames.contains('gemma_conversations')) {
        const convStore = database.createObjectStore('gemma_conversations', { keyPath: 'id', autoIncrement: true });
        convStore.createIndex('language', 'language', { unique: false });
        convStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // Store for cached career data
      if (!database.objectStoreNames.contains('career_data')) {
        const careerStore = database.createObjectStore('career_data', { keyPath: 'category' });
        careerStore.createIndex('language', 'language', { unique: false });
      }
      
      // Store for user profile (works offline)
      if (!database.objectStoreNames.contains('user_profile')) {
        database.createObjectStore('user_profile', { keyPath: 'id' });
      }
      
      // Store for pending sync actions
      if (!database.objectStoreNames.contains('pending_sync')) {
        const syncStore = database.createObjectStore('pending_sync', { keyPath: 'id', autoIncrement: true });
        syncStore.createIndex('type', 'type', { unique: false });
      }
      
      console.log('[HI AI-APP] IndexedDB schema upgraded');
    };

    request.onsuccess = (event) => {
      setDb(event.target.result);
      setIsReady(true);
      console.log('[HI AI-APP] IndexedDB ready');
    };
  }, []);

  // Save conversation
  const saveConversation = useCallback(async (conversation) => {
    if (!db) return null;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['gemma_conversations'], 'readwrite');
      const store = transaction.objectStore('gemma_conversations');
      
      const request = store.add({
        ...conversation,
        timestamp: Date.now()
      });
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  // Get conversations by language
  const getConversations = useCallback(async (language = null, limit = 50) => {
    if (!db) return [];
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['gemma_conversations'], 'readonly');
      const store = transaction.objectStore('gemma_conversations');
      
      let request;
      if (language) {
        const index = store.index('language');
        request = index.getAll(language, limit);
      } else {
        request = store.getAll(null, limit);
      }
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  // Save career data for offline use
  const saveCareerData = useCallback(async (category, language, data) => {
    if (!db) return null;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['career_data'], 'readwrite');
      const store = transaction.objectStore('career_data');
      
      const request = store.put({
        category: `${category}_${language}`,
        language,
        data,
        cached_at: Date.now()
      });
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  // Get career data
  const getCareerData = useCallback(async (category, language) => {
    if (!db) return null;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['career_data'], 'readonly');
      const store = transaction.objectStore('career_data');
      
      const request = store.get(`${category}_${language}`);
      
      request.onsuccess = () => resolve(request.result?.data || null);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  // Add action to sync queue
  const addToSyncQueue = useCallback(async (action) => {
    if (!db) return null;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pending_sync'], 'readwrite');
      const store = transaction.objectStore('pending_sync');
      
      const request = store.add({
        ...action,
        created_at: Date.now()
      });
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  // Process sync queue
  const processSyncQueue = useCallback(async () => {
    if (!db) return [];
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['pending_sync'], 'readwrite');
      const store = transaction.objectStore('pending_sync');
      
      const request = store.getAll();
      
      request.onsuccess = async () => {
        const actions = request.result;
        
        // Process each action
        for (const action of actions) {
          try {
            // Send to server
            const response = await fetch(action.url, {
              method: action.method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.body)
            });
            
            if (response.ok) {
              // Remove from queue
              store.delete(action.id);
            }
          } catch (error) {
            console.log('[HI AI-APP] Sync action failed, will retry:', action.id);
          }
        }
        
        resolve(actions);
      };
      
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  return {
    isReady,
    saveConversation,
    getConversations,
    saveCareerData,
    getCareerData,
    addToSyncQueue,
    processSyncQueue
  };
}

export default usePWA;
