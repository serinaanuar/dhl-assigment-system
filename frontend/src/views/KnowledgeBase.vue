<template>
  <div class="knowledge-base">
    <header class="kb-header">
      <div class="header-content">
        <h1>Knowledge Base</h1>
        <p>Search and manage articles</p>
      </div>
      <button class="add-article-btn" @click="goToAddArticle">
        + Add New Article
      </button>
    </header>

    <div class="query-panel">
      <div class="panel-row">
        <div class="panel-group panel-search">
          <label>Search Articles</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search articles by title or summary..."
            class="search-input"
          />
        </div>

        <div class="panel-group">
          <label>Status</label>
          <select v-model="selectedStatus" class="select-filter">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="not-approved">Not Approved</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div class="panel-group">
          <label>Tags</label>
          <select v-model="selectedTag" class="select-filter">
            <option value="">All Tags</option>
            <option v-for="tag in uniqueTags" :key="tag" :value="tag">{{ tag }}</option>
          </select>
        </div>
      </div>

      <div class="panel-actions">
        <button class="clear-filters-btn" @click="clearFilters">
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Articles Table -->
    <div class="table-section">
      <div v-if="loading" class="no-results">
        <p>Loading articles...</p>
      </div>
      <div v-else-if="filteredArticles.length === 0" class="no-results">
        <p>No articles found. Try adjusting your search or filters.</p>
      </div>
      <table v-else class="articles-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Tags</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in filteredArticles" :key="article.id">
            <td class="title-cell">{{ article.title }}</td>
            <td>
              <span :class="['status-badge', article.status]">
                {{ capitalizeStatus(article.status) }}
              </span>
            </td>
            <td class="tags-cell">
              <span
                v-for="tag in article.tags"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </span>
            </td>
            <td>{{ formatDate(article.dateCreated) }}</td>
            <td class="actions-cell">
              <!-- Admin Actions -->
              <button v-if="isAdmin && article.status === 'draft'" class="action-btn approve-btn" @click="changeStatus(article, 'approved')">
                Approve
              </button>
              <button v-if="isAdmin && article.status === 'draft'" class="action-btn reject-btn" @click="changeStatus(article, 'not-approved')">
                Reject
              </button>
              
              <!-- User Actions -->
              <button v-if="isUser && article.status === 'approved'" class="action-btn publish-btn" @click="changeStatus(article, 'published')">
                Publish
              </button>

              <button class="action-btn edit-btn" @click="editArticle(article.id)">
                Edit
              </button>
              <button v-if="isAdmin" class="action-btn delete-btn" @click="deleteArticle(article.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "KnowledgeBase",
  data() {
    return {
      searchQuery: "",
      selectedStatus: "",
      selectedTag: "",
      articles: [],
      loading: false,
      role: localStorage.getItem("role") || "user"
    };
  },
  async mounted() {
    await this.loadArticles();
  },
  computed: {
    isAdmin() {
      return this.role === "admin";
    },
    isUser() {
      return this.role === "user";
    },
    uniqueTags() {
      const allTags = this.articles.flatMap(article => article.tags || []);
      return [...new Set(allTags)].sort();
    },
    filteredArticles() {
      return this.articles.filter(article => {
        const matchesSearch =
          article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          article.summary.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchesStatus =
          !this.selectedStatus ||
          article.status === this.selectedStatus;

        const selectedTag = this.selectedTag.toLowerCase();

        const matchesTags =
          !selectedTag ||
          article.tags.some(articleTag =>
            articleTag.toLowerCase() === selectedTag
          );

        return matchesSearch && matchesStatus && matchesTags;
      });
    }
  },
  methods: {
    async loadArticles() {
      this.loading = true;
      this.articles = await api.getArticles();
      this.articles.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
      this.loading = false;
    },
    capitalizeStatus(status) {
      if (status === 'not-approved') return 'Not Approved';
      return status.charAt(0).toUpperCase() + status.slice(1);
    },
    async changeStatus(article, newStatus) {
      await api.updateArticle(article.id, { ...article, status: newStatus });
      await this.loadArticles();
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString("en-US", options);
    },
    editArticle(articleId) {
      const article = this.articles.find(a => a.id === articleId);
      if (article) {
        sessionStorage.setItem("articleEdit", JSON.stringify(article));
        this.$router.push("/app/editor");
      }
    },
    async deleteArticle(articleId) {
      const article = this.articles.find(a => a.id === articleId);
      if (!article) return;

      if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
        await api.deleteArticle(articleId);
        await this.loadArticles();
      }
    },
    clearFilters() {
      this.searchQuery = "";
      this.selectedStatus = "";
      this.selectedTag = "";
    },
    goToAddArticle() {
      this.$router.push("/app/add-article");
    }
  }
};
</script>

<style scoped>
.knowledge-base {
  padding: clamp(16px, 3vw, 32px);
  background: #f6f6f6;
  min-height: 100vh;
}

