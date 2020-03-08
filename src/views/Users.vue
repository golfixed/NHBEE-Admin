
<template>
  <div class="isdesktop">
    <div class="toolbar-panel-bg" style="margin-bottom: 20px;">
      <h1 class="page-headtext">บัญชีผู้ใช้</h1>
      <div class="post-toolbar">
        <div class="toolbar-button toolbar-button-white" @click="getUser();">
          <span>รีเฟรช</span>
          <i class="fas fa-sync toolbar-btn-icon"></i>
        </div>
        <div class="toolbar-button toolbar-button-white" @click="newUserToggle('open');">
          <span>เพิ่มบัญชีใหม่</span>
          <i class="fas fa-plus toolbar-btn-icon"></i>
        </div>
      </div>
    </div>
    <div class="tab-view no-tab">
      <div class="tab-title">
        <i class="fas fa-users" style="margin-right: 10px;"></i>
        <h5>บัญชีผู้ใช้งานทั้งหมด</h5>
      </div>
      <div class="no-result no-tab" v-if="userList.length <= 0">
        <div class="no-inner-box">
          <div v-if="isLoading == true">
            <h3>กำลังโหลด</h3>
            <h4>โปรดรอสักครู่</h4>
          </div>
          <div v-if="isLoading == false">
            <h3>ยังไม่มีข้อมูลตอนนี้</h3>
          </div>
        </div>
      </div>
      <div class="card-display">
        <div class="card-container" v-for="(user, i) in userList" :key="'user_' + user.id">
          <div class="card-box">
            <div>
              <i class="fas fa-user-circle"></i>
              <p class="user-id">ID: {{user.id}}</p>
              <div class="user-info">
                <p>ชื่อผู้ใช้</p>
                <p>{{user.username}}</p>
              </div>
              <div class="user-info">
                <p>ชื่อ</p>
                <p>{{user.name}}</p>
              </div>
              <div class="user-info">
                <p>ประเภทผู้ใช้</p>
                <p v-if="user.admin == true">ผู้ดูแลระบบ</p>
                <p v-if="user.admin == false">ผู้ใช้ทั่วไป</p>
              </div>
              <button class="user-edit-btn" @click="editUser(i)">
                <i class="fas fa-user-edit"></i>
              </button>
              <button class="user-del-btn" @click="deleteUser(i)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup-mask" v-if="isNewOpen === true" v-on:click="newUserToggle('close');"></div>
    <div class="popup-window" v-if="isNewOpen == true">
      <div style="display: block;padding:20px;">
        <div v-if="userIndex >= 0" class="edit-account-box">
          <div class="control-tab">
            <h3 class="window-headtext">
              แก้ไขบัญชีผู้ใช้
              <i class="fas fa-user-edit popup-btn-icon"></i>
            </h3>
            <hr class="section-hr" />
          </div>
          <div class="input-item">
            <h4>ชื่อผู้ใช้งาน</h4>
            <input type="text" v-model="username" placeholder="ตัวอย่าง: admin" />
          </div>
          <div class="input-item">
            <h4>ชื่อ นามสกุล</h4>
            <input type="text" v-model="name" placeholder="ตัวอย่าง: Winai Jongpakdee" />
          </div>
          <div class="input-item">
            <h4>รหัสผ่าน</h4>
            <div class="checkbox">
              <input type="checkbox" v-model="isPassword" />
              <label for="checkbox">เปลี่ยนรหัสผ่าน</label>
            </div>
          </div>
          <div v-if="isPassword" class="input-item">
            <label for="checkbox">รหัสผ่านใหม่</label>
            <input type="password" v-model="password" placeholder="รหัสผ่านใหม่" />
          </div>
          <div class="input-item">
            <h4>สิทธิ์การใช้งาน</h4>
            <div class="checkbox">
              <input type="checkbox" value="true" v-model="admin" />
              <label for="checkbox">ผู้ดูแลระบบ</label>
            </div>
          </div>
        </div>
        <div v-else-if="userIndex < 0" class="new-account-box">
          <div class="control-tab">
            <h3 class="window-headtext">
              สร้างบัญชีผู้ใช้ใหม่
              <i class="fas fa-plus popup-btn-icon"></i>
            </h3>
            <hr class="section-hr" />
          </div>
          <div class="input-item">
            <h4>ชื่อผู้ใช้งาน</h4>
            <input type="text" v-model="username" placeholder="ตัวอย่าง: admin" />
          </div>
          <div class="input-item">
            <h4>ชื่อ นามสกุล</h4>
            <input type="text" v-model="name" placeholder="ตัวอย่าง: Winai Jongpakdee" />
          </div>
          <div class="input-item">
            <h4>รหัสผ่าน</h4>
            <input type="password" v-model="password" placeholder="รหัสผ่าน" />
          </div>
          <div class="input-item">
            <h4>สิทธิ์การใช้งาน</h4>
            <div class="checkbox">
              <input type="checkbox" value="true" v-model="admin" />
              <label for="checkbox">ผู้ดูแลระบบ</label>
            </div>
          </div>
        </div>
        <p class="error-msg" v-if="errorMessage">{{ errorMessage }}</p>
        <hr class="section-hr" style="margin-top: 20px;" />
        <div class="popup-btn-panel-2col">
          <div class="left-group">
            <div
              class="popup-button popup-button-cancel"
              @click="newUserToggle('close');"
              :disabled="isLoading"
            >
              <span>ยกเลิก</span>
              <i class="fas fa-times popup-btn-icon"></i>
            </div>
          </div>
          <div class="right-group">
            <div
              class="popup-button popup-button-submit"
              @click="saveUser();"
              :disabled="isLoading"
            >
              <span>บันทึกข้อมูล</span>
              <i class="fas fa-save popup-btn-icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios.js";
