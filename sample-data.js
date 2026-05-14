// Sample data for testing the DHL Knowledge System
// You can use this data to populate your knowledge base

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
  },
  {
    title: "Customer Complaint Resolution Process",
    summary: "Structured process for handling and resolving customer complaints effectively.",
    steps: [
      "Listen actively to the customer's complaint",
      "Acknowledge the issue and apologize for inconvenience",
      "Gather all relevant details about the shipment",
      "Determine the appropriate resolution based on company policy",
      "Follow up with the customer within 24 hours",
      "Document the complaint and resolution in the system"
    ],
    tags: ["customer-service", "complaints", "resolution", "communication"],
    status: "review",
    dateCreated: "2026-05-11T13:10:00.000Z"
  },
  {
    title: "Warehouse Management Best Practices",
    summary: "Guidelines for efficient warehouse operations and inventory management.",
    steps: [
      "Implement proper receiving procedures for incoming shipments",
      "Use barcode scanning for accurate inventory tracking",
      "Organize warehouse layout for optimal picking efficiency",
      "Conduct regular inventory audits and cycle counts",
      "Maintain clean and safe working environment"
    ],
    tags: ["warehouse", "inventory", "operations", "efficiency"],
    status: "draft",
    dateCreated: "2026-05-12T08:30:00.000Z"
  },
  {
    title: "Insurance Coverage Options",
    summary: "Overview of DHL insurance options and coverage limits for different shipment types.",
    steps: [
      "Assess the value of items being shipped",
      "Choose appropriate insurance coverage level",
      "Understand coverage exclusions and limitations",
      "Report any damage or loss within required timeframe",
      "Follow proper claims filing procedures"
    ],
    tags: ["insurance", "coverage", "claims", "protection"],
    status: "published",
    dateCreated: "2026-05-02T15:45:00.000Z"
  }
];

// To use this data, you can either:
// 1. Add it to your backend database
// 2. Use it in the browser console to populate localStorage
// 3. Import it into your API service for testing

export default sampleArticles;