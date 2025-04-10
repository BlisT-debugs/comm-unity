
import { removeDiacritics } from './stringUtils';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'issue' | 'community' | 'profile';
  category?: string;
  score: number;
  url: string;
}

// Simple relevance scoring that accounts for contextual factors
export function calculateRelevanceScore(
  searchTerm: string, 
  text: string, 
  boostFactors: { 
    isTrusted?: boolean, 
    isLocal?: boolean,
    isRecent?: boolean,
    isPopular?: boolean
  } = {}
): number {
  if (!searchTerm || !text) return 0;
  
  const normalizedSearch = removeDiacritics(searchTerm.toLowerCase());
  const normalizedText = removeDiacritics(text.toLowerCase());
  
  // Basic relevance calculation
  let score = 0;
  
  // Exact match gets highest score
  if (normalizedText.includes(normalizedSearch)) {
    score += 10;
    
    // Bonus for exact word boundaries
    const regex = new RegExp(`\\b${normalizedSearch}\\b`, 'i');
    if (regex.test(normalizedText)) {
      score += 5;
    }
    
    // Title match is more important than just description match
    if (normalizedSearch.length / normalizedText.length > 0.5) {
      score += 3;
    }
  } else {
    // Check for partial matches
    const searchTerms = normalizedSearch.split(' ');
    for (const term of searchTerms) {
      if (term.length > 2 && normalizedText.includes(term)) {
        score += 2;
      }
    }
  }
  
  // Apply boost factors for trust-based ranking
  if (boostFactors.isTrusted) score *= 1.3;
  if (boostFactors.isLocal) score *= 1.2;
  if (boostFactors.isRecent) score *= 1.1;
  if (boostFactors.isPopular) score *= 1.1;
  
  return score;
}

// Context-aware search that prioritizes local and trusted content
export function performContextualSearch(
  items: Array<any>,
  searchTerm: string,
  config: {
    textFields: string[],
    typeField?: string,
    locationField?: string,
    userLocation?: string,
    dateField?: string,
    popularityField?: string,
    userLanguage?: string,
    type?: 'issue' | 'community' | 'profile'
  }
): SearchResult[] {
  if (!searchTerm || !items?.length) return [];
  
  const now = new Date();
  const results: SearchResult[] = [];
  
  for (const item of items) {
    // Combine all text fields for search
    const searchableText = config.textFields
      .map(field => item[field] || '')
      .join(' ');
    
    // Calculate boost factors
    const isRecent = config.dateField && item[config.dateField] 
      ? (now.getTime() - new Date(item[config.dateField]).getTime()) < 7 * 24 * 60 * 60 * 1000 // 7 days
      : false;
    
    const isLocal = config.locationField && config.userLocation 
      ? item[config.locationField]?.toLowerCase().includes(config.userLocation.toLowerCase())
      : false;
    
    const isPopular = config.popularityField 
      ? Number(item[config.popularityField]) > 10
      : false;
      
    // For now, all items are considered trusted
    const isTrusted = true;
    
    // Calculate relevance score
    const score = calculateRelevanceScore(searchTerm, searchableText, {
      isTrusted,
      isLocal,
      isRecent,
      isPopular
    });
    
    if (score > 0) {
      results.push({
        id: item.id,
        title: item.title || item.name || 'Untitled',
        description: item.description || '',
        type: config.type || (config.typeField ? item[config.typeField] : 'issue'),
        category: item.category,
        score,
        url: getUrlForType(item.id, config.type || 'issue')
      });
    }
  }
  
  // Sort by score (descending)
  return results.sort((a, b) => b.score - a.score);
}

function getUrlForType(id: string, type: string): string {
  switch (type) {
    case 'issue':
      return `/issue/${id}`;
    case 'community':
      return `/community/${id}`;
    case 'profile':
      return `/profile/${id}`;
    default:
      return `/${type}/${id}`;
  }
}
