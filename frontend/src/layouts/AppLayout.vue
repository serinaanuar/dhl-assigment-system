<template>
  <div class="layout">
    <!-- HAMBURGER BUTTON -->
    <button class="hamburger" @click="toggleSidebar" v-if="!sidebarOpen">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- SIDEBAR -->
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <div class="logo">DHL Knowledge System</div>
        <button class="close-btn" @click="toggleSidebar" v-if="sidebarOpen">✕</button>
      </div>

      <nav class="nav">

        <router-link to="/app/dashboard" class="nav-item">
            Dashboard
        </router-link>

        <!-- ADMIN ONLY -->
        <router-link 
            v-if="isAdmin"
            to="/app/dashboard"
            class="nav-item"
        >
            Admin Panel
        </router-link>

        <!-- USER ONLY -->
        <router-link 
            v-if="isUser || isAdmin"
            to="/app/knowledge-base"
            class="nav-item"
        >
            Knowledge Base
        </router-link>

        </nav>

      <div class="footer">
        <button class="logout" @click="logout">Logout</button>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="main">

      <header class="topbar">
        <button class="hamburger-top" @click="toggleSidebar" v-if="sidebarOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="title">Knowledge Dashboard</div>
        <div class="topbar-right">
          <div class="role">
              {{ role.toUpperCase() }}
          </div>
          <img src="/dhl-logo.png" alt="DHL" class="dhl-logo" />
        </div>
      </header>

      <!-- IMPORTANT: THIS MUST EXIST -->
      <section class="content">
        <router-view />
      </section>

    </div>

  </div>
</template>

<script>
export default {
  name: "AppLayout",

  data() {
    return {
      role: localStorage.getItem("role") || "user",
      sidebarOpen: false
    };
  },

  computed: {
    isAdmin() {
      return this.role === "admin";
    },
    isUser() {
      return this.role === "user";
    }
  },

  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    }
  }
};
</script>

<style scoped>
* {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.layout {
  display: flex;
  height: 100vh;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  height: 100vh;
  background: linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 8px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  transform: translateX(-100%);
  z-index: 98;
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 8px 12px;
  display: block;
}

.logo {
  background: linear-gradient(135deg, #d40511 0%, #ff6b35 100%);
  padding: 20px 16px;
  font-weight: 800;
  text-align: center;
  font-size: 16px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 0 0 18px 18px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.18);
}

.nav {
  display: flex;
  flex-direction: column;
  padding: 20px 14px;
  flex: 1;
  overflow-y: auto;
  gap: 8px;
}

.nav-item {
  padding: 14px 18px;
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
  margin: 6px 0;
  font-size: 15px;
  border-radius: 12px;
  background: rgba(255,255,255,0.03);
}

.nav-item:hover {
  background: rgba(255, 215, 0, 0.12);
  border-left-color: #FFD700;
}

.nav-item.router-link-active {
  background: rgba(255, 215, 0, 0.12);
  border-left-color: #FFD700;
}

.nav-item:not(.router-link-active):hover {
  background: rgba(255, 215, 0, 0.12);
}

.nav-item:not(.router-link-active) {
  background: rgba(255,255,255,0.03);
}

.footer {
  padding: 20px 14px;
  border-top: 1px solid rgba(255,255,255,0.12);
  flex-shrink: 0;
}

.logout {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #FFD700 0%, #FFC700 100%);
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 6px;
  color: #333;
  transition: all 0.2s ease;
  font-size: 14px;
}

.logout:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  width: 100%;
  overflow: hidden;
}

.topbar {
  background: #999999;
  color: white;
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
  flex-wrap: wrap;
  gap: 8px;
  min-height: 60px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.title {
  font-size: clamp(18px, 4vw, 24px);
  font-weight: 700;
  flex: 1;
  text-align: left;
  min-width: 150px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role {
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 700;
}

.dhl-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  width: 100%;
}

.hamburger {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  position: fixed;
  left: 16px;
  top: 16px;
  z-index: 100;
}

.hamburger span {
  width: 24px;
  height: 2.5px;
  background: #333;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger-top {
  display: flex;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  gap: 5px;
  padding: 8px;
  z-index: 99;
}

.hamburger-top span {
  width: 24px;
  height: 2.5px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}
</style>
