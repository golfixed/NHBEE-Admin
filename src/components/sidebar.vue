<template>
  <div class="main-bg display">
    <div class="logo-div">
      <img src="/img/PNG/logo.png" style="width: 100px;">
      <div class="logo-title">
        <p>
          ระบบจัดการ
          <br>NHBEE
        </p>
      </div>
    </div>
    <div class="sidebar-list-div">
      <div class="list-div">
        <sidebaritem linkto="/" icon="fas fa-tachometer-alt" label="Dashboard"/>
        <sidebaritem linkto="/post" icon="fas fa-quote-right" label="โพสต์"/>
        <sidebaritem linkto="/library" icon="fas fa-images" label="คลัง"/>
        <sidebaritem linkto="/survey" icon="fas fa-poll-h" label="แบบสอบถาม"/>
      </div>
      <div class="signout-div" @click="logout">
        <i class="fas fa-sign-out-alt signout-btn-icon"></i>
        <p>ออกจากระบบ</p>
      </div>
    </div>
  </div>
</template>

<script>
import sidebaritem from "@/components/sidebaritem.vue"
import layout_login from '@/layouts/login.vue'

export default {
  name: "sidebar",
  components: {
    sidebaritem
  },
  methods: {
    logout () {
      this.$store.dispatch('logout').then(() => {
        if (this.$route.path !== '/') this.$router.push('/')
        else this.$emit(`update:layout`, layout_login)
      })
    }
  }
};
</script>

<style lang="css" scoped>
.main-bg {
  background-color: #212121;
}
.display {
  display: grid;
  grid-template-rows: 250px calc(100vh - 250px);
}
.logo-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: solid #e3b800;
  border-width: 5px 0 0 0;
}
.logo-title {
  margin-top: 20px;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: 600;
}
.logo-title > p {
  margin-bottom: 0;
  color: #ffffff;
}
.sidebar-list-div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.list-div {
  display: block;
}
.signout-div {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  justify-content: center;
  align-items: center;
  vertical-align: text-bottom;
  height: 50px;
  color: #f9f9f9c2;
  border: 1px solid transparent;
  font-weight: bold;
  border: solid #ffffff47;
  border-width: 1px 0 0 0;
  margin: 0 20px;
  cursor: pointer;
}
.signout-btn-icon {
  font-size: 20px;
  margin: 0px;
  margin-right: 10px;
  text-align: center;
}
</style>
