
<template>
  <div class="isdesktop">
    <div class="toolbar-panel-bg" style="margin-bottom: 20px;">
      <h1 class="tab-headtext">บัญชีผู้ใช้</h1>
      <div class="post-toolbar">
        <div class="toolbar-button toolbar-button-white" @click="newUserToggle('open');">
          <span>เพิ่มบัญชีใหม่</span>
          <i class="fas fa-plus toolbar-btn-icon"></i>
        </div>
      </div>
    </div>
    <div class="tab-view">
      <div class="section-text" style="padding-top:20px;background-color: #fff;padding-left: 20px;">
        <i class="fas fa-users" style="margin-right: 10px;"></i>
        <h5>บัญชีผู้ใช้งานทั้งหมด</h5>
      </div>
      <table>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Name</th>
          <th>Admin</th>
          <th>
            Options
            <!-- <button @click="clearUser">Clear Form</button> -->
          </th>
        </tr>
        <tr class="list-item" v-for="(user, i) in userList" :key="'user_' + user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.name }}</td>
          <td>
            <i :class="'fas fa-' + (user.admin ? 'check' : 'times')"></i>
          </td>
          <td style="position:relative;">
            <button class="list-icon-btn list-icon-btn-edit" @click="editUser(i)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="list-icon-btn list-icon-btn-trash" @click="deleteUser(i)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </table>
    </div>
    <div class="popup-mask" v-if="isNewOpen === true" v-on:click="newUserToggle('close');"></div>
    <div class="popup-window" v-if="isNewOpen == true">
      <div style="display: block;padding:20px;">
        <div v-if="userIndex >= 0" class="edit-account-box">
          <div class="control-tab">
            <h3 class="window-headtext">
              แก้ไขบัญชีผู้ใช้
              <i class="fas fa-edit popup-btn-icon"></i>
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
    saveUser(index = -1) {
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
        method: index >= 0 ? "put" : "post",
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
          method: "delete",
          url: `/admin/user/${this.userList[index].id}`
        })
          .then(() => {
            this.userList.splice(index, 1);
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