const translations = {
  en: {
    'Start Session': 'Start Session',
    'Complete Session': 'Complete Session',
    'Queued actions': 'Queued actions',
    'Sync Now': 'Sync Now',
    'Offline mode': 'Offline mode',
    'Student PWA': 'Student PWA',
    'You are offline. Actions will be queued.': 'You are offline. Actions will be queued.',
    'Syncing...': 'Syncing...',
    'actions queued for sync': 'actions queued for sync',
    'Online': 'Online',
    'All actions synced': 'All actions synced',
    'Session started': 'Session started',
    'Session completed (queued if offline)': 'Session completed (queued if offline)',
    'Sync failed, will retry': 'Sync failed, will retry',
  },
  hi: {
    'Start Session': 'सत्र प्रारंभ करें',
    'Complete Session': 'सत्र पूर्ण करें',
    'Queued actions': 'कतारबद्ध क्रियाएँ',
    'Sync Now': 'अब सिंक करें',
    'Offline mode': 'ऑफ़लाइन मोड',
    'Student PWA': 'छात्र PWA',
    'You are offline. Actions will be queued.': 'आप ऑफ़लाइन हैं। क्रियाएँ कतार में लगेंगी।',
    'Syncing...': 'सिंक हो रहा है...',
    'actions queued for sync': 'सिंक के लिए कतारबद्ध क्रियाएँ',
    'Online': 'ऑनलाइन',
    'All actions synced': 'सभी क्रियाएँ सिंक हो गईं',
    'Session started': 'सत्र प्रारंभ हुआ',
    'Session completed (queued if offline)': 'सत्र पूर्ण (ऑफ़लाइन होने पर कतारबद्ध)',
    'Sync failed, will retry': 'सिंक विफल, पुनः प्रयास होगा',
  }
};

let currentLang = 'en';
export function setLang(lang) { currentLang = lang; }
export function t(key) {
  return translations[currentLang][key] || key;
}
