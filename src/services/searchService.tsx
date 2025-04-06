
import { supabase } from '@/integrations/supabase/client';

// Supported languages for search
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'hi' | 'zh' | 'ar' | 'sw';

// Search result types
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'issue' | 'community';
  category?: string;
  relevanceScore: number;
  language: SupportedLanguage;
  lastUpdated: string;
  location?: string;
  trustScore?: number;
}

interface SearchOptions {
  query: string;
  language?: SupportedLanguage;
  categories?: string[];
  location?: string;
  maxDistance?: number; // in km
  minTrustScore?: number;
  page?: number;
  pageSize?: number;
  includeIssues?: boolean;
  includeCommunities?: boolean;
  connectivity?: 'high' | 'medium' | 'low';
  sortBy?: 'relevance' | 'recent' | 'trust';
}

// Helper function to calculate text similarity (basic implementation)
const calculateTextSimilarity = (text1: string, text2: string): number => {
  if (!text1 || !text2) return 0;
  
  const normalizedText1 = text1.toLowerCase();
  const normalizedText2 = text2.toLowerCase();
  
  // Check for exact matches first
  if (normalizedText1.includes(normalizedText2) || normalizedText2.includes(normalizedText1)) {
    return 0.9;
  }
  
  // Check for partial matches
  const words1 = normalizedText1.split(/\s+/);
  const words2 = normalizedText2.split(/\s+/);
  
  let matchCount = 0;
  for (const word of words1) {
    if (word.length > 2 && words2.some(w => w.includes(word) || word.includes(w))) {
      matchCount++;
    }
  }
  
  return matchCount / Math.max(words1.length, words2.length);
};

// Calculate trust score based on engagement metrics
const calculateTrustScore = (
  creatorReputation: number,
  upvotes: number,
  totalViews: number,
  ageInDays: number
): number => {
  // Simplified trust score calculation
  const freshnessFactor = Math.max(0.5, 1 - ageInDays / 30);
  const engagementScore = upvotes > 0 ? Math.min(1, upvotes / (totalViews * 0.1)) : 0;
  
  return (creatorReputation * 0.4 + engagementScore * 0.4 + freshnessFactor * 0.2) * 100;
};

// Basic language detection (simplified implementation)
const detectLanguage = (text: string): SupportedLanguage => {
  // This is a very basic implementation that should be replaced with a proper language detection library
  // For now, it just checks for common patterns in different languages
  
  if (!text || text.length < 5) return 'en';
  
  const normalized = text.toLowerCase();
  
  // Check for common Spanish markers
  if (/[áéíóúñ¿¡]/.test(normalized) || /\b(el|la|los|las|es|son|esta|estos)\b/.test(normalized)) {
    return 'es';
  }
  
  // Check for common French markers
  if (/[éèêëàâçîïôûùüÿæœ]/.test(normalized) || /\b(le|la|les|des|est|sont|cette|ces)\b/.test(normalized)) {
    return 'fr';
  }
  
  // Check for common Hindi markers (simplified)
  if (/[\u0900-\u097F]/.test(normalized)) {
    return 'hi';
  }
  
  // Check for common Chinese markers
  if (/[\u4E00-\u9FFF]/.test(normalized)) {
    return 'zh';
  }
  
  // Check for common Arabic markers
  if (/[\u0600-\u06FF]/.test(normalized)) {
    return 'ar';
  }
  
  // Check for common Swahili markers (simplified)
  if (/\b(na|ya|wa|ni|kwa|katika)\b/.test(normalized)) {
    return 'sw';
  }
  
  // Default to English
  return 'en';
};

