// Utility script to populate the DHL Knowledge System with sample data
// Run this in the browser console when on the Knowledge Base page

import sampleArticles from './sample-data.js';

// Function to populate localStorage (works when backend is offline)
function populateLocalStorage() {
  const storageKey = "dhl-knowledge-articles";
  const articles = sampleArticles.map((article, index) => ({
    id: Date.now() + index,
    ...article
  }));

  localStorage.setItem(storageKey, JSON.stringify(articles));
  console.log(`✅ Added ${articles.length} sample articles to localStorage`);
  console.log('🔄 Refresh the page to see the articles in the Knowledge Base');
}

// Function to populate via API (when backend is running)
async function populateViaAPI() {
  const API_BASE = "http://localhost:3000";

  try {
    for (const article of sampleArticles) {
      const response = await fetch(`${API_BASE}/kb`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article)
      });

      if (!response.ok) {
        throw new Error(`Failed to add article: ${article.title}`);
      }
    }

    console.log(`✅ Successfully added ${sampleArticles.length} articles to the backend`);
    console.log('🔄 Refresh the Knowledge Base page to see the new articles');
  } catch (error) {
    console.error('❌ Failed to populate via API:', error.message);
    console.log('💡 Falling back to localStorage...');
    populateLocalStorage();
  }
}

// Auto-detect and populate
async function populateSampleData() {
  console.log('🚀 Populating DHL Knowledge System with sample data...');

  // Try API first, fallback to localStorage
  try {
    await populateViaAPI();
  } catch {
    populateLocalStorage();
  }
}

// For browser console usage
if (typeof window !== 'undefined') {
  window.populateSampleData = populateSampleData;
  window.populateLocalStorage = populateLocalStorage;
  window.populateViaAPI = populateViaAPI;

  console.log('📋 Sample data utilities loaded!');
  console.log('Run populateSampleData() to add sample articles');
  console.log('Or run populateLocalStorage() for offline testing');
}

// For Node.js usage (if you want to run this as a script)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    populateSampleData,
    populateLocalStorage,
    populateViaAPI,
    sampleArticles
  };
}