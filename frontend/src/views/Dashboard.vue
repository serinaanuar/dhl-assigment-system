<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <p class="eyebrow">DHL Knowledge Operations</p>
        <h1>Executive Dashboard</h1>
        <p class="hero-copy">Track article health, workflow status, and live actions from a streamlined command center.</p>
      </div>
      <div class="dashboard-actions">
        <button @click="goToKnowledgeBase" class="action-btn btn-kb">Knowledge Base</button>
        <button @click="goToAddArticle" class="action-btn btn-add">Create Article</button>
      </div>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <div>
          <p class="card-label">Total Articles</p>
          <p class="card-value">{{ totalArticles }}</p>
        </div>
        <div class="card-icon icon-yellow">📄</div>
      </div>
      <div class="summary-card">
        <div>
          <p class="card-label">Published</p>
          <p class="card-value">{{ publishedCount }}</p>
        </div>
        <div class="card-icon icon-red">✅</div>
      </div>
      <div class="summary-card">
        <div>
          <p class="card-label">Drafts</p>
          <p class="card-value">{{ draftsCount }}</p>
        </div>
        <div class="card-icon icon-black">✍️</div>
      </div>
      <div class="summary-card">
        <div>
          <p class="card-label">Active Tasks</p>
          <p class="card-value">{{ reviewCount }}</p>
        </div>
        <div class="card-icon icon-red">⚙️</div>
      </div>
    </div>

    <div class="main-grid">
      <section class="panel card-panel">
        <div class="panel-heading">
          <div>
            <p class="panel-title">Recent Activity</p>
            <p class="panel-subtitle">Latest updates and content operations</p>
          </div>
          <span class="badge badge-red">Live feed</span>
        </div>

        <div class="item-list">
          <div v-if="activities.length === 0" class="item-row empty-state">
            <p class="item-title">No article activity yet.</p>
            <p class="item-meta">Create an article or publish content to populate the dashboard.</p>
          </div>
          <div v-else v-for="(activity, index) in activities" :key="index" class="item-row">
            <div class="item-info">
              <p class="item-title">{{ activity.title }}</p>
              <p class="item-meta">{{ activity.detail }}</p>
            </div>
            <span class="badge" :class="activity.badgeClass">{{ activity.status }}</span>
          </div>
        </div>
      </section>

      <section class="panel card-panel">
        <div class="panel-heading">
          <div>
            <p class="panel-title">Workflow Progress</p>
            <p class="panel-subtitle">Keep content moving through approval and publish stages</p>
          </div>
          <span class="badge badge-yellow">Focus</span>
        </div>

        <div class="progress-row" v-for="(step, idx) in progressSteps" :key="idx">
          <div class="progress-label">
            <span>{{ step.title }}</span>
            <span>{{ step.percent }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: step.percent + '%', background: step.color }"></div>
          </div>
        </div>
      </section>
    </div>

    <section class="panel card-panel wide-panel">
      <div class="panel-heading">
        <div>
          <p class="panel-title">Team Knowledge Pulse</p>
          <p class="panel-subtitle">Status updates for onboarding, article reviews, and support workflows</p>
        </div>
        <span class="badge badge-black">Ready</span>
      </div>

      <div class="training-list">
        <div v-for="(session, index) in sessions" :key="index" class="training-row">
          <div>
            <p class="training-title">{{ session.name }}</p>
            <p class="training-meta">{{ session.date }} · {{ session.mode }}</p>
          </div>
          <span class="badge" :class="session.badgeClass">{{ session.status }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      role: localStorage.getItem("role") || "user",
      articles: [],
      activities: [],
      progressSteps: [],
      sessions: []
    };
  },
  computed: {
    totalArticles() {
      return this.articles.length;
    },
    publishedCount() {
      return this.articles.filter(article => ["publish", "published"].includes(article.status)).length;
    },
    draftsCount() {
      return this.articles.filter(article => article.status === "draft").length;
    },
    reviewCount() {
      return this.articles.filter(article => article.status === "review").length;
    }
  },
  async mounted() {
    await this.loadDashboardData();
  },
  methods: {
    async loadDashboardData() {
      this.articles = await api.getArticles();
      this.refreshDashboardMetrics();
    },
    refreshDashboardMetrics() {
      const sortedArticles = [...this.articles].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

      this.activities = sortedArticles.slice(0, 4).map(article => ({
        title: article.title,
        detail: article.summary || article.steps.slice(0, 1).join(" ") || "No summary available",
        status: article.status === "publish" ? "Published" : article.status === "review" ? "In review" : "Draft",
        badgeClass: article.status === "publish" ? "badge-yellow" : article.status === "review" ? "badge-black" : "badge-red"
      }));

      const total = this.totalArticles || 1;
      const draftPct = Math.round((this.draftsCount / total) * 100);
      const reviewPct = Math.round((this.reviewCount / total) * 100);
      const publishPct = Math.round((this.publishedCount / total) * 100);

      this.progressSteps = [
        { title: "Published", percent: publishPct, color: "#4caf50" },
        { title: "In review", percent: reviewPct, color: "#d40511" },
        { title: "Draft", percent: draftPct, color: "#FFA500" }
      ];

      const tagCounts = this.articles.reduce((acc, article) => {
        (article.tags || []).forEach(tag => {
          if (!tag) return;
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      }, {});

      const topTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

      this.sessions = topTags.map(([tag, count]) => ({
        name: `Tag: ${tag}`,
        date: `${count} article${count === 1 ? "" : "s"}`,
        mode: "Knowledge focus",
        status: "Active",
        badgeClass: "badge-yellow"
      }));

      if (this.sessions.length === 0) {
        this.sessions = [
          { name: "No active tags", date: "Add tags to articles", mode: "Content focus", status: "Ready", badgeClass: "badge-black" }
        ];
      }
    },
    goToKnowledgeBase() {
      this.$router.push("/app/knowledge-base");
    },
    goToAddArticle() {
      this.$router.push("/app/add-article");
    }
  }
};
</script>

<style scoped>
* {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
}

.dashboard {
  width: 100%;
  min-height: 100%;
  padding: clamp(18px, 4vw, 30px);
  background: #f4f4f6;
  color: #111;
}

.dashboard-header {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-bottom: 28px;
  text-align: center;
}

.eyebrow {
  margin: 0 0 8px;
  color: #b58100;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
}

.hero-copy {
  margin: 14px 0 0;
  max-width: 650px;
  color: #4f4a5d;
  font-size: 1rem;
  line-height: 1.7;
}

.dashboard-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.action-btn {
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 0.96rem;
  padding: 14px 22px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  white-space: nowrap;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.btn-kb {
  background: #ffdf48;
  color: #111;
}

.btn-upload {
  background: #d40511;
  color: white;
}

.btn-add {
  background: #111;
  color: white;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 26px;
}

.summary-card {
  background: white;
  border-radius: 26px;
  padding: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.06);
}

.card-label {
  margin: 0 0 8px;
  color: #6b6375;
  font-size: 0.95rem;
}

.card-value {
  margin: 0;
  font-size: 2.4rem;
  font-weight: 800;
}

.card-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 22px;
  font-size: 1.4rem;
}

