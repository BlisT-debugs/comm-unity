
export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  categories: string[];
  imageUrl?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  community: string;
  communityId: string;
  status: 'open' | 'in-progress' | 'completed';
  upvotes: number;
  comments: number;
  contributors: number;
  progress: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  points: number;
  avatarUrl?: string;
  badges: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
  };
}

// Sample Communities
export const communities: Community[] = [
  {
    id: 'greenville',
    name: 'Greenville',
    description: 'A community focused on sustainable living and environmental initiatives in the Greenville area.',
    memberCount: 347,
    categories: ['Waste Management', 'Education', 'Environment'],
    imageUrl: '',
  },
  {
    id: 'techpark',
    name: 'Tech Park',
    description: 'Tech Park community working on digital literacy and innovation projects for local residents.',
    memberCount: 215,
    categories: ['Education', 'Technology', 'Innovation'],
    imageUrl: '',
  },
  {
    id: 'downtown',
    name: 'Downtown Collective',
    description: 'Urban improvement and community building in the downtown area. Focus on safety and public spaces.',
    memberCount: 189,
    categories: ['Safety', 'Urban Planning', 'Culture'],
    imageUrl: '',
  },
  {
    id: 'riverside',
    name: 'Riverside',
    description: 'Protecting and enhancing the riverside ecosystem while improving recreational facilities.',
    memberCount: 156,
    categories: ['Environment', 'Recreation', 'Conservation'],
    imageUrl: '',
  },
  {
    id: 'eastside',
    name: 'Eastside Neighbors',
    description: 'Supporting education initiatives and after-school programs for youth in the Eastside area.',
    memberCount: 143,
    categories: ['Education', 'Youth', 'Community Support'],
    imageUrl: '',
  },
];

// Sample Issues
export const issues: Issue[] = [
  {
    id: 'issue-1',
    title: 'Park Cleanup Initiative',
    description: 'Organizing volunteer groups to clean and maintain our local parks on a monthly basis. We need to address littering and improve recycling options.',
    category: 'Waste Management',
    community: 'Greenville',
    communityId: 'greenville',
    status: 'in-progress',
    upvotes: 32,
    comments: 15,
    contributors: 8,
    progress: 60,
    createdAt: '2 days ago',
  },
  {
    id: 'issue-2',
    title: 'Digital Literacy Workshop Series',
    description: 'Developing a series of workshops to help seniors and others learn essential digital skills, from email to online safety.',
    category: 'Education',
    community: 'Tech Park',
    communityId: 'techpark',
    status: 'open',
    upvotes: 24,
    comments: 7,
    contributors: 3,
    progress: 0,
    createdAt: '5 days ago',
  },
  {
    id: 'issue-3',
    title: 'Neighborhood Watch Program',
    description: 'Establishing a coordinated neighborhood watch program to enhance community safety and emergency preparedness.',
    category: 'Safety',
    community: 'Downtown Collective',
    communityId: 'downtown',
    status: 'completed',
    upvotes: 45,
    comments: 23,
    contributors: 12,
    progress: 100,
    createdAt: '2 weeks ago',
  },
  {
    id: 'issue-4',
    title: 'River Cleanup Project',
    description: 'Monthly river cleanup events to remove trash and plastic waste from our waterways. Looking for volunteers and equipment.',
    category: 'Environment',
    community: 'Riverside',
    communityId: 'riverside',
    status: 'in-progress',
    upvotes: 37,
    comments: 19,
    contributors: 15,
    progress: 75,
    createdAt: '1 week ago',
  },
  {
    id: 'issue-5',
    title: 'After-School Tutoring Program',
    description: 'Organizing volunteer tutors to help students with homework and academic subjects after school hours.',
    category: 'Education',
    community: 'Eastside Neighbors',
    communityId: 'eastside',
    status: 'open',
    upvotes: 28,
    comments: 9,
    contributors: 5,
    progress: 0,
    createdAt: '3 days ago',
  },
];

// Sample Leaderboard
export const leaderboard: User[] = [
  { 
    id: 'user-1', 
    name: 'Sarah Johnson', 
    points: 1250, 
    badges: { bronze: 8, silver: 5, gold: 2, platinum: 0 } 
  },
  { 
    id: 'user-2', 
    name: 'Michael Chen', 
    points: 980, 
    badges: { bronze: 6, silver: 3, gold: 1, platinum: 0 } 
  },
  { 
    id: 'user-3', 
    name: 'Jessica Williams', 
    points: 875, 
    badges: { bronze: 5, silver: 2, gold: 1, platinum: 0 } 
  },
  { 
    id: 'user-4', 
    name: 'David Rodriguez', 
    points: 740, 
    badges: { bronze: 4, silver: 2, gold: 0, platinum: 0 } 
  },
  { 
    id: 'user-5', 
    name: 'Current User', 
    points: 550, 
    badges: { bronze: 3, silver: 1, gold: 0, platinum: 0 } 
  },
];

// Sample Achievements
export const achievements = [
  {
    id: 'first-contribution',
    name: 'First Contribution',
    description: 'Made your first contribution to a community issue',
    type: 'bronze',
    unlocked: true,
  },
  {
    id: 'problem-solver',
    name: 'Problem Solver',
    description: 'Contributed to the completion of 5 community issues',
    type: 'silver',
    unlocked: true,
  },
  {
    id: 'community-leader',
    name: 'Community Leader',
    description: 'Created a community with at least 50 members',
    type: 'gold',
    unlocked: false,
    progress: 65,
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Participated in 10 environmental initiatives',
    type: 'silver',
    unlocked: false,
    progress: 40,
  },
  {
    id: 'master-collaborator',
    name: 'Master Collaborator',
    description: 'Worked with 20 different community members',
    type: 'platinum',
    unlocked: false,
    progress: 25,
  },
];
