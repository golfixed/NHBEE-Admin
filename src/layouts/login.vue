<template>
  <div class="login-body">
    <div class="login-dialog" style="text-align: center;">
      <img class="login-logo" src="logo.png" />
      <h2 class="login-title">เข้าโหมดผู้ดูแลระบบ</h2>
      <h2 class="login-desc">NHBEE KMUTT</h2>
      <div style="margin-top: 10px;">
        <input
          class="input-box"
          v-model="username"
          type="text"
          placeholder="Username"
          :disabled="isLoading"
        />
      </div>
      <div>
        <input
          class="input-box"
          v-model="password"
          type="password"
          placeholder="Password"
          :disabled="isLoading"
          @keypress.enter="login"
        />
      </div>
      <div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button class="login-btn" @click="login" :disabled="isLoading">
          <div class="btn-icon">
            <i class="fas fa-sign-in-alt"></i>
          </div>
          <label class="btn-text">เข้าสู่ระบบ</label>
        </button>
      </div>
      <slot />
    </div>
    <div class="bottom-text">
      <label class="label-text">Honeybee Laboratory KMUTT 2019</label>
    </div>
  </div>
</template>

<script>
import layout_default from "@/layouts/main.vue";

export default {
  name: "layout_login",
  data() {
    return {
      username: "",
      password: "",
      isLoading: false,
      errorMessage: ""
    };
  },
  methods: {
    login() {
      if (this.isLoading) return "";
      this.isLoading = true;
      this.errorMessage = "";
      const data = {
        username: this.username,
        password: this.password
      };
      this.$store
        .dispatch("login", data)
        .then(data => {
          this.$emit(`update:layout`, layout_default);
          console.log("login success");
        })
        .catch(error => {
          console.error("login", error.message);
          this.errorMessage = error.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style scoped>
.login-logo {
  width: 90px;
  margin: 20px 0;
}
.login-title {
  font-size: 25px;
  color: #404040;
}
.login-desc {
  font-size: 20px;
  color: #404040;
}
.login-body {
  background-color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
.login-dialog {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  -webkit-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  -moz-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
}
.login-btn {
  width: 100%;
  margin-top: 30px;
  height: 40px;
  border: 0;
  background-color: #afaf00;
  color: #fff;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: center;
  padding-left: 50px;
  border-radius: 5px;
  overflow: hidden;
}
.login-btn:hover > .btn-icon {
  background-color: #9f9f02;
}
.login-btn:hover {
  background-color: #bbbb02;
}
.btn-text {
  font-size: 18px;
}
.btn-icon {
  background-color: #989800;
  color: #fff;
  position: absolute;
  left: 0;
  top: 0;
  height: 40px;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
}
.input-box {
  width: 250px;
  height: 40px;
  font-size: 20px;
  border-radius: 5px;
  border: 0;
  margin: 10px 0 0 0;
  padding: 0 10px;
  background-color: #ececec;
}
.error-message {
  margin-top: 10px;
  color: #d82525;
}
.bottom-text {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #ffffff30;
  padding: 0 20px;
  border-radius: 5px 0 0 0;
  display: flex;
  align-items: center;
}
.label-text {
  font-size: 13px;
  color: #444;
}
</style>