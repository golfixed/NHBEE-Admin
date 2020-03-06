<template>
  <div class="inner-popup-window">
    <div class="control-tab">
      <h3 class="tab-title-popup">
        {{ saveId ? 'แก้ไขบทความ' : 'บทความใหม่' }}
        <i
          class="fas fa-edit popup-btn-icon"
          v-if="saveId"
        ></i>
        <i class="fas fa-plus popup-btn-icon" v-if="!saveId"></i>
      </h3>
    </div>
    <div class="tab-panel">
      <button class="tab-item-active" v-if="current_tab === 'th'" @click="switchTab('th')">ภาษาไทย</button>
      <button class="tab-item-inactive" v-if="current_tab != 'th'" @click="switchTab('th')">ภาษาไทย</button>
      <button class="tab-item-active" v-if="current_tab === 'en'" @click="switchTab('en')">English</button>
      <button class="tab-item-inactive" v-if="current_tab != 'en'" @click="switchTab('en')">English</button>
    </div>
    <div v-if="current_tab === 'th'" class="thai-post-box">
      <post-content lang="th" v-model="th" />
    </div>
    <div v-if="current_tab === 'en'" class="thai-post-box">
      <post-content lang="en" v-model="en" />
    </div>
    <div>
      <div class="thai-post-box">
        <h4>ผู้เขียน</h4>
        <input v-model="author" placeholder="ชื่อผู้เขียน" />
      </div>

      <div>
        <p v-if="pictureId">รูปภาพปกที่เลือก</p>
        <p v-else>เลือกรูปภาพปก</p>
        <div class="selected-img" v-if="pictureId">
          <img v-if="pictureId" :src="pictureURL" :alt="pictureId" />
          <i class="fas fa-edit" v-on:click="clearImgSelect();"></i>
        </div>
        <select-picture
          v-if="pictureId == null"
          v-model="pictureId"
          :url.sync="pictureURL"
          style="margin-bottom: 20px;"
        />
      </div>

      <div class="thai-post-box">
        <h4>วันที่</h4>
        <input type="date" v-model="publishDate" placeholder="Publish Date" />
      </div>
    </div>
    <hr class="section-hr" style="margin-top: 20px;" />
    <div class="popup-btn-panel-2col">
      <div class="left-group">
        <div
          class="popup-button popup-button-cancel"
          @click="newPostClose();"
          :disabled="isLoading"
        >
          <span>ยกเลิก</span>
          <i class="fas fa-times popup-btn-icon"></i>
        </div>
      </div>
      <div class="right-group">
        <div class="popup-button popup-button-clear" @click="clearPost();" :disabled="isLoading">
          <span>ล้างทั้งหมด</span>
          <i class="fas fa-eraser popup-btn-icon"></i>
        </div>
        <div class="popup-button popup-button-submit" @click="savePost();" :disabled="isLoading">
          <span>บันทึกข้อมูล</span>
          <i class="fas fa-save popup-btn-icon"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "@/axios.js";
import postcontent from "@/components/postcontent.vue";
import selectpicture from "@/components/selectpicture.vue";

export default {
  name: "post-editor",
  components: {
    "post-content": postcontent,
    "select-picture": selectpicture
  },
  data() {
    return {
      current_tab: "th",
      th: {
        title: "",
        description: "",
        article: []
      },
      en: {
        title: "",
        description: "",
        article: []
      },
      author: "",
      pictureId: null,
      pictureURL: "",
      publishDate: "",
      saveId: null,
      isLoading: false
    };
  },
  props: {
    newPostClose: Function,
    newsId: Number
  },
  created() {
    this.getPost(this.newsId);
  },
  watch: {
    newsId(value) {
      this.getPost(value);
    }
  },
  methods: {
    clearImgSelect() {
      this.pictureId = null;
    },
    switchTab: function(target) {
      this.current_tab = target;
    },
    clearPost() {
      this.th = {
        title: "",
        description: "",
        article: []
      };
      this.en = {
        title: "",
        description: "",
        article: []
      };
      this.author = "";
      this.pictureId = null;
      this.pictureURL = "";
      this.publishDate = "";
      this.saveId = null;
    },
    getPost(newsId) {
      if (!newsId) return this.clearPost();
      axios
        .get(`/admin/news/${this.newsId}`)
        .then(response => {
          const data = response.data;
          this.th = data.th;
          this.en = data.en;
          this.author = data.author;
          this.pictureId = data.pictureId;
          this.pictureURL = data.pictureURL;
          this.publishDate = data.publishDate;
          this.saveId = data.id;
        })
        .catch(error => {
          if (error.response && error.response.data)
            console.error("get news", error.response.data.error);
          else console.error("get news", error.message);
          this.clearPost();
        });
    },
    savePost() {
      if (this.isLoading) return "";
      this.isLoading = true;
      const sendData = {
        th: this.th,
        en: this.en,
        author: this.author,
        pictureId: this.pictureId,
        publishDate: this.publishDate
      };
      const article_th = [];
      const article_en = [];
      for (const i in sendData.th.article) {
        const article = sendData.th.article[i];
        article_th.push({
          type: article.type,
          data: article.data
        });
      }
      for (const i in sendData.en.article) {
        const article = sendData.en.article[i];
        article_en.push({
          type: article.type,
          data: article.data
        });
      }
      sendData.th.article = article_th;
      sendData.en.article = article_en;

      axios({
        url: `/admin/news${this.saveId ? "/" + this.saveId : ""}`,
        method: this.saveId ? "put" : "post",
        data: sendData
      })
        .then(response => {
          this.clearPost();
          this.newPostClose();
          // alert('News ID: ' + response.data.id)
        })
        .catch(error => {
          if (error.response && error.response.data)
            console.error("save news", error.response.data.error);
          else console.error("save news", error.message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>
<style scoped>
.inner-popup-window {
  padding: 30px;
  width: 600px;
  max-height: 80vh;
  overflow-y: scroll;
}
.thai-post-box > input {
  background-color: #f1f1f1;
  border: 0;
  width: calc(100% - 10px);
  height: 30px;
  font-size: 14px;
  margin: 5px 0 20px 0;
  padding-left: 10px;
}
.control-tab {
  display: block;
}

.selected-img {
  background-color: #f1f1f1;
  position: relative;
  padding: 10px;
  margin: 5px 0 20px;
  display: flex;
  align-items: center;
}
.selected-img > img {
  width: 200px;
}
.selected-img > i {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
}

.tab-headtext {
  margin: 20px 0;
}
.tab-item-active {
  background-color: #fff !important;
  font-weight: bold;
  border: 1px solid rgb(100, 100, 100) !important;
}
.tab-item-active:hover {
  transition: all 0.1s;
}
.tab-item-inactive {
  border: 1px solid #fff !important;
}
.tab-item-inactive:hover {
  border: 1px solid rgb(100, 100, 100);
  transition: all 0.1s;
}
</style>