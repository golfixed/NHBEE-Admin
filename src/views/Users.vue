
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
    <table>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Name</th>
        <th>Admin</th>
        <th>
          <button @click="clearUser">Create</button>
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
    <p style="color: red;" v-if="errorMessage">{{ errorMessage }}</p>
    <div v-if="userIndex >= 0">
      Edit
      <div>
        <input type="text" v-model="username" placeholder="Username" />
      </div>
      <div>
        <input type="text" v-model="name" placeholder="Name" />
      </div>
      <div>
        <input type="checkbox" v-model="isPassword" />
        <label for="checkbox">Change Password</label>
      </div>
      <div v-if="isPassword">
        <input type="password" v-model="password" placeholder="Password" />
      </div>
      <div>
        <input type="checkbox" v-model="admin" />
        <label for="checkbox">Admin</label>
      </div>
      <button @click="saveUser(userIndex)">Save</button>
    </div>
    <div v-else-if="userIndex < 0">
      Create
      <div>
        <input type="text" v-model="username" placeholder="Username" />
      </div>
      <div>
        <input type="text" v-model="name" placeholder="Name" />
      </div>
      <div>
        <input type="password" v-model="password" placeholder="Password" />
      </div>
      <div>
        <input type="checkbox" v-model="admin" />
        <label for="checkbox">Admin</label>
      </div>
      <button @click="saveUser()">Save</button>
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

<style>
</style>