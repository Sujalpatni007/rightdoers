/* eslint-disable no-restricted-globals */

/**
 * HI AI-APP - Advanced Offline-First Service Worker
 * 
 * Mission: AI Adoption from 7G Neom City (Saudi Arabia) to 
 *          No-Network Nagara Village (Thirthahalli, Shivamogga, Karnataka)
 * 
 * Designed for: Basic Android phones (₹5,000-10,000)
 * Target regions: Srikakulum (Telugu), Chickmagalur (Kannada), Global
 * 
 * Strategy:
 * - Static assets: Cache First (fast loading)
 * - API responses: Network First with cache fallback
 * - Gemma AI: Full offline cache for career guidance
 * - Background sync: Queue actions when offline
 */

const APP_VERSION = '2.0.0';
const CACHE_STATIC = `hi-ai-static-v${APP_VERSION}`;
const CACHE_API = `hi-ai-api-v${APP_VERSION}`;
const CACHE_GEMMA = `hi-ai-gemma-v${APP_VERSION}`;
const CACHE_IMAGES = `hi-ai-images-v${APP_VERSION}`;

// ============================================
// STATIC ASSETS TO CACHE
// Core app shell for instant loading
// ============================================
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/welcome',
  '/gemma',
  '/content',
  '/auth',
  '/dp',
  '/jobs4me',
  '/pricing'
];

// ============================================
// API ENDPOINTS TO CACHE FOR OFFLINE
// Critical for Gemma Offline AI
// ============================================
const OFFLINE_API_ENDPOINTS = [
  '/api/gemma/status',
  '/api/gemma/languages',
  '/api/gemma/career-data?language=en&category=lig_workers',
  '/api/gemma/career-data?language=te&category=lig_workers',
  '/api/gemma/career-data?language=kn&category=lig_workers',
  '/api/gemma/quick-questions/en',
  '/api/gemma/quick-questions/te',
  '/api/gemma/quick-questions/kn',
  '/api/gemma/quick-questions/hi',
  '/api/gemma/offline-cache',
  '/api/content/status',
  '/api/content/mantras',
  '/api/content/languages'
];

