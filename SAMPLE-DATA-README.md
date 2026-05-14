# DHL Knowledge System - Sample Data

This directory contains sample data to help you test the DHL Knowledge System functionality.

## 📁 Files

- `sample-data.js` - Contains 8 sample articles covering various DHL processes
- `populate-sample-data.js` - Utility script to populate the system with sample data

## 🧪 Sample Articles Included

1. **Express Shipping Service Overview** (Published)
   - Tags: shipping, express, pricing, services

2. **Package Tracking Procedures** (Published)
   - Tags: tracking, customer-service, procedures

3. **Customs Documentation Requirements** (Review)
   - Tags: customs, international, documentation, compliance

4. **Error Code Reference Guide** (Draft)
   - Tags: error-codes, troubleshooting, technical-support

5. **Delivery Address Validation Standards** (Published)
   - Tags: delivery, address-validation, standards, quality

6. **Customer Complaint Resolution Process** (Review)
   - Tags: customer-service, complaints, resolution, communication

7. **Warehouse Management Best Practices** (Draft)
   - Tags: warehouse, inventory, operations, efficiency

8. **Insurance Coverage Options** (Published)
   - Tags: insurance, coverage, claims, protection

## 🚀 How to Use

### Option 1: Browser Console (Recommended)

1. Start your frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open your browser and navigate to the Knowledge Base page (`http://localhost:5173/app/knowledge-base`)

3. Open the browser console (F12 → Console tab)

4. Copy and paste this code into the console:
   ```javascript
   // Load the populate script
   import('./populate-sample-data.js').then(module => {
     window.populateSampleData = module.populateSampleData;
     window.populateLocalStorage = module.populateLocalStorage;
     window.populateViaAPI = module.populateViaAPI;

     // Run the population
     populateSampleData();
   });
   ```

5. The console will show success messages and the articles will appear in your Knowledge Base

### Option 2: Manual Population

1. Start the backend server (if using API):
   ```bash
   cd backend
   node server.js
   ```

2. Open the Knowledge Base page in your browser

3. Open browser console and run:
   ```javascript
   // For API population (backend must be running)
   populateViaAPI();

   // OR for localStorage population (works offline)
   populateLocalStorage();
   ```

### Option 3: Direct API Calls

If you have the backend running, you can use tools like Postman or curl to add articles:

```bash
curl -X POST http://localhost:3000/kb \
  -H "Content-Type: application/json" \
  -d @sample-data.js
```

## 🧪 Testing Features

With the sample data loaded, you can test:

- **Search**: Try searching for "shipping", "tracking", "customer"
- **Filtering**: Filter by status (draft/review/published) and tags
- **Editing**: Click "Edit" on any article to modify it
- **Deleting**: Click "Delete" to remove articles (with confirmation)
- **Adding New**: Use the "Add New Article" button to create more content

## 📊 Data Structure

Each article contains:
- `title`: Article headline
- `summary`: Brief description
- `steps`: Array of step-by-step instructions
- `tags`: Array of searchable tags
- `status`: "draft", "review", or "published"
- `dateCreated`: ISO timestamp

## 🔄 Refresh & Reset

To reset the data:
1. Clear localStorage: `localStorage.clear()` in console
2. Or restart the backend server to reset the in-memory database

## 💡 Tips

- The system works with or without the backend running
- Articles are sorted by creation date (newest first)
- Status badges use color coding: Yellow=Draft, Blue=Review, Green=Published
- All text is searchable (title, summary, and tags)