.kb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(24px, 4vw, 40px);
  background: white;
  padding: clamp(20px, 3vw, 30px);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  font-size: clamp(24px, 5vw, 32px);
  color: #000;
  margin-bottom: 4px;
}

.header-content p {
  font-size: clamp(12px, 2vw, 14px);
  color: #666;
}

.add-article-btn {
  background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%);
  color: #000;
  border: none;
  padding: clamp(10px, 1.5vw, 14px) clamp(16px, 2vw, 24px);
  border-radius: 6px;
  font-size: clamp(12px, 2vw, 14px);
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.add-article-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.query-panel {
  background: white;
  padding: clamp(16px, 2.5vw, 24px);
  border-radius: 8px;
  margin-bottom: clamp(24px, 3vw, 32px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.panel-row {
  display: flex;
  align-items: flex-end;
  gap: clamp(16px, 2vw, 24px);
  flex-wrap: wrap;
}

.panel-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 180px;
  flex: 1;
}

.panel-group label {
  font-size: clamp(12px, 1.8vw, 13px);
  font-weight: 600;
  color: #333;
}

.panel-search {
  min-width: 260px;
  flex: 2;
}

.search-input,
.select-filter {
  width: 100%;
  padding: clamp(10px, 1.5vw, 14px);
  font-size: clamp(12px, 2vw, 14px);
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: #f9f9f9;
  color: #000;
  transition: border-color 0.3s;
}

.search-input:focus,
.select-filter:focus {
  outline: none;
  border-color: #FFD700;
  background: #fff;
}

.select-filter {
  min-height: auto;
}

.panel-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: clamp(10px, 1vw, 12px);
}

@media (max-width: 768px) {
  .panel-row {
    flex-direction: column;
  }
  .panel-search {
    min-width: auto;
    flex: 1;
  }
  .panel-actions {
    justify-content: center;
  }
}

.clear-filters-btn {
  background: #e0e0e0;
  color: #333;
  border: none;
  padding: clamp(10px, 1.5vw, 12px) clamp(14px, 2vw, 18px);
  border-radius: 6px;
  font-size: clamp(12px, 2vw, 13px);
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-end;
}

.clear-filters-btn:hover {
  background: #d0d0d0;
}

/* Status Badge Styling */
.status-badge {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: clamp(11px, 1.8vw, 12px);
  font-weight: 600;
  display: inline-block;
  text-transform: capitalize;
}

.status-badge.draft {
  background: #FFF9C4;
  color: #F57F17;
}

.status-badge.approved {
  background: #C8E6C9;
  color: #2E7D32;
}

.status-badge.not-approved {
  background: #FFCDD2;
  color: #C62828;
}

.status-badge.published {
  background: #E3F2FD;
  color: #1565C0;
}

/* Table Section */
.table-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.no-results {
  padding: clamp(32px, 5vw, 48px);
  text-align: center;
  color: #999;
  font-size: clamp(14px, 2vw, 16px);
}

.articles-table {
  width: 100%;
  border-collapse: collapse;
  font-size: clamp(12px, 1.8vw, 14px);
}

.articles-table thead {
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
}

.articles-table thead th {
  padding: clamp(12px, 2vw, 16px);
  text-align: left;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.articles-table tbody tr {
  border-bottom: 1px solid #e8e8e8;
  transition: background-color 0.2s;
}

.articles-table tbody tr:hover {
  background-color: #f9f9f9;
}

.articles-table tbody td {
  padding: clamp(14px, 2vw, 18px);
}

.title-cell {
  font-weight: 600;
  color: #000;
}

.tags-cell {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  background: #f0f0f0;
  color: #555;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: clamp(10px, 1.5vw, 11px);
  border: 1px solid #ddd;
}

.actions-cell {
  display: flex;
  gap: clamp(8px, 1vw, 12px);
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: clamp(11px, 1.8vw, 12px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 60px;
}

.approve-btn {
  background: #4CAF50;
  color: white;
}
.approve-btn:hover { background: #45a049; }

.reject-btn {
  background: #f44336;
  color: white;
}
.reject-btn:hover { background: #da190b; }

.publish-btn {
  background: #2196F3;
  color: white;
}
.publish-btn:hover { background: #0b7dda; }

.edit-btn {
  background: #FF9800;
  color: white;
}

.edit-btn:hover {
  background: #e68a00;
  transform: translateY(-1px);
}

.delete-btn {
  background: #9E9E9E;
  color: white;
}

.delete-btn:hover {
  background: #757575;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .kb-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .add-article-btn {
    width: 100%;
  }

  .articles-table {
    font-size: 12px;
  }

  .articles-table thead th,
  .articles-table tbody td {
    padding: 8px;
  }

  .action-btn {
    padding: 4px 8px;
    min-width: 50px;
  }
}
</style>