// ============================================
// GEMMA OFFLINE RESPONSES
// Pre-cached career guidance in multiple languages
// ============================================
const GEMMA_OFFLINE_RESPONSES = {
  "en": {
    "career": "Based on your interests and education, I recommend: 1) Digital Skills for office jobs, 2) Skilled Trades for higher income, 3) Agriculture Tech if you have farming background. What's your education level?",
    "income": "To improve income: 1) Get certified skills through ITI/Skill India, 2) Join government schemes like PMKVY, 3) Learn digital skills, 4) Start small business with SHG support.",
    "government": "Key government schemes: 1) PMKVY (Pradhan Mantri Kaushal Vikas Yojana), 2) Mudra Loan for business, 3) Skill India Digital, 4) National Apprenticeship Scheme.",
    "default": "I'm here to help with career guidance. Ask about: career options, government schemes, skill development, job opportunities."
  },
  "te": {
    "career": "మీ ఆసక్తులు మరియు విద్య ఆధారంగా, నేను సిఫార్సు చేస్తున్నాను: 1) ఆఫీస్ ఉద్యోగాల కోసం డిజిటల్ స్కిల్స్, 2) అధిక ఆదాయం కోసం నైపుణ్య వృత్తులు, 3) వ్యవసాయ నేపథ్యం ఉంటే వ్యవసాయ టెక్. మీ విద్యా స్థాయి ఏమిటి?",
    "income": "ఆదాయాన్ని మెరుగుపరచడానికి: 1) ITI/స్కిల్ ఇండియా ద్వారా సర్టిఫైడ్ స్కిల్స్ పొందండి, 2) PMKVY వంటి ప్రభుత్వ పథకాలలో చేరండి, 3) డిజిటల్ స్కిల్స్ నేర్చుకోండి, 4) SHG సపోర్ట్‌తో చిన్న వ్యాపారం ప్రారంభించండి.",
    "government": "ముఖ్య ప్రభుత్వ పథకాలు: 1) PMKVY, 2) వ్యాపారం కోసం ముద్ర లోన్, 3) స్కిల్ ఇండియా డిజిటల్, 4) నేషనల్ అప్రెంటిస్‌షిప్ స్కీమ్.",
    "default": "నేను కెరీర్ మార్గదర్శనంలో సహాయం చేయడానికి ఇక్కడ ఉన్నాను. అడగండి: కెరీర్ ఆప్షన్లు, ప్రభుత్వ పథకాలు, స్కిల్ డెవలప్‌మెంట్, ఉద్యోగ అవకాశాలు."
  },
  "kn": {
    "career": "ನಿಮ್ಮ ಆಸಕ್ತಿಗಳು ಮತ್ತು ಶಿಕ್ಷಣದ ಆಧಾರದ ಮೇಲೆ, ನಾನು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ: 1) ಕಚೇರಿ ಕೆಲಸಗಳಿಗೆ ಡಿಜಿಟಲ್ ಕೌಶಲ್ಯಗಳು, 2) ಹೆಚ್ಚಿನ ಆದಾಯಕ್ಕೆ ಕುಶಲ ವ್ಯಾಪಾರಗಳು, 3) ಕೃಷಿ ಹಿನ್ನೆಲೆ ಇದ್ದರೆ ಕೃಷಿ ತಂತ್ರಜ್ಞಾನ. ನಿಮ್ಮ ಶಿಕ್ಷಣ ಮಟ್ಟ ಏನು?",
    "income": "ಆದಾಯವನ್ನು ಸುಧಾರಿಸಲು: 1) ITI/ಸ್ಕಿಲ್ ಇಂಡಿಯಾ ಮೂಲಕ ಪ್ರಮಾಣಿತ ಕೌಶಲ್ಯಗಳನ್ನು ಪಡೆಯಿರಿ, 2) PMKVY ನಂತಹ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಲ್ಲಿ ಸೇರಿ, 3) ಡಿಜಿಟಲ್ ಕೌಶಲ್ಯಗಳನ್ನು ಕಲಿಯಿರಿ, 4) SHG ಬೆಂಬಲದೊಂದಿಗೆ ಸಣ್ಣ ವ್ಯಾಪಾರ ಪ್ರಾರಂಭಿಸಿ.",
    "government": "ಪ್ರಮುಖ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು: 1) PMKVY, 2) ವ್ಯಾಪಾರಕ್ಕೆ ಮುದ್ರಾ ಸಾಲ, 3) ಸ್ಕಿಲ್ ಇಂಡಿಯಾ ಡಿಜಿಟಲ್, 4) ರಾಷ್ಟ್ರೀಯ ಅಪ್ರೆಂಟಿಸ್‌ಶಿಪ್ ಯೋಜನೆ.",
    "default": "ನಾನು ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ. ಕೇಳಿ: ವೃತ್ತಿ ಆಯ್ಕೆಗಳು, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಕೌಶಲ್ಯ ಅಭಿವೃದ್ಧಿ, ಉದ್ಯೋಗಾವಕಾಶಗಳು."
  },
  "hi": {
    "career": "आपकी रुचियों और शिक्षा के आधार पर, मैं सुझाव देता हूं: 1) ऑफिस जॉब के लिए डिजिटल स्किल्स, 2) अधिक आय के लिए स्किल्ड ट्रेड्स, 3) खेती की पृष्ठभूमि है तो एग्रीकल्चर टेक। आपका शिक्षा स्तर क्या है?",
    "income": "आय बढ़ाने के लिए: 1) ITI/स्किल इंडिया से सर्टिफाइड स्किल्स पाएं, 2) PMKVY जैसी सरकारी योजनाओं में शामिल हों, 3) डिजिटल स्किल्स सीखें, 4) SHG सपोर्ट से छोटा बिजनेस शुरू करें।",
    "government": "प्रमुख सरकारी योजनाएं: 1) PMKVY, 2) बिजनेस के लिए मुद्रा लोन, 3) स्किल इंडिया डिजिटल, 4) नेशनल अप्रेंटिसशिप स्कीम।",
    "default": "मैं करियर मार्गदर्शन में मदद के लिए यहां हूं। पूछें: करियर विकल्प, सरकारी योजनाएं, स्किल डेवलपमेंट, नौकरी के अवसर।"
  }
};

