<template>
  <div class="editor-container">
    <div class="editor-header">
      <h1>{{ isEdit ? "Edit Article" : "Article Editor" }}</h1>
      <p>Use this page to refine content, save a draft, or publish an article.</p>
    </div>

    <div class="editor-content">
      <form @submit.prevent="saveArticle" class="editor-form">
        <div class="form-group">
          <label for="title">Title</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            placeholder="Enter article title"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="summary">Summary / Content</label>
          <textarea
            id="summary"
            v-model="form.summary"
            class="form-textarea"
            rows="6"
            placeholder="Paste or edit the content here"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Steps</label>
          <div class="steps-container">
            <div class="steps-list">
              <div
                v-for="(step, index) in form.steps"
                :key="index"
                class="step-item"
              >
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">
                  <p>{{ step }}</p>
                </div>
                <button
                  type="button"
                  class="btn-remove"
                  @click="removeStep(index)"
                >
                  ✕
                </button>
              </div>
            </div>
            <div class="add-step">
              <input
                v-model="newStep"
                type="text"
                placeholder="Add a new step"
                class="form-input"
                @keyup.enter="addStep"
              />
              <button type="button" class="btn btn-add-step" @click="addStep">
                Add Step
              </button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="tags">Tags</label>
          <input
            id="tags"
            v-model="form.tags"
            type="text"
            placeholder="e.g. delivery, tracking, error"
            class="form-input"
          />
          <small class="form-hint">Separate tags with commas.</small>
        </div>

        <div class="form-group" v-if="isAdmin">
          <label for="status">Status</label>
          <select id="status" v-model="form.status" class="form-select">
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="not-approved">Not Approved</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-submit">
            {{ isEdit ? "Save Changes" : "Save Article" }}
          </button>
          <button type="button" class="btn btn-reset" @click="resetForm">
            Reset
          </button>
        </div>
      </form>
    </div>

    <div class="editor-footer">
      <button class="btn-footer btn-back" @click="goBack">
        Back to Knowledge Base
      </button>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "ArticleEditor",
  data() {
    return {
      form: {
        title: "",
        summary: "",
        steps: [],
        tags: "",
        status: "draft"
      },
      newStep: "",
      isEdit: false,
      articleId: null,
      role: localStorage.getItem("role") || "user"
    };
  },
  computed: {
    isAdmin() {
      return this.role === "admin";
    }
  },
  mounted() {
    const savedDraft = sessionStorage.getItem("articleDraft");
    const savedEdit = sessionStorage.getItem("articleEdit");

    if (savedEdit) {
      try {
        const article = JSON.parse(savedEdit);
        this.loadArticle(article);
        this.isEdit = true;
        this.articleId = article.id;
        return;
      } catch {
        sessionStorage.removeItem("articleEdit");
      }
    }

    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        this.loadArticle(draft);
        sessionStorage.removeItem("articleDraft");
      } catch {
        sessionStorage.removeItem("articleDraft");
      }
    }
  },
  methods: {
    loadArticle(article) {
      this.form = {
        title: article.title || "",
        summary: article.summary || "",
        steps: Array.isArray(article.steps) ? article.steps : [],
        tags: Array.isArray(article.tags) ? article.tags.join(", ") : article.tags || "",
        status: article.status || "draft"
      };
    },
    addStep() {
      if (this.newStep.trim()) {
        this.form.steps.push(this.newStep.trim());
        this.newStep = "";
      }
    },
    removeStep(index) {
      this.form.steps.splice(index, 1);
    },
    async saveArticle() {
      if (!this.form.title.trim()) {
        alert("Please enter an article title.");
        return;
      }
      if (this.form.steps.length === 0) {
        alert("Please add at least one step.");
        return;
      }

      const articlePayload = {
        title: this.form.title.trim(),
        summary: this.form.summary.trim(),
        steps: this.form.steps,
        tags: this.form.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        status: this.form.status,
        dateCreated: new Date().toISOString()
      };

      try {
        if (this.isEdit && this.articleId) {
          await api.updateArticle(this.articleId, articlePayload);
          alert("Article updated successfully.");
        } else {
          await api.addArticle(articlePayload);
          alert("Article saved successfully.");
        }
        this.clearSessionDrafts();
        this.$router.push("/app/knowledge-base");
      } catch (error) {
        console.error(error);
        alert("Unable to save the article. Please try again.");
      }
    },
    resetForm() {
      this.form = {
        title: "",
        summary: "",
        steps: [],
        tags: "",
        status: "draft"
      };
      this.newStep = "";
      this.isEdit = false;
      this.articleId = null;
      this.clearSessionDrafts();
    },
    goBack() {
      this.clearSessionDrafts();
      this.$router.push("/app/knowledge-base");
    },
    clearSessionDrafts() {
      sessionStorage.removeItem("articleDraft");
      sessionStorage.removeItem("articleEdit");
    }
  }
};
</script>

<style scoped>
* {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.editor-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: clamp(16px, 4vw, 24px);
  gap: 16px;
}

.editor-header {
  text-align: center;
}

.editor-header h1 {
  font-size: clamp(22px, 5vw, 30px);
  margin-bottom: 8px;
  color: #000;
}

.editor-header p {
  color: #666;
  font-size: clamp(12px, 2vw, 14px);
}

.editor-content {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: clamp(18px, 4vw, 24px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
}

.editor-form {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 3vw, 22px);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group label {
  font-weight: 600;
  color: #111;
  font-size: clamp(13px, 2vw, 14px);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: clamp(10px, 2vw, 14px);
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  font-size: clamp(13px, 2vw, 14px);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  color: #333;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.18);
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: #fff7cd;
  border: 1px solid #f7e5a2;
}

.step-number {
  font-weight: 700;
  color: #a66f00;
  min-width: 32px;
  text-align: center;
}

.step-content p {
  margin: 0;
  color: #333;
  font-size: 0.9rem;
}

.btn-remove {
  background: #ff4444;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  padding: 8px 10px;
}

.add-step {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-add-step {
  background: #FFD700;
  border: none;
  border-radius: 8px;
  padding: 12px 18px;
  color: #000;
  font-weight: 700;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: clamp(12px, 2vw, 16px);
  flex-wrap: wrap;
}

.btn {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  padding: clamp(12px, 2vw, 14px) clamp(18px, 3vw, 22px);
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-submit {
  background: #FF4444;
  color: white;
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(255, 68, 68, 0.16);
}

.btn-reset {
  background: #e0e0e0;
  color: #333;
}

.btn-footer {
  width: fit-content;
  background: #1a1a1a;
  color: white;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .editor-content,
  .editor-container {
    padding: 16px;
  }
  .add-step {
    flex-direction: column;
  }
  .editor-footer {
    justify-content: center;
  }
}
</style>
