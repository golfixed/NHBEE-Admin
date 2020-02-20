
<template>
  <div class="isdesktop">
    <div
      style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px;"
    >
      <h1 class="tab-headtext">บัญชีผู้ใช้</h1>
      <div class="post-toolbar">
        <div class="toolbar-button" @click="newPostOpen();">
          <span>เพิ่มบัญชีใหม่</span>
          <i class="fas fa-edit toolbar-btn-icon"></i>
        </div>
      </div>
    </div>
    <div class="users-display">
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
        <tr v-for="(user, i) in userList" :key="'user_' + user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.name }}</td>
          <td>
            <i :class="'fas fa-' + (user.admin ? 'check' : 'times')"></i>
          </td>
          <td>
            <button @click="editUser(i)">Edit</button>
            <button @click="deleteUser(i)">Delete</button>
          </td>
        </tr>
      </table>
    </div>
    <p style="color: red;" v-if="errorMessage">{{ errorMessage }}</p>
    <div v-if="userIndex >= 0" class="edit-account-box">
      <div class="section-text" style="  padding-bottom: 10px;">
        <i class="fas fa-user-edit" style="margin-right: 10px;"></i>
        <h5>แก้ไขบัญชีผู้ใช้</h5>
      </div>
      <div class="input-item">
        <h4>ชื่อผู้ใช้งาน</h4>
        <input type="text" v-model="username" placeholder="Username" />
      </div>
      <div class="input-item">
        <h4>ชื่อ นามสกุล</h4>
        <input type="text" v-model="name" placeholder="Name" />
      </div>
      <div class="input-item">
        <h4>รหัสผ่าน</h4>
        <input type="checkbox" v-model="isPassword" />
        <label for="checkbox">Change Password</label>
      </div>
      <div v-if="isPassword" class="input-item">
        <input type="password" v-model="password" placeholder="Password" />
      </div>
      <div class="input-item">
        <h4>สิทธิ์การใช้งาน</h4>
        <input type="checkbox" v-model="admin" />
        <label for="checkbox">ผู้ดูแลระบบ</label>
      </div>
      <div class="toolbar-button" @click="saveUser()" style="margin-top:20px;">
        <span>บันทึก</span>
        <i class="fas fa-save toolbar-btn-icon"></i>
      </div>
    </div>
    <div v-else-if="userIndex < 0" class="new-account-box">
      <div class="section-text" style="  padding-bottom: 10px;">
        <i class="fas fa-user-plus" style="margin-right: 10px;"></i>
        <h5>สร้างบัญชีผู้ใช้ใหม่</h5>
      </div>
      <div class="input-item">
        <h4>ชื่อผู้ใช้งาน</h4>
        <input type="text" v-model="username" placeholder="Username" />
      </div>
      <div class="input-item">
        <h4>ชื่อ นามสกุล</h4>
        <input type="text" v-model="name" placeholder="Name" />
      </div>
      <div class="input-item">
        <h4>รหัสผ่าน</h4>
        <input type="password" v-model="password" placeholder="Password" />
      </div>
      <div class="input-item">
        <h4>สิทธิ์การใช้งาน</h4>
        <input type="checkbox" v-model="admin" />
        <label for="checkbox">ผู้ดูแลระบบ</label>
      </div>
      <div class="toolbar-button" @click="saveUser()" style="margin-top:20px;">
        <span>บันทึก</span>
        <i class="fas fa-save toolbar-btn-icon"></i>
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
        });
    },
    clearUser() {
      this.userIndex = -1;
      this.username = "";
      this.name = "";
      this.isPassword = false;
      this.password = "";
      this.admin = false;
    },
    editUser(index) {
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
  border-radius: 5px;
  border: 1px solid grey;
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
  width: 50%;
  background-color: #fff;
  border: 1px solid grey;
  border-radius: 5px;
  margin-top: 20px;
  padding: 20px;
}
.input-item {
  display: flex;
  align-items: center;
  height: 30px;
  color: #404040;
}
.input-item > h4 {
  width: 200px;
}
.toolbar-button {
  width: fit-content;
  height: 30px;
  background-color: #fff;
  /* border-radius: 5px;
  border: 1px solid grey; */
  font-size: 15px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  transition: all 0.1s;
}
.toolbar-button:hover {
  background-color: rgb(220, 220, 220);
  transition: all 0.1s;
  cursor: pointer;
}
.toolbar-btn-icon {
  margin-left: 10px;
}
</style>