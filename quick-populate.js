// Quick browser console script to populate sample data
// Copy and paste this entire script into your browser console when on the Knowledge Base page

// Sample articles data
const sampleArticles = [
  {
    title: "Express Shipping Service Overview",
    summary: "Complete guide to DHL Express shipping services including pricing, delivery times, and service options.",
    steps: [
      "Select the appropriate service level (Express, Express 9:00, Express 12:00)",
      "Calculate shipping costs using the DHL rate calculator",
      "Prepare the package according to DHL guidelines",
      "Create shipping label through DHL eCommerce platform",
      "Drop off package at authorized DHL location or schedule pickup"
    ],
    tags: ["shipping", "express", "pricing", "services"],
    status: "published",
    dateCreated: "2026-05-01T10:00:00.000Z"
  },
  {
    title: "Package Tracking Procedures",
    summary: "Step-by-step guide for tracking packages and resolving tracking issues.",
    steps: [
      "Visit DHL tracking website or use mobile app",
      "Enter the tracking number (usually 10-12 digits)",
      "Review the shipment status and estimated delivery time",
      "If package is delayed, check for any customs clearance issues",
      "Contact DHL customer service if tracking shows no updates for 48+ hours"
    ],
    tags: ["tracking", "customer-service", "procedures"],
    status: "published",
    dateCreated: "2026-05-03T14:30:00.000Z"
  },
  {
    title: "Customs Documentation Requirements",
    summary: "Essential documentation needed for international shipments including commercial invoices and customs declarations.",
    steps: [
      "Prepare commercial invoice with accurate product descriptions",
      "Include HS codes for all items in the shipment",
      "Calculate correct customs value and duties",
      "Attach necessary permits or certificates if required",
      "Ensure all documentation is in English or local language"
    ],
    tags: ["customs", "international", "documentation", "compliance"],
    status: "review",
    dateCreated: "2026-05-05T09:15:00.000Z"
  },
  {
    title: "Error Code Reference Guide",
    summary: "Common error codes encountered in DHL systems and their resolution steps.",
    steps: [
      "Identify the error code from the system message",
      "Cross-reference with the error code database",
      "Follow the specific resolution steps for that error",
      "If unresolved, escalate to technical support",
      "Document the error and resolution for future reference"
    ],
    tags: ["error-codes", "troubleshooting", "technical-support"],
    status: "draft",
    dateCreated: "2026-05-07T16:45:00.000Z"
  },
  {
    title: "Delivery Address Validation Standards",
    summary: "Standards and best practices for validating delivery addresses to prevent delivery failures.",
    steps: [
      "Verify street address format and completeness",
      "Confirm postal code matches the city and country",
      "Validate recipient name and contact information",
      "Check for any special delivery instructions",
      "Use address validation tools before finalizing shipment"
    ],
    tags: ["delivery", "address-validation", "standards", "quality"],
    status: "published",
    dateCreated: "2026-05-09T11:20:00.000Z"
  }
];

// Function to populate localStorage
function populateSampleData() {
  const storageKey = "dhl-knowledge-articles";
  const articles = sampleArticles.map((article, index) => ({
    id: Date.now() + index,
    ...article
  }));

  localStorage.setItem(storageKey, JSON.stringify(articles));
  console.log(`✅ Added ${articles.length} sample articles to localStorage`);
  console.log('🔄 Refresh the page to see the articles in the Knowledge Base');

  // Also try to populate via API if backend is running
  populateViaAPI();
}

// Function to populate via API
async function populateViaAPI() {
  const API_BASE = "http://localhost:3000";

  try {
    for (const article of sampleArticles) {
      await fetch(`${API_BASE}/kb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      });
    }
    console.log(`✅ Also added articles to backend API`);
  } catch (error) {
    console.log('💡 Backend not running - using localStorage only');
  }
}

// Run the population
populateSampleData();