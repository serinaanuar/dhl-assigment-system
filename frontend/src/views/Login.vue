<template>
  <div class="login">

    <div class="box">
      <h2>DHL Knowledge System</h2>

      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <p class="error-message" v-if="error">{{ error }}</p>
      <button @click="login">Login</button>
    </div>

  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login() {
        if (this.email && this.password) {

            // SIMPLE ROLE LOGIC (for demo purposes)
            let role = "ops";

            if (this.email === "admin@dhl.com") role = "admin";
            else if (this.email === "rpa@dhl.com") role = "rpa";
            else role = "ops";

            localStorage.setItem("auth", "true");
            localStorage.setItem("role", role);

            this.$router.push("/app/dashboard");
        }
        }
  }
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #0f0f0f 0%, #1f1f1f 100%);
  padding: 20px;
}

.box {
  width: min(420px, 100%);
  background: #111;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 26px;
  padding: 38px 32px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.45);
}

.box h2 {
  color: #FFD700;
  text-align: center;
  margin-bottom: 24px;
  font-size: 1.8rem;
  letter-spacing: 0.02em;
}

input {
  width: 100%;
  padding: 14px 16px;
  margin: 10px 0;
  background-color: #1e1e1e;
  border: 1px solid #333;
  border-radius: 14px;
  box-sizing: border-box;
  color: #fff;
  font-weight: 500;
}

input:focus,
input:hover {
  border-color: #ffd700;
  outline: none;
}

input::placeholder {
  color: #999;
}

button {
  width: 100%;
  padding: 14px 16px;
  background: linear-gradient(135deg, #d40511 0%, #ff6b35 100%);
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 14px;
  font-weight: 700;
  margin-top: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 40px rgba(212, 5, 17, 0.25);
}
</style>