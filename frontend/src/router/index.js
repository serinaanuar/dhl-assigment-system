import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated, getRole } from "../services/auth";

import Login from "../views/Login.vue";
import AppLayout from "../layouts/AppLayout.vue";
import Dashboard from "../views/Dashboard.vue";
import UploadArticle from "../views/UploadArticle.vue";
import AddArticle from "../views/AddArticle.vue";
import KnowledgeBase from "../views/KnowledgeBase.vue";
import ArticleEditor from "../views/ArticleEditor.vue";
import AdminPanel from "../views/AdminPanel.vue";
import RpaLogs from "../views/RpaLogs.vue";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/app",
    component: AppLayout,
    children: [
      {
        path: "dashboard",
        component: Dashboard,
        meta: { requiresAuth: true }
      },
      {
        path: "knowledge-base",
        component: KnowledgeBase,
        meta: { requiresAuth: true, allowedRoles: ["user", "admin"] }
      },
      {
        path: "upload",
        component: UploadArticle,
        meta: { requiresAuth: true, allowedRoles: ["user", "admin"] }
      },
      {
        path: "editor",
        component: ArticleEditor,
        meta: { requiresAuth: true, allowedRoles: ["user", "admin"] }
      },
      {
        path: "add-article",
        component: AddArticle,
        meta: { requiresAuth: true, allowedRoles: ["user", "admin"] }
      },
      {
        path: "admin",
        component: AdminPanel,
        meta: { requiresAuth: true, allowedRoles: ["admin"] }
      },
      {
        path: "rpa-logs",
        component: RpaLogs,
        meta: { requiresAuth: true, allowedRoles: ["admin"] }
      },
      {
        path: "",
        redirect: "dashboard"
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = isAuthenticated();
  const role = getRole();

  if (to.path === "/login" && auth) {
    return next("/app/dashboard");
  }

  if (to.matched.some(record => record.meta.requiresAuth) && !auth) {
    return next("/login");
  }

  const allowedRoles = to.meta.allowedRoles;
  if (allowedRoles && auth && !allowedRoles.includes(role)) {
    return next("/app/dashboard");
  }

  next();
});

export default router;
