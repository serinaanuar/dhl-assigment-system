# DHL Document Processing System
### A Full-Stack Web Application with RPA-Powered Document Automation
> Developed as an individual assignment,
> Universiti Teknologi Malaysia (UTM)

---

## 📋 About The Project

This is a full-stack web-based document processing system built as a 
demonstration of automated document management workflows. The system 
combines a Vue 3 frontend and Node.js backend with a separately running 
UiPath RPA bot that retrieves files from Google Drive, downloads them 
locally, and feeds them into the web system for OCR processing and 
automatic article generation.

The project was developed individually, submitted, and presented as part 
of a course assignment at Universiti Teknologi Malaysia.

---

## ✨ Features

- **RPA Automation** — UiPath bot runs separately to fetch files from 
  Google Drive and download them to local storage automatically
- **File Upload & Management** — Users can upload documents through 
  the web interface for processing
- **OCR Processing** — Tesseract.js extracts text content from 
  uploaded document files
- **Automatic Article Generation** — System generates structured 
  articles from OCR-extracted document content
- **Role-Based Access Control** — Vue Router guards restrict access 
  to features based on user role
- **User Authentication** — Session-based login with token 
  authentication

---

## 🛠️ Built With

**Frontend**
- Vue 3, Vue Router, Axios, Vite

**Backend**
- Node.js, Express, Multer, Tesseract.js

**RPA**
- UiPath (runs separately from the web system)

**Storage**
- JSON-based local data layer

---

## 🗂️ Project Structure

```
dhl-assignment-system/
├── frontend/
│   ├── src/
│   │   ├── router/           # Vue Router with route guards
│   │   ├── services/
│   │   │   ├── api.js        # Axios API service
│   │   │   └── auth.js       # Authentication handling
│   │   └── main.js           # Vue app entry point
│   └── vite.config.js
├── backend/
│   ├── server.js             # Express server and API routes
│   ├── data.json             # Local data storage
│   └── package.json
└── uipath/                   # UiPath RPA automation (runs separately)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- npm
- UiPath Studio (for RPA component)

### Installation

1. Clone the repository

```bash
git clone https://github.com/serinaanuar/dhl-document-processing-system.git
```

2. Install and start the backend

```bash
cd backend
npm install
npm run dev
```

3. Install and start the frontend

```bash
cd frontend
npm install
npm run dev
```

4. Run the RPA bot

Open the UiPath project separately in UiPath Studio and run the 
automation to fetch files from Google Drive to local storage before 
processing them through the web system.

---

## 👩‍💻 My Contributions

This was an individual project. I was solely responsible for:

**Full-Stack Development**
- Built the complete Node.js and Express REST API backend including 
  file upload handling, OCR processing, and article generation endpoints
- Developed the Vue 3 single-page application frontend with Vue Router 
  and role-based route guards

**RPA Integration**
- Designed and built a UiPath automation workflow to retrieve files 
  from Google Drive and download them to local storage as input for 
  the web system

**Feature Development**
- Integrated Tesseract.js for OCR text extraction from uploaded files
- Implemented session-based authentication with token handling and 
  local storage persistence
- Built article CRUD functionality with a JSON-based local data layer

---

## 📝 Project Status

> 🟢 **Completed** — Successfully submitted and presented as an 
> individual course assignment at Universiti Teknologi Malaysia.

---

## 📄 License

This project was developed for academic purposes at Universiti Teknologi 
Malaysia. Source code is available for reference — please contact me 
before reuse.