// ============================================
// CAREER DATA FOR OFFLINE USE
// ============================================
const OFFLINE_CAREER_DATA = {
  "lig_workers": {
    "en": {
      "sectors": [
        { "name": "Digital Skills", "salary": "₹8,000-15,000/month", "training": "3-6 months" },
        { "name": "Agriculture Tech", "salary": "₹10,000-20,000/month", "training": "3 months" },
        { "name": "Healthcare Support", "salary": "₹6,000-12,000/month", "training": "6 months" },
        { "name": "Skilled Trades", "salary": "₹12,000-25,000/month", "training": "6-12 months" }
      ]
    },
    "te": {
      "sectors": [
        { "name": "డిజిటల్ నైపుణ్యాలు", "salary": "₹8,000-15,000/నెల", "training": "3-6 నెలలు" },
        { "name": "వ్యవసాయ టెక్", "salary": "₹10,000-20,000/నెల", "training": "3 నెలలు" },
        { "name": "ఆరోగ్య సహాయం", "salary": "₹6,000-12,000/నెల", "training": "6 నెలలు" },
        { "name": "నైపుణ్య వృత్తులు", "salary": "₹12,000-25,000/నెల", "training": "6-12 నెలలు" }
      ]
    },
    "kn": {
      "sectors": [
        { "name": "ಡಿಜಿಟಲ್ ಕೌಶಲ್ಯಗಳು", "salary": "₹8,000-15,000/ತಿಂಗಳು", "training": "3-6 ತಿಂಗಳು" },
        { "name": "ಕೃಷಿ ತಂತ್ರಜ್ಞಾನ", "salary": "₹10,000-20,000/ತಿಂಗಳು", "training": "3 ತಿಂಗಳು" },
        { "name": "ಆರೋಗ್ಯ ಬೆಂಬಲ", "salary": "₹6,000-12,000/ತಿಂಗಳು", "training": "6 ತಿಂಗಳು" },
        { "name": "ಕುಶಲ ವೃತ್ತಿಗಳು", "salary": "₹12,000-25,000/ತಿಂಗಳು", "training": "6-12 ತಿಂಗಳು" }
      ]
    }
  }
};

// ============================================
// INSTALL EVENT
// Cache static assets and Gemma offline data
// ============================================
self.addEventListener('install', (event) => {
  console.log(`[HI AI-APP v${APP_VERSION}] Installing Service Worker...`);
  console.log('[HI AI-APP] Mission: 7G Neom City → Nagara Village (Thirthahalli)');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_STATIC).then((cache) => {
        console.log('[HI AI-APP] Caching static assets...');
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.log('[HI AI-APP] Some static assets failed to cache:', err);
        });
      }),
      
      // Pre-cache Gemma offline data
      caches.open(CACHE_GEMMA).then((cache) => {
        console.log('[HI AI-APP] Caching Gemma offline data for rural India...');
        
        // Store offline responses
        const gemmaDataResponse = new Response(JSON.stringify({
          responses: GEMMA_OFFLINE_RESPONSES,
          career_data: OFFLINE_CAREER_DATA,
          version: APP_VERSION,
          cached_at: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
        
        return cache.put('/offline/gemma-data.json', gemmaDataResponse);
      })
    ])
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// ============================================
// ACTIVATE EVENT
// Clean up old caches
// ============================================
self.addEventListener('activate', (event) => {
  console.log(`[HI AI-APP v${APP_VERSION}] Activating Service Worker...`);
  
  const currentCaches = [CACHE_STATIC, CACHE_API, CACHE_GEMMA, CACHE_IMAGES];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[HI AI-APP] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[HI AI-APP] Service Worker activated for offline-first experience');
      return self.clients.claim();
    })
  );
});

// ============================================
// FETCH EVENT
// Smart caching strategy
// ============================================
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip Chrome extensions and other origins
  if (!url.origin.includes(self.location.origin) && 
      !url.origin.includes('fonts.googleapis.com') &&
      !url.origin.includes('fonts.gstatic.com')) {
    return;
  }
  
  // Handle Gemma API requests with offline fallback
  if (url.pathname.includes('/api/gemma/chat')) {
    event.respondWith(handleGemmaChat(event.request));
    return;
  }
  
  // Handle other Gemma API requests
  if (url.pathname.includes('/api/gemma/')) {
    event.respondWith(handleGemmaAPI(event.request));
    return;
  }
  
  // Handle general API requests - Network First
  if (url.pathname.includes('/api/')) {
    event.respondWith(handleAPIRequest(event.request));
    return;
  }
  
  // Handle Google Fonts - Cache First (long-lived)
  if (url.origin.includes('fonts.googleapis.com') || 
      url.origin.includes('fonts.gstatic.com')) {
    event.respondWith(handleFonts(event.request));
    return;
  }
  
  // Handle images - Cache First with Network Fallback
  if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)) {
    event.respondWith(handleImages(event.request));
    return;
  }
  
  // Handle static assets - Cache First
  event.respondWith(handleStaticAssets(event.request));
});

