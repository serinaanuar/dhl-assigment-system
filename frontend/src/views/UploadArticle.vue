<template>
  <div class="upload-container">
    <!-- HEADER -->
    <div class="upload-header">
      <h1>Upload or Generate Article</h1>
      <p>Import a file or paste raw text to generate a draft article</p>
    </div>

    <!-- CONTENT -->
    <div class="upload-content">
      <!-- FILE UPLOAD SECTION -->
      <div class="upload-section">
        <h2>Import File</h2>
        <div class="file-input-wrapper">
          <input 
            type="file" 
            id="file-input"
            @change="handleFileUpload"
            accept=".pdf,.docx,.txt"
            class="file-input"
          />
          <label for="file-input" class="file-label">
            <span class="upload-icon">📁</span>
            <span>Choose File (PDF, DOCX, or TXT)</span>
          </label>
          <div class="file-name" v-if="fileName">{{ fileName }}</div>
        </div>
      </div>

      <!-- DIVIDER -->
      <div class="divider">OR</div>

      <!-- TEXT INPUT SECTION -->
      <div class="text-section">
        <h2>Paste Raw Text</h2>
        <textarea
          v-model="rawText"
          class="text-input"
          placeholder="Paste your procedure, notes or documentation here"
        ></textarea>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="action-buttons">
        <button 
          @click="generateDraft"
          class="btn btn-generate"
          :disabled="!fileName && !rawText"
        >
          Generate Draft
        </button>
        <button 
          @click="openEditor"
          class="btn btn-editor"
          :disabled="!fileName && !rawText"
        >
          Open Editor
        </button>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="upload-footer">
      <button @click="startBlank" class="btn-footer btn-blank">
        Start a Blank Article
      </button>
      <button @click="backToDashboard" class="btn-footer btn-back">
        Back to Dashboard
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UploadArticle",
  data() {
    return {
      fileName: "",
      rawText: "",
      fileContent: ""
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.fileName = file.name;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.fileContent = e.target.result;
        };
        reader.readAsText(file);
      }
    },
    getDraftPayload() {
      const raw = this.rawText.trim();
      const content = this.fileName ? this.fileContent : raw;
      const title = this.fileName
        ? this.fileName.replace(/\.[^/.]+$/, "")
        : raw.split("\n")[0] || "Draft Article";

      return {
        title,
        summary: content || "",
        steps: [],
        tags: [],
        status: "draft",
        dateCreated: new Date().toISOString()
      };
    },
    async generateDraft() {
      if (!this.fileName && !this.rawText) {
        alert("Please upload a file or paste text");
        return;
      }
      const payload = this.getDraftPayload();
      sessionStorage.setItem("articleDraft", JSON.stringify(payload));
      alert("Draft ready in the editor.");
      this.$router.push("/app/editor");
    },
    openEditor() {
      if (!this.fileName && !this.rawText) {
        alert("Please upload a file or paste text");
        return;
      }
      const payload = this.getDraftPayload();
      sessionStorage.setItem("articleDraft", JSON.stringify(payload));
      this.$router.push("/app/editor");
    },
    startBlank() {
      const payload = {
        title: "",
        summary: "",
        steps: [],
        tags: "",
        status: "draft"
      };
      sessionStorage.setItem("articleDraft", JSON.stringify(payload));
      this.$router.push("/app/editor");
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

.upload-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: clamp(16px, 4vw, 24px);
  gap: 16px;
}

.upload-header {
  text-align: center;
  margin-bottom: 20px;
}

.upload-header h1 {
  color: #000;
  font-size: clamp(20px, 5vw, 28px);
  margin-bottom: 8px;
}

.upload-header p {
  color: #666;
  font-size: clamp(12px, 2vw, 14px);
}

.upload-content {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: clamp(16px, 4vw, 24px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
}

.upload-section h2,
.text-section h2 {
  color: #000;
  font-size: clamp(14px, 3vw, 16px);
  margin-bottom: 12px;
  border-bottom: 2px solid #FFD700;
  padding-bottom: 8px;
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

.text-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.text-input {
  width: 100%;
  min-height: 150px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: clamp(12px, 1.8vw, 14px);
  resize: vertical;
  transition: all 0.2s ease;
  background-color: #f5f5f5;
  color: #333;
}

.text-input:focus {
  outline: none;
  border-color: #FFD700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
}

.text-input::placeholder {
  color: #999;
}

.action-buttons {
  display: flex;
  gap: clamp(8px, 2vw, 12px);
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  min-width: 140px;
  padding: clamp(10px, 2vw, 12px) clamp(16px, 3vw, 20px);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: clamp(12px, 2vw, 14px);
  transition: all 0.3s ease;
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-generate {
  background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%);
  color: #333;
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.btn-editor {
  background: linear-gradient(135deg, #FF6B35 0%, #E63946 100%);
}

.btn-editor:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(230, 57, 70, 0.4);
}

.upload-footer {
  display: flex;
  justify-content: space-between;
  gap: clamp(8px, 2vw, 12px);
  padding: clamp(12px, 3vw, 16px);
  border-top: 1px solid #eee;
}

.btn-footer {
  flex: 1;
  padding: clamp(10px, 2vw, 12px) clamp(12px, 2vw, 16px);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: clamp(12px, 1.8vw, 13px);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-blank {
  background: linear-gradient(135deg, #F77F00 0%, #D40511 100%);
  color: white;
}

.btn-blank:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 5, 17, 0.3);
}

.btn-back {
  background: #666;
  color: white;
}

.btn-back:hover {
  background: #555;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 640px) {
  .upload-footer {
    flex-direction: column;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn,
  .btn-footer {
    width: 100%;
  }
}
</style>