// Main search function
export const searchContent = async (options: SearchOptions): Promise<{
  results: SearchResult[];
  totalCount: number;
  pageCount: number;
}> => {
  const {
    query,
    language = 'en',
    categories = [],
    location,
    maxDistance = 50,
    minTrustScore = 0,
    page = 1,
    pageSize = 20,
    includeIssues = true,
    includeCommunities = true,
    connectivity = 'high',
    sortBy = 'relevance'
  } = options;
  
  // Adjust result size based on connectivity
  const actualPageSize = connectivity === 'low' ? Math.min(pageSize, 5) : pageSize;
  
  const results: SearchResult[] = [];
  let issuesData: any[] = [];
  let communitiesData: any[] = [];
  
  // Fetch issues if included
  if (includeIssues) {
    let issuesQuery = supabase
      .from('issues')
      .select(`
        *,
        communities (
          id,
          name,
          description,
          location
        ),
        profiles (
          id,
          username,
          impact_score
        )
      `);
      
    // Apply category filter if specified
    if (categories.length > 0) {
      issuesQuery = issuesQuery.in('category', categories);
    }
    
    // Fetch issues
    const { data: issues, error } = await issuesQuery;
    
    if (!error && issues) {
      issuesData = issues;
    }
  }
  
  // Fetch communities if included
  if (includeCommunities) {
    let communitiesQuery = supabase
      .from('communities')
      .select(`
        *,
        profiles: creator_id (
          id,
          username,
          impact_score
        )
      `);
      
    const { data: communities, error } = await communitiesQuery;
    
    if (!error && communities) {
      communitiesData = communities;
    }
  }
  
  // Process and filter issues
  for (const issue of issuesData) {
    const titleMatch = calculateTextSimilarity(query, issue.title);
    const descMatch = calculateTextSimilarity(query, issue.description);
    const relevanceScore = Math.max(titleMatch * 1.5, descMatch) * 100; // Title matches are weighted more
    
    // Calculate days since creation
    const createdDate = new Date(issue.created_at);
    const ageInDays = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Calculate trust score
    const creatorReputation = issue.profiles?.impact_score ? issue.profiles.impact_score / 100 : 0.5;
    const trustScore = calculateTrustScore(
      creatorReputation,
      issue.upvote_count || 0,
      50, // Placeholder for views
      ageInDays
    );
    
    // Skip if below minimum trust score
    if (trustScore < minTrustScore) continue;
    
    // Detect language
    const detectedLanguage = detectLanguage(issue.title + ' ' + issue.description);
    
    // Skip if language doesn't match and language filter is applied
    if (language !== detectedLanguage && language !== 'en') continue;
    
    // Skip if relevance is too low
    if (relevanceScore < 10) continue;
    
    results.push({
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: 'issue',
      category: issue.category,
      relevanceScore,
      language: detectedLanguage,
      lastUpdated: issue.updated_at,
      location: issue.location || issue.communities?.location,
      trustScore
    });
  }
  
  // Process and filter communities
  for (const community of communitiesData) {
    const nameMatch = calculateTextSimilarity(query, community.name);
    const descMatch = calculateTextSimilarity(query, community.description);
    const relevanceScore = Math.max(nameMatch * 1.5, descMatch) * 100;
    
    // Calculate days since creation
    const createdDate = new Date(community.created_at);
    const ageInDays = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Calculate trust score
    const creatorReputation = community.profiles?.impact_score ? community.profiles.impact_score / 100 : 0.5;
    const trustScore = calculateTrustScore(
      creatorReputation,
      community.member_count || 0,
      100, // Placeholder for views
      ageInDays
    );
    
    // Skip if below minimum trust score
    if (trustScore < minTrustScore) continue;
    
    // Detect language
    const detectedLanguage = detectLanguage(community.name + ' ' + community.description);
    
    // Skip if language doesn't match and language filter is applied
    if (language !== detectedLanguage && language !== 'en') continue;
    
    // Skip if relevance is too low
    if (relevanceScore < 10) continue;
    
    results.push({
      id: community.id,
      title: community.name,
      description: community.description || '',
      type: 'community',
      relevanceScore,
      language: detectedLanguage,
      lastUpdated: community.updated_at,
      location: community.location,
      trustScore
    });
  }
  
  // Sort results based on preference
  switch (sortBy) {
    case 'recent':
      results.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
      break;
    case 'trust':
      results.sort((a, b) => (b.trustScore || 0) - (a.trustScore || 0));
      break;
    case 'relevance':
    default:
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
  
  // Calculate pagination
  const totalResults = results.length;
  const totalPages = Math.ceil(totalResults / actualPageSize);
  const startIndex = (page - 1) * actualPageSize;
  const paginatedResults = results.slice(startIndex, startIndex + actualPageSize);
  
  return {
    results: paginatedResults,
    totalCount: totalResults,
    pageCount: totalPages
  };
};
