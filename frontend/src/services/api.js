import axios from "axios";
import { getToken } from "./auth";

const API_BASE = "http://localhost:3000";
const storageKey = "dhl-knowledge-articles";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 5000
});

client.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function normalize(article) {
  return {
    id: article.id,
    title: article.title || "Untitled Article",
    summary: article.summary || "",
    steps: article.steps || [],
    tags: Array.isArray(article.tags)
      ? article.tags
      : String(article.tags || "").split(",").map(tag => tag.trim()).filter(Boolean),
    status: String(article.status || "draft").toLowerCase(),
    dateCreated: article.dateCreated || article.createdAt || new Date().toISOString()
  };
}

async function fetchFromLocal() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw).map(normalize);
  } catch {
    return [];
  }
}

function saveToLocal(articles) {
  localStorage.setItem(storageKey, JSON.stringify(articles));
}

export default {
  async getArticles() {
    try {
      const response = await client.get("/kb");
      return response.data.map(normalize);
    } catch (error) {
      return fetchFromLocal();
    }
  },

  async getArticleById(id) {
    try {
      const response = await client.get(`/kb/${id}`);
      return normalize(response.data);
    } catch (error) {
      const articles = await fetchFromLocal();
      return articles.find(article => article.id === Number(id) || article.id === id) || null;
    }
  },

  async addArticle(article) {
    const payload = {
      title: article.title,
      summary: article.summary,
      steps: article.steps,
      tags: article.tags,
      status: article.status,
      dateCreated: article.dateCreated || new Date().toISOString()
    };
    try {
      const response = await client.post("/kb", payload);
      return normalize(response.data);
    } catch (error) {
      const articles = await fetchFromLocal();
      const newArticle = normalize({ id: Date.now(), ...payload });
      articles.unshift(newArticle);
      saveToLocal(articles);
      return newArticle;
    }
  },

  async updateArticle(id, updates) {
    const payload = {
      ...updates,
      status: updates.status
    };
    try {
      const response = await client.put(`/kb/${id}`, payload);
      return normalize(response.data);
    } catch (error) {
      const articles = await fetchFromLocal();
      const index = articles.findIndex(article => article.id === Number(id) || article.id === id);
      if (index !== -1) {
        articles[index] = normalize({ ...articles[index], ...payload });
        saveToLocal(articles);
        return articles[index];
      }
      return null;
    }
  },

  async deleteArticle(id) {
    try {
      await client.delete(`/kb/${id}`);
      return true;
    } catch (error) {
      const articles = await fetchFromLocal();
      const filtered = articles.filter(article => article.id !== Number(id) && article.id !== id);
      saveToLocal(filtered);
      return true;
    }
  }
};