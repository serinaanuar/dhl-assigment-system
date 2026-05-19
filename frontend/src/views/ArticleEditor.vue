<template>
  <div class="editor-container">
    <div class="editor-header">
      <h1>{{ isEdit ? "Edit Article" : "Article Editor" }}</h1>
      <p>Use this page to refine content, save a draft, or publish an article.</p>
    </div>

    <!-- AUTO-GENERATE SECTION -->
    <div class="editor-content" style="margin-bottom: 20px;">
      <div class="upload-section">
        <h2 class="section-title">Option 1: Auto-Generate (Optional)</h2>
        <p class="section-desc">Upload a document, image, or paste raw text. We will extract the content and automatically fill the form below.</p>
        
        <div class="file-input-wrapper">
          <input 
            type="file" 
            id="file-input"
            @change="handleFileUpload"
            accept=".png,.jpg,.jpeg,.pdf,.docx,.txt"
            class="file-input"
          />
          <label for="file-input" class="file-label">
            <span class="upload-icon">📁</span>
            <span>Choose File (PNG, JPG, PDF, DOCX, TXT)</span>
          </label>
          <div class="file-name" v-if="fileName">{{ fileName }}</div>
        </div>

        <div class="divider">OR</div>

        <textarea
          v-model="rawText"
          class="form-textarea text-input"
          placeholder="Paste raw content here to auto-fill the form below"
        ></textarea>
        
        <button 
          type="button" 
          class="btn btn-generate" 
          @click="generateContent"
          :disabled="(!fileName && !rawText) || loadingOcr"
          style="margin-top: 16px;"
        >
          {{ loadingOcr ? 'Extracting Text...' : 'Auto-Generate' }}
        </button>
      </div>
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
      role: localStorage.getItem("role") || "user",
      fileName: "",
      rawText: "",
      fileContent: "",
      loadingOcr: false,
      selectedFile: null
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
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.fileName = file.name;
        this.fileContent = `[Mock Content extracted from ${this.fileName}]`;
      }
    },
    async generateContent() {
      const fileNameLower = this.fileName.toLowerCase();
      const isImage = fileNameLower.endsWith('.png') || fileNameLower.endsWith('.jpg') || fileNameLower.endsWith('.jpeg');
      
      if (!this.form.title) {
        this.form.title = this.fileName ? this.fileName.replace(/\.[^/.]+$/, "") : "Generated Article";
      }
      
      if (this.form.steps.length === 0) {
        this.form.steps = ["Review extracted content", "Make necessary edits", "Submit for approval"];
      }

      if (isImage && this.selectedFile) {
        this.loadingOcr = true;
        try {
          const extractedText = await api.extractText(this.selectedFile);
          this.form.summary = extractedText;
          alert("Text successfully extracted from image!");
        } catch (err) {
          alert("Failed to extract text. Please try again.");
        } finally {
          this.loadingOcr = false;
        }
      } else {
        this.form.summary = this.rawText || "Auto-generated summary...";
        alert("Form auto-populated! You can now refine the content.");
      }
    },
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
      this.fileName = "";
      this.rawText = "";
      this.fileContent = "";
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

/* Upload Section Styles */
.section-title {
  color: #000;
  font-size: clamp(16px, 4vw, 18px);
  margin-bottom: 6px;
  border-bottom: 2px solid #FFD700;
  padding-bottom: 8px;
}

.section-desc {
  color: #666;
  font-size: clamp(12px, 2vw, 14px);
  margin-bottom: 16px;
}

.file-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-input {
  display: none;
}

.file-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: clamp(16px, 4vw, 24px);
  border: 2px dashed #FFD700;
  border-radius: 8px;
  background: rgba(255, 215, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #333;
  font-size: clamp(12px, 2vw, 14px);
}

.file-label:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: #FFC700;
}

.upload-icon {
  font-size: 24px;
}

.file-name {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  color: #333;
  font-size: clamp(11px, 1.8vw, 13px);
  word-break: break-all;
}

.divider {
  text-align: center;
  color: #999;
  font-size: clamp(12px, 2vw, 14px);
  font-weight: 600;
  padding: 12px 0;
}

.text-input {
  width: 100%;
  box-sizing: border-box;
}

.btn-generate {
  background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%);
  color: #333;
  width: 100%;
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.btn-generate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  background: #4CAF50;
  color: white;
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(76, 175, 80, 0.2);
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