import { isNumber } from "util";
import layout_default from "@/layouts/main.vue";

export default {
  name: "users",
  data() {
    return {
      userList: [],
      isLoading: false,
      isNewOpen: false,
      userIndex: -1,
      username: "",
      name: "",
      isPassword: false,
      password: "",
      admin: false,
      errorMessage: ""
    };
  },
  created() {
    this.getUser();
    this.$emit(`update:layout`, layout_default);
  },
  methods: {
    newUserToggle(cmd) {
      this.clearUser();
      if (cmd == "open") this.isNewOpen = true;
      else if (cmd == "close") this.isNewOpen = false;
      else this.isNewOpen = this.isNewOpen;
    },
    getUser() {
      if (this.isLoading) return "";
      this.isLoading = true;
      axios("/admin/user")
        .then(response => {
          this.userList = response.data;
        })
        .catch(error => {
          if (error.response && error.response.data)
            console.error("get user", error.response.data.error);
          else console.error("get user", error.message);
        })
        .finally(() => {
          this.isLoading = false;
          this.isNewOpen = false;
        });
    },
    clearUser() {
      this.userIndex = -1;
      this.username = "";
      this.name = "";
      this.isPassword = false;
      this.password = "";
      this.admin = false;
      this.errorMessage = false;
    },
    editUser(index) {
      this.isNewOpen = true;
      const data = this.userList[index];
      if (data) {
        this.userIndex = index;
        this.username = data.username;
        this.name = data.name;
        this.isPassword = false;
        this.password = "";
        this.admin = data.admin;
      }
    },
    saveUser() {
      const index = this.userIndex;
      this.errorMessage = "";
      let url = "/admin/user";
      const data = {
        username: this.username,
        name: this.name,
        admin: this.admin
      };
      if (index >= 0) {
        url = `/admin/user/${this.userList[index].id}`;
        if (this.isPassword) data.password = this.password;
      } else {
        data.password = this.password;
      }
      axios({
        method: "post",
        url: url,
        data: data
      })
        .then(response => {
          const data = response.data;
          if (index >= 0) {
            let userList = this.userList;
            this.userList = [];
            userList[index] = data;
            this.userList = userList;
          } else {
            this.userList.push(data);
          }
          this.clearUser();
          this.newUserToggle("close");
        })
        .catch(error => {
          if (error.response && error.response.data)
            this.errorMessage = error.response.data.error;
          else this.errorMessage = error.message;
        });
    },
    deleteUser(index) {
      if (confirm(`ยืนยันการลบ ${this.userList[index].username} ?`)) {
        axios({
          method: "post",
          url: `/admin/user/${this.userList[index].id}/delete`
        })
          .then(() => {
            this.userList.splice(index, 1);
            this.newUserToggle("close");
          })
          .catch(error => {
            if (error.response && error.response.data)
              console.error("delete user", error.response.data.error);
            else console.error("delete user", error.message);
          });
      }
    }
  }
};
</script>

