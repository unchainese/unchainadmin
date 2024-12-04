<template>
  <div class="login-container">
    <el-card class="login-card">
      <div slot="header" class="login-header">
        <span>Login</span>
      </div>
      <div class="login-content">
        <el-button
            type="primary"
            icon="el-icon-user"
            size="large"
            @click="handleGoogleLogin"
        >
          Login with Google
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      clientId: "YOUR_GOOGLE_CLIENT_ID", // Replace with your Google Client ID
    };
  },
  methods: {
    handleGoogleLogin() {
      window.location.href = `${window.location.protocol}//${window.location.host}/auth/google`;
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
  text-align: center;
}

.login-header {
  font-size: 20px;
  font-weight: bold;
}

.login-content {
  margin-top: 20px;
}
</style>
