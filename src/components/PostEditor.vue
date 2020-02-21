<template>
  <div class="popup-window">
    <div class="control-tab">
      <h3 class="window-headtext">
        {{ saveId ? 'แก้ไขบทความ' : 'บทความใหม่' }}
        <i class="fas fa-edit popup-btn-icon"></i>
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
      <input v-model="author" placeholder="author" />
      <br />
      <img v-if="pictureId" :src="pictureURL" :alt="pictureId" height="50px" />
      <p v-else>เลือกรูปภาพปก</p>
      <select-picture v-model="pictureId" :url.sync="pictureURL" />
      <input type="date" v-model="publishDate" placeholder="Publish Date" />
      <button @click="savePost" :disabled="isLoading">Save</button>
    </div>
    <hr class="section-hr" style="margin-top: 20px;" />
    <div class="popup-btn-panel">
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
.popup-window {
  padding: 30px;
  width: 600px;
  max-height: 80vh;
  overflow-y: scroll;
}
.section-hr {
  border: 1px solid #ececec;
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
.thai-post-box > input::placeholder,
.thai-post-box > input::-webkit-input-placeholder {
  padding-left: 10px;
}
.control-tab {
  display: block;
}

.window-headtext {
  font-size: 25px;
  padding-bottom: 15px;
  margin: 0;
}
.tab-headtext {
  margin: 20px 0;
}
.tab-panel {
  width: 100%;
  border: 1px solid grey;
  border-width: 0 0 1px 0;
  margin-bottom: 20px;
}
.tab-item-active {
  border-width: 0 0 3px 0;
  border-color: grey;
  font-weight: bold;
}
.tab-item-inactive {
  border-width: 0;
}
.tab-item-inactive,
.tab-item-active {
  width: fit-content;
  background-color: transparent;
  height: 30px;
  border-radius: 0;
  font-size: 15px;
  outline: none;
  padding: 0 40px;
}
.popup-button {
  width: fit-content;
  height: 30px;
  background-color: #ececec;
  font-size: 15px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  transition: all 0.1s;
  margin-right: 10px;
  user-select: none;
}
.popup-button:hover {
  background-color: rgb(220, 220, 220);
  transition: all 0.1s;
  cursor: pointer;
  color: #fff;
}
.popup-btn-panel {
  display: grid;
  grid-template-columns: repeat(2, 50%);
  margin-top: 20px;
}
.left-group {
  display: flex;
  justify-content: flex-start;
}
.right-group {
  display: flex;
  justify-content: flex-end;
}
.right-group > div.popup-button:last-child {
  margin-right: 0;
}

.left-group,
.right-group {
  display: flex;
  position: relative;
}

.popup-button-cancel:hover {
  background-color: rgb(163, 163, 163);
}
.popup-button-clear:hover {
  background-color: rgb(255, 111, 111);
}
.popup-button-submit:hover {
  background-color: rgb(55, 199, 120);
}
.popup-btn-icon {
  margin-left: 10px;
}
</style>