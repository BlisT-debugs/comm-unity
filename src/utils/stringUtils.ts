
// Helper for removing diacritics (accents) for better search across languages
export function removeDiacritics(str: string): string {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Cache for translations to reduce API calls in low-connectivity areas
const translationCache: Record<string, Record<string, string>> = {};

// Simple text translator with cache support for low-connectivity areas
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!text) return '';
  
  // Check cache first
  if (translationCache[targetLanguage]?.[text]) {
    return translationCache[targetLanguage][text];
  }
  
  // In a real app, this would call a translation API
  // For demo purposes, we'll simulate with simple translations
  let translated = text;
  
  // Mock translation for demonstration
  if (targetLanguage === 'es') { // Spanish
    if (text.includes('Issue')) translated = text.replace(/Issue/g, 'Problema');
    if (text.includes('Community')) translated = translated.replace(/Community/g, 'Comunidad');
    if (text.includes('Search')) translated = translated.replace(/Search/g, 'Buscar');
  } else if (targetLanguage === 'hi') { // Hindi
    if (text.includes('Issue')) translated = text.replace(/Issue/g, 'समस्या');
    if (text.includes('Community')) translated = translated.replace(/Community/g, 'समुदाय');
    if (text.includes('Search')) translated = translated.replace(/Search/g, 'खोज');
  } else if (targetLanguage === 'fr') { // French
    if (text.includes('Issue')) translated = text.replace(/Issue/g, 'Problème');
    if (text.includes('Community')) translated = translated.replace(/Community/g, 'Communauté');
    if (text.includes('Search')) translated = translated.replace(/Search/g, 'Rechercher');
  }
  
  // Cache the result
  if (!translationCache[targetLanguage]) {
    translationCache[targetLanguage] = {};
  }
  translationCache[targetLanguage][text] = translated;
  
  return translated;
}

// Format data for offline storage
export function prepareForOfflineStorage(data: any): string {
  // In a real app, we might compress or transform data to optimize storage
  return JSON.stringify(data);
}

// Parse data from offline storage
export function parseFromOfflineStorage<T>(storedData: string): T | null {
  try {
    return JSON.parse(storedData) as T;
  } catch (e) {
    console.error('Error parsing stored data:', e);
    return null;
  }
}
