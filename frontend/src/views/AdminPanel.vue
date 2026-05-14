<template>
  <div class="page-panel">
    <h1>Admin Panel</h1>
    <p>This area is restricted to administrators. Use it to manage system settings and content review tasks.</p>
  </div>
</template>

<script>
export default {
  name: "AdminPanel"
};
</script>

<style scoped>
.page-panel {
  padding: 24px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.page-panel h1 {
  margin-bottom: 12px;
  color: #111;
}

.page-panel p {
  color: #5d556d;
}
</style>