<style scoped>
.card-display {
  padding: 20px;
  display: flex;
  /* height: calc(100vh - 190px); */
  overflow: scroll;
  flex-wrap: wrap;
}
.card-container {
  width: 200px;
  margin-right: 20px;
  margin-bottom: 20px;
}
.card-display > .card-container:last-child {
  margin-right: 0;
}
.card-box {
  background-color: #f1f1f1;
  border-radius: 10px;
  width: 100%;
  border: 1px solid #f1f1f1;
  transition: all 0.1s;
}
.card-box:hover {
  border: 1px solid rgb(100, 100, 100);
  transition: all 0.1s;
}
.card-box > div {
  padding: 10px;
  position: relative;
}
.card-box > div > i {
  font-size: 30px;
  color: #808080;
  width: 100%;
  margin-bottom: 20px;
}
.card-box > div > p.user-id {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #808080;
}

.user-info {
  padding-bottom: 10px;
}
.user-info > p:first-child {
  font-size: 12px;
  color: #808080;
}
.user-info > p:last-child {
  font-size: 16px;
}

.user-del-btn,
.user-edit-btn {
  border-radius: 10000px;
  width: 35px;
  height: 35px;
  background-color: #fff;
  position: absolute;
  display: none;
  font-size: 16px;
  -webkit-box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.22);
  -moz-box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.22);
  border: 0;
  user-select: none;
  outline: none;
}

.card-container:hover > div.card-box > div > button.user-edit-btn,
.card-container:hover > div.card-box > div > button.user-del-btn {
  display: block;
}

.user-del-btn {
  right: 10px;
  bottom: 10px;
}
.user-del-btn:hover {
  background-color: rgb(255, 75, 75);
  color: #fff;
  transition: all 0.1s;
}
.user-edit-btn {
  right: 10px;
  bottom: 55px;
}
.user-edit-btn:hover {
  background-color: rgb(100, 100, 100);
  color: #fff;
  transition: all 0.1s;
}

table {
  width: 100%;
  padding: 20px;
}
table > tr > th {
  text-align: left;
  color: #808080;
}
.users-display {
  background-color: #fff;
}
.section-text {
  display: flex;
  align-items: center;
}
.section-text > h5 {
  font-size: 20px;
}
.new-account-box,
.edit-account-box {
  background-color: #fff;
  width: 350px;
  display: block;
}
.section-hr {
  border: 1px solid #ececec;
}

.input-item > input {
  background-color: #f1f1f1;
  border: 0;
  width: calc(100% - 10px);
  height: 30px;
  font-size: 14px;
  margin: 5px 0 20px 0;
  padding-left: 10px;
}
.window-headtext {
  font-size: 25px;
  padding-bottom: 15px;
  margin: 0;
}
.control-tab {
  display: block;
}
.error-msg {
  color: #fff;
  background-color: #ff0000a1;
  text-align: center;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.checkbox {
  display: flex;
  background-color: #f1f1f1;
  border: 0;
  width: calc(100% - 10px);
  height: 30px;
  font-size: 14px;
  margin: 5px 0 20px 0;
  padding-left: 10px;
  align-items: center;
}
.checkbox > label {
  margin-left: 10px;
}
.list-icon-btn {
  right: 0;
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
  outline: none;
  border: 0;
  margin-right: 5px;
  font-size: 15px;
  cursor: pointer;
}
.list-icon-btn:hover {
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.list-icon-btn-trash:hover {
  color: red;
}
.list-icon-btn-edit:hover {
  color: grey;
}
.list-item {
  transition: all 0.1s;
  height: 30px;
}
.list-item:hover {
  transition: all 0.1s;
  -webkit-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  -moz-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  border-radius: 5px;
}
</style>