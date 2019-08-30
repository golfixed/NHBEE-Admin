<template>
  <div class="isdesktop">
    <h1 class="tab-headtext" style="margin-bottom: 20px;">โพสต์ - บทความ</h1>
    <div class="toolbar">
      <div class="toolbar-button" @click="newPostOpen();">
        <span>บทความใหม่</span>
        <i class="fas fa-edit toolbar-btn-icon"></i>
      </div>
    </div>
    <div class="post-view">
      <div class="searchbox-div">
        <p class="section-title">ค้นหาโพสต์</p>
        <div class="form-set">
          <p class="form-set-label">ค้นหาด้วยชื่อ</p>
          <input v-model="search" class="form-set-input" type="text" @keypress.enter="getNews" />
        </div>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th style="width:25%">วันที่</th>
              <th style="width:80%">ชื่อ</th>
              <th style="width:15%">แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="news in dataList" :key="'news_' + news.id">
              <td>{{ news.date }}</td>
              <td>{{ news.title_th }} ({{ news.title_en }})</td>
              <td>
                <button @click="editNews(news.id)">
                  <i class="fas fa-edit" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="newsData">{{ newsData }}</div>
    </div>
    <div class="newpost-box-bg" v-if="isOpenNewPost === true">
      <div class="newpost-window">
        <newpost :newPostClose="newPostClose" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios.js";
import layout_default from "@/layouts/main.vue";
import newpost from "@/components/newpost.vue";

export default {
  name: "post",
  components: {
    newpost
  },
  data() {
    return {
      dataList: [],
      newsData: null,
      isLoading: false,
      search: "",
      page: 1,
      limit: 6,
      isOpenNewPost: false
    };
  },
  created() {
    this.getNews();
    this.$emit(`update:layout`, layout_default);
  },
  methods: {
    getNews() {
      if (this.isLoading) return "";
      this.isLoading = true;
      axios(
        `/admin/news?limit=${this.limit}&page=${this.page}&q=${this.search}`
      )
        .then(response => {
          const data = response.data;
          this.dataList = data.news.data;
        })
        .catch(error => {
          if (error.response && error.response.data)
            console.error("get news", error.response.data.error);
          else console.error("get news", error.message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    editNews(id) {
      if (this.isLoading) return "";
      this.isLoading = true;
      axios(`/admin/news/${id}`)
        .then(response => {
          this.newsData = response.data;
        })
        .catch(error => {
          if (error.response && error.response.data)
            console.error("get news", error.response.data.error);
          else console.error("get news", error.message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    newPostOpen: function() {
      this.isOpenNewPost = true;
    },
    newPostClose: function() {
      this.isOpenNewPost = false;
    }
  }
};
</script>

<style>
.newpost-box-bg {
  position: absolute;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #00000075;
}
.newpost-window {
  position: absolute;
  width: 1000px;
  height: 630px;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
}
.post-view {
  background-color: #ffffff;
  border: solid grey;
  border-width: 1px;
  border-radius: 5px;
  padding: 20px;
}
.section-title {
  font-size: 20px;
}
.searchbox-div {
  border: solid #aaaaaa;
  border-width: 0 0 1px 0;
}
.form-set {
  display: flex;
  align-items: center;
  margin: 15px 0;
}
.form-set-label {
  width: 150px;
  color: rgb(41, 41, 41);
}
.form-set-input {
  width: 100%;
  min-height: 30px;
  border-radius: 5px;
  border: 1px solid #aaaaaa;
}
.toolbar {
  display: flex;
  margin-bottom: 20px;
}
.toolbar-button {
  width: fit-content;
  height: 30px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid grey;
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
