<template>
  <div class="isdesktop">
    <div
      style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px;"
    >
      <h1 class="tab-headtext">บทความ</h1>
      <div class="post-toolbar">
        <div class="toolbar-button" @click="newPost();">
          <span>บทความใหม่</span>
          <i class="fas fa-edit toolbar-btn-icon"></i>
        </div>
      </div>
    </div>
    <div class="post-view">
      <div class="searchbox-div">
        <div class="form-set">
          <p class="form-set-label">ค้นหาด้วยชื่อ</p>
          <input v-model="search" class="form-set-input" type="text" @keypress.enter="getNews" />
        </div>
      </div>
      <div>
        <table style="width: 100%;">
          <thead>
            <tr style="height: 30px;">
              <th width="15%" style="color:#808080;">วันที่</th>
              <th width="55%" style="color:#808080;">ชื่อ</th>
              <th width="6%" style="color:#808080;">แก้ไข</th>
              <th width="6%" style="color:#808080;">เผยแพร่</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(news, index) in dataList" :key="'news_' + news.id" class="news-list">
              <td>{{ news.date }}</td>
              <td>
                <div class="news-list-title">{{ news.title_th }} ({{ news.title_en }})</div>
              </td>
              <td style="justify-content:center;align-items:center;">
                <button @click="editPost(news.id)">
                  <i class="fas fa-edit" />
                </button>
              </td>
              <td>
                <button @click="publish(index, !news.status)">
                  <i :class="`fas fa-globe globe-${(news.status ? '' : 'un')}publish`" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="post-pagination" style="margin-top: 20px;">
          <button
            class="pagination-btn prev-btn"
            v-if="this.page.now != 1"
            @click="changePage('previous');"
          >
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="pagination-current">{{page.now}} จาก {{page.all}} หน้า</div>
          <button
            class="pagination-btn next-btn"
            v-if="this.page.now != this.page.all"
            @click="changePage('next');"
          >
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="newpost-window" v-if="isOpenNewPost === true">
      <post-editor :newPostClose="newPostClose" :news-id="newsId"/>
    </div>
  </div>
</template>

<script>
import axios from "@/axios.js";
import layout_default from "@/layouts/main.vue";
import PostEditor from "@/components/PostEditor.vue";

export default {
  name: "post",
  components: {
    PostEditor
  },
  data() {
    return {
      dataList: [],
      isLoading: false,
      search: "",
      limit: 10,
      isOpenNewPost: false,
      page: {
        now: 1,
        all: 1
      },
      newsId: null
    };
  },
  created() {
    this.getNews();
    this.$emit(`update:layout`, layout_default);
  },
  methods: {
    getNews(page = 1) {
      if (this.isLoading) return "";
      this.isLoading = true;
      axios(
        `/admin/news?limit=${this.limit}&page=${page}&q=${this.search}`
      )
        .then(response => {
          const data = response.data;
          this.dataList = data.news.data;
          this.page = data.page
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
    editPost(id) {
      this.newsId = id
      this.newPostOpen()
    },
    newPost() {
      this.newsId = null
      this.newPostOpen()
    },
    newPostOpen: function() {
      this.isOpenNewPost = true;
    },
    newPostClose: function() {
      this.isOpenNewPost = false;
    },
    changePage: function(direction) {
      if (direction === "previous") {
        if (this.page.now > 1 && this.page.now <= this.page.all) {
          this.getNews(this.page.now - 1);
        }
      } else if (direction === "next") {
        if (this.page.now < this.page.all) {
          this.getNews(this.page.now + 1);
        }
      } else {
        this.page.now = 1;
      }
    },
    publish: function (index = -1, status = false) {
      if (!this.dataList[index]) return ''
      const news = this.dataList[index]
      if (confirm(`ยืนยันการ ${status ? 'เผยแพร่' : 'ซ่อน'} บทความนี้?`)) {
        axios({
          method: 'patch',
          url: `/admin/news/${news.id}/${status ? '' : 'un'}publish`
        }).then(() => {
          const data = this.dataList[index]
          this.dataList[index] = null
          data.status = !!status
          this.dataList[index] = data
        }).catch(error => {
          if (error.response && error.response.data)
            console.error("patch news", error.response.data.error);
          else console.error("patch news", error.message);
        })
      }
    }
  }
};
</script>

<style>
.news-list-title {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-right: 10px;
}
.news-list {
  transition: all 0.1s;
  height: 40px;
}
.news-list:hover {
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
  cursor: pointer;
  -webkit-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  border-radius: 5px;
}
.prev-btn,
.next-btn {
  border: 0;
  background-color: #e8e8e8;
  border-radius: 0;
  outline: none;
  padding: 9px 15px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.1s;
}

.prev-btn:hover,
.next-btn:hover {
  transform: scale(1.1);
  transition: all 0.1s;
}
.prev-btn:focus,
.next-btn:focus {
  transform: scale(1);
  transition: all 0.1s;
}
.prev-btn {
  position: absolute;
  left: 0;
}
.next-btn {
  position: absolute;
  right: 0;
}
.post-pagination {
  grid-column: span 5;
  grid-row: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.pagination-current {
  padding: 0 20px;
}
.newpost-window {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  border-radius: 0;
  top: 0;
  left: 0;
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
  border-width: 0;
}
.form-set {
  display: flex;
  align-items: center;
  margin: 0 0 15px 0;
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
.post-toolbar {
  display: flex;
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
.globe-publish {
  color: green;
}
.globe-unpublish {
  color: grey;
}
</style>
