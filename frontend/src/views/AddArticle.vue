<template>
  <div class="article-container">
    <!-- HEADER -->
    <div class="article-header">
      <h1>Create New Article</h1>
      <p>You can auto-generate a draft by importing a file, or write an article completely from scratch.</p>
    </div>

    <!-- AUTO-GENERATE SECTION -->
    <div class="article-content" style="margin-bottom: 20px;">
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

    <!-- FORM CONTENT -->
    <div class="article-content">
      <h2 class="section-title">Option 2: Manual Entry / Review</h2>
      <p class="section-desc">Fill out these fields from scratch, or review and refine the auto-generated content before publishing.</p>
      
      <form @submit.prevent="submitArticle" class="article-form">
        <!-- TITLE -->
        <div class="form-group">
          <label for="title">Article Title</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            placeholder="Enter article title"
            class="form-input"
            required
          />
        </div>

        <!-- SUMMARY -->
        <div class="form-group">
          <label for="summary">Summary</label>
          <textarea
            id="summary"
            v-model="form.summary"
            placeholder="Write a short summary of the article"
            class="form-textarea"
            rows="4"
          ></textarea>
        </div>

        <!-- STEPS -->
        <div class="form-group">
          <label>Steps</label>
          <div class="steps-container">
            <div class="steps-list">
              <div v-for="(step, index) in form.steps" :key="index" class="step-item">
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">
                  <p>{{ step }}</p>
                </div>
                <button
                  type="button"
                  @click="removeStep(index)"
                  class="btn-remove"
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
              <button
                type="button"
                @click="addStep"
                class="btn btn-add-step"
              >
                Add Step
              </button>
            </div>
          </div>
        </div>

        <!-- TAGS -->
        <div class="form-group">
          <label for="tags">Tags</label>
          <input
            id="tags"
            v-model="form.tags"
            type="text"
            placeholder="e.g. delivery, tracking, error"
            class="form-input"
          />
          <small class="form-hint">Separate tags with commas</small>
        </div>

        <!-- PUBLICATION STATUS -->
        <div class="form-group" v-if="isAdmin">
          <label for="status">Publication Status</label>
          <select
            id="status"
            v-model="form.status"
            class="form-select"
          >
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
          </select>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="form-actions">
          <button type="submit" class="btn btn-submit">
            Create Article
          </button>
          <button type="button" @click="resetForm" class="btn btn-reset">
            Clear Form
          </button>
        </div>
      </form>
    </div>

    <!-- FOOTER -->
    <div class="article-footer">
      <button @click="backToDashboard" class="btn-footer btn-back">
        Back to Dashboard
      </button>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "AddArticle",
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
      
      this.form.title = this.fileName ? this.fileName.replace(/\.[^/.]+$/, "") : "Generated Article";
      this.form.steps = ["Review extracted content", "Make necessary edits", "Submit for approval"];
      if (isImage && this.selectedFile) {
        this.loadingOcr = true;
        try {
          // Call the backend OCR service
          const extractedText = await api.extractText(this.selectedFile);
          this.form.summary = extractedText;
          alert("Text successfully extracted from image!");
        } catch (err) {
          alert("Failed to extract text. Please try again.");
        } finally {
          this.loadingOcr = false;
        }
      } else {
        // Fallback for raw pasted text
        this.form.summary = this.rawText || "Auto-generated summary...";
        alert("Form auto-populated! You can now refine the content.");
      }
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
    async submitArticle() {
      if (!this.form.title.trim()) {
        alert("Please enter an article title");
        return;
      }
      if (this.form.steps.length === 0) {
        alert("Please add at least one step");
        return;
      }

      const payload = {
        title: this.form.title.trim(),
        summary: this.form.summary.trim(),
        steps: this.form.steps,
        tags: this.form.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        status: this.form.status,
        dateCreated: new Date().toISOString()
      };

      try {
        await api.addArticle(payload);
        alert("Article created successfully!");
        this.resetForm();
        this.$router.push("/app/knowledge-base");
      } catch (error) {
        console.error(error);
        alert("Unable to save article. Please try again.");
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
      this.fileName = "";
      this.rawText = "";
      this.fileContent = "";
    },
    backToDashboard() {
      this.$router.push("/app/dashboard");
    }
  }
};
</script>

<style scoped>
* {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.article-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: clamp(16px, 4vw, 24px);
  gap: 16px;
}

.article-header {
  text-align: center;
  margin-bottom: 20px;
}

.article-header h1 {
  color: #000;
  font-size: clamp(20px, 5vw, 28px);
  margin-bottom: 8px;
}

.article-header p {
  color: #666;
  font-size: clamp(12px, 2vw, 14px);
}

.article-content {
  flex: 1;
  background: black;
  border-radius: 8px;
  padding: clamp(16px, 4vw, 24px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

.article-form {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 3vw, 20px);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #000;
  font-weight: 600;
  font-size: clamp(12px, 2vw, 14px);
  border-bottom: 2px solid #FFD700;
  padding-bottom: 6px;
}

.form-input,
.form-select,
.form-textarea {
  padding: clamp(8px, 2vw, 12px);
  border: 1px solid rgba(212, 5, 17, 0.2); /* Light red border */
  border-radius: 6px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: clamp(12px, 1.8vw, 14px);
  transition: all 0.2s ease;
  background-color: rgba(212, 5, 17, 0.03); /* Very light red background */
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-hint {
  color: #999;
  font-size: clamp(11px, 1.5vw, 12px);
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.step-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  background: #f9f9f9;
  border-left: 3px solid #FFD700;
  border-radius: 4px;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%);
  color: #333;
  font-weight: 700;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: clamp(12px, 1.5vw, 13px);
}

.step-content {
  flex: 1;
}

.step-content p {
  color: #333;
  font-size: clamp(12px, 1.8vw, 13px);
  margin: 0;
  word-break: break-word;
}

.btn-remove {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 4px;
}

.btn-remove:hover {
  color: #d40511;
}

.add-step {
  display: flex;
  gap: clamp(8px, 2vw, 12px);
  flex-wrap: wrap;
}

.add-step .form-input {
  flex: 1;
  min-width: 150px;
}

.btn {
  padding: clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: clamp(12px, 1.8vw, 14px);
  transition: all 0.3s ease;
  color: white;
}

.btn-add-step {
  background: linear-gradient(135deg, #F77F00 0%, #D40511 100%);
  white-space: nowrap;
}

.btn-add-step:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 5, 17, 0.3);
}

.form-actions {
  display: flex;
  gap: clamp(8px, 2vw, 12px);
  flex-wrap: wrap;
  margin-top: 12px;
}

.btn-submit {
  flex: 1;
  min-width: 140px;
  background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%);
  color: #333;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.btn-reset {
  flex: 1;
  min-width: 140px;
  background: #666;
}

.btn-reset:hover {
  background: #555;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.article-footer {
  padding: clamp(12px, 3vw, 16px);
  border-top: 1px solid #eee;
}

.btn-footer {
  width: 100%;
  padding: clamp(10px, 2vw, 12px) clamp(12px, 2vw, 16px);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: clamp(12px, 1.8vw, 13px);
  transition: all 0.2s ease;
  background: #666;
  color: white;
}

.btn-back:hover {
  background: #555;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column;
  }

  .btn-submit,
  .btn-reset {
    width: 100%;
  }

  .add-step {
    flex-direction: column;
  }

  .add-step .form-input {
    min-width: auto;
  }

  .step-item {
    flex-wrap: wrap;
  }
}
</style>