.icon-yellow {
  background: rgba(255, 215, 0, 0.18);
  color: #b58100;
}

.icon-red {
  background: rgba(212, 5, 17, 0.14);
  color: #d40511;
}

.icon-black {
  background: rgba(0, 0, 0, 0.08);
  color: #111;
}

.main-grid {
  display: grid;
  grid-template-columns: 1.35fr 0.85fr;
  gap: 24px;
  margin-bottom: 24px;
}

.card-panel {
  background: white;
  border-radius: 28px;
  padding: 28px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.06);
}

.panel-heading {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 24px;
}

.panel-title {
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 800;
}

.panel-subtitle {
  margin: 0;
  color: #6b6375;
  font-size: 0.96rem;
  line-height: 1.6;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.badge-red {
  background: rgba(212, 5, 17, 0.12);
  color: #d40511;
}

.badge-yellow {
  background: rgba(255, 215, 0, 0.18);
  color: #b58100;
}

.badge-black {
  background: #111;
  color: white;
}

.item-list,
.training-list {
  display: grid;
  gap: 18px;
}

.item-row,
.training-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 22px;
  border-radius: 22px;
  background: #faf8fb;
  border: 1px solid #efe9f1;
}

.item-info,
.training-info {
  display: grid;
  gap: 8px;
}

.item-title,
.training-title {
  margin: 0;
  font-weight: 700;
  color: #111;
}

.item-meta,
.training-meta {
  margin: 0;
  color: #6b6375;
  font-size: 0.95rem;
}

.progress-row {
  display: grid;
  gap: 18px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  color: #4f4a5d;
  font-weight: 700;
  font-size: 0.95rem;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #ebe8ee;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
}

.wide-panel {
  grid-column: 1 / -1;
}

@media (max-width: 1160px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 860px) {
  .summary-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 620px) {
  .dashboard-header,
  .dashboard-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
