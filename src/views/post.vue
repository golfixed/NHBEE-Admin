<template>
  <div class="isdesktop">
    <div class="box">
      <div class="searchbox-div">
        <p class="section-title">ค้นหาโพสต์</p>
        <div class="form-set">
          <p class="form-set-label">ค้นหาด้วยชื่อ</p>
          <input v-model="search" class="form-set-input" type="text" @keypress.enter="getNews" />
        </div>
        <div class="form-set">
          <p class="form-set-label">ประเภท</p>
          <input class="form-set-input" type="type" />
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
  </div>
</template>

<script>
import axios from "@/axios.js";
import layout_default from "@/layouts/main.vue";
export default {
  name: "post",
  data() {
    return {
      dataList: [],
      newsData: null,
      isLoading: false,
      search: "",
      page: 1,
      limit: 6
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
    }
  }
};
</script>

<style>
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
</style>