// ============================================
// GEMMA CHAT HANDLER
// Full offline support with intelligent fallback
// ============================================
async function handleGemmaChat(request) {
  try {
    // Try network first
    const response = await fetch(request.clone());
    
    if (response.ok) {
      // Cache successful response
      const cache = await caches.open(CACHE_API);
      cache.put(request, response.clone());
      return response;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('[HI AI-APP] Gemma chat offline - using cached response');
    
    // Parse request body for language
    const requestClone = request.clone();
    let language = 'en';
    let query = '';
    
    try {
      const body = await requestClone.json();
      language = body.language || 'en';
      query = body.query || '';
    } catch (e) {
      console.log('[HI AI-APP] Could not parse request body');
    }
    
    // Get offline response
    const offlineResponse = getOfflineGemmaResponse(query, language);
    
    return new Response(JSON.stringify({
      id: `GEMMA-OFFLINE-${Date.now()}`,
      response: offlineResponse,
      language: language,
      is_cached: true,
      offline_mode: true,
      related_resources: [],
      created_at: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Get appropriate offline response based on query keywords
function getOfflineGemmaResponse(query, language) {
  const responses = GEMMA_OFFLINE_RESPONSES[language] || GEMMA_OFFLINE_RESPONSES['en'];
  const queryLower = query.toLowerCase();
  
  // Telugu keywords
  const teluguKeywords = {
    'కెరీర్': 'career', 'ఉద్యోగం': 'career', 'job': 'career',
    'ఆదాయం': 'income', 'salary': 'income', 'income': 'income',
    'ప్రభుత్వ': 'government', 'scheme': 'government', 'pmkvy': 'government'
  };
  
  // Kannada keywords
  const kannadaKeywords = {
    'ವೃತ್ತಿ': 'career', 'ಕೆಲಸ': 'career', 'job': 'career',
    'ಆದಾಯ': 'income', 'salary': 'income', 'income': 'income',
    'ಸರ್ಕಾರ': 'government', 'scheme': 'government', 'pmkvy': 'government'
  };
  
  // English keywords
  const englishKeywords = {
    'career': 'career', 'job': 'career', 'work': 'career',
    'income': 'income', 'salary': 'income', 'money': 'income',
    'government': 'government', 'scheme': 'government', 'pmkvy': 'government', 'mudra': 'government'
  };
  
  const allKeywords = { ...englishKeywords, ...teluguKeywords, ...kannadaKeywords };
  
  for (const [keyword, category] of Object.entries(allKeywords)) {
    if (queryLower.includes(keyword)) {
      return responses[category] || responses['default'];
    }
  }
  
  return responses['default'];
}

// ============================================
// GEMMA API HANDLER
// Cache API responses for offline use
// ============================================
async function handleGemmaAPI(request) {
  try {
    // Network first
    const response = await fetch(request.clone());
    
    if (response.ok) {
      const cache = await caches.open(CACHE_GEMMA);
      cache.put(request, response.clone());
      return response;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('[HI AI-APP] Gemma API offline - checking cache');
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback
    return new Response(JSON.stringify({
      offline: true,
      message: 'Offline mode - using cached data',
      data: OFFLINE_CAREER_DATA
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ============================================
// GENERAL API HANDLER
// Network First with Cache Fallback
// ============================================
async function handleAPIRequest(request) {
  try {
    const response = await fetch(request.clone());
    
    if (response.ok) {
      const cache = await caches.open(CACHE_API);
      cache.put(request, response.clone());
      return response;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(JSON.stringify({
      offline: true,
      error: 'You are offline. Please check your connection.'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ============================================
// GOOGLE FONTS HANDLER
// Cache First for fast loading
// ============================================
async function handleFonts(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request.clone());
    
    if (response.ok) {
      const cache = await caches.open(CACHE_STATIC);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Return empty response for fonts - app will use fallback
    return new Response('', { status: 200 });
  }
}

// ============================================
// IMAGE HANDLER
// Cache First with Network Fallback
// ============================================
async function handleImages(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request.clone());
    
    if (response.ok) {
      const cache = await caches.open(CACHE_IMAGES);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Return placeholder for offline images
    return new Response('', { status: 200 });
  }
}

// ============================================
// STATIC ASSETS HANDLER
// Cache First for instant loading
// ============================================
async function handleStaticAssets(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request.clone());
    
    if (response.ok) {
      const cache = await caches.open(CACHE_STATIC);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // For navigation requests, return cached index
    if (request.mode === 'navigate') {
      const cachedIndex = await caches.match('/');
      if (cachedIndex) {
        return cachedIndex;
      }
    }
    
    return new Response('Offline - Please connect to the internet', { 
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// ============================================
// BACKGROUND SYNC
// Queue actions for when connection returns
// ============================================
const pendingActions = [];

self.addEventListener('sync', (event) => {
  console.log('[HI AI-APP] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-gemma-conversations') {
    event.waitUntil(syncGemmaConversations());
  }
  
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  }
});

async function syncGemmaConversations() {
  console.log('[HI AI-APP] Syncing Gemma conversations...');
  // Sync conversations when online
}

async function syncUserData() {
  console.log('[HI AI-APP] Syncing user data...');
  // Sync user profile data when online
}

// ============================================
// PUSH NOTIFICATIONS
// Engagement for rural users
// ============================================
self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'HI AI-APP',
    body: 'New career opportunity awaits!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png'
  };
  
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }
  
  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [100, 50, 100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      url: notificationData.url || '/gemma'
    },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    tag: 'hi-ai-notification',
    renotify: true
  };
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/gemma';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      
      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// ============================================
// MESSAGE HANDLER
// Communication with main app
// ============================================
self.addEventListener('message', (event) => {
  console.log('[HI AI-APP] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: APP_VERSION });
  }
  
  if (event.data.type === 'CACHE_GEMMA_DATA') {
    cacheGemmaData(event.data.payload);
  }
  
  if (event.data.type === 'GET_OFFLINE_STATUS') {
    event.ports[0].postMessage({ 
      offline: !navigator.onLine,
      version: APP_VERSION,
      caches: [CACHE_STATIC, CACHE_API, CACHE_GEMMA]
    });
  }
});

// Cache Gemma data from main app
async function cacheGemmaData(data) {
  try {
    const cache = await caches.open(CACHE_GEMMA);
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put('/offline/custom-gemma-data.json', response);
    console.log('[HI AI-APP] Custom Gemma data cached');
  } catch (error) {
    console.error('[HI AI-APP] Error caching Gemma data:', error);
  }
}

console.log(`[HI AI-APP v${APP_VERSION}] Service Worker loaded`);
console.log('[HI AI-APP] Ready for: 7G Neom City 🏙️ → Nagara Village 🏘️');
