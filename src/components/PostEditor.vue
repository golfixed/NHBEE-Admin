<template>
  <div style="padding: 20px;">
    <div class="control-tab">
      <h3 class="window-headtext">{{ saveId ? 'แก้ไขบทความ' : 'บทความใหม่' }}</h3>
      <i @click="newPostClose();" class="fas fa-times close-btn"></i>
    </div>
    <div class="tab-panel">
      <button class="tab-item-active" v-if="current_tab === 'th'" @click="switchTab('th')">ภาษาไทย</button>
      <button class="tab-item-inactive" v-if="current_tab != 'th'" @click="switchTab('th')">ภาษาไทย</button>
      <button class="tab-item-active" v-if="current_tab === 'en'" @click="switchTab('en')">English</button>
      <button class="tab-item-inactive" v-if="current_tab != 'en'" @click="switchTab('en')">English</button>
    </div>
    <h1>{{current_tab}}</h1>
    <div v-if="current_tab === 'th'" class="thai-post-box">
      <post-content v-model="th"/>
    </div>
    <div v-if="current_tab === 'en'" class="thai-post-box">
      <post-content v-model="en"/>
    </div>
    <div>
      <input v-model="author" placeholder="author"/>
      <br>
      <img v-if="pictureId" :src="pictureURL" :alt="pictureId" height="50px">
      <p v-else>เลือกรูปภาพปก</p>
      <select-picture v-model="pictureId" :url.sync="pictureURL"/>
      <input type="date" v-model="publishDate" placeholder="Publish Date"/>
      <button @click="savePost" :disabled="isLoadinig">Save</button>
    </div>
  </div>
</template>
<script>
import axios from '@/axios.js'
import postcontent from '@/components/postcontent.vue'
import selectpicture from '@/components/selectpicture.vue'

export default {
  name: "post-editor",
  components: {
    'post-content': postcontent,
    'select-picture': selectpicture
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
      isLoadinig: false
    };
  },
  props: {
    newPostClose: Function,
    newsId: Number
  },
  created () {
    this.getPost(this.newsId)
  },
  watch: {
    newsId (value) {
      this.getPost(value)
    }
  },
  methods: {
    switchTab: function(target) {
      this.current_tab = target;
    },
    clearPost () {
      this.th = {
        title: "",
        description: "",
        article: []
      }
      this.en = {
        title: "",
        description: "",
        article: []
      }
      this.author = ""
      this.pictureId = null
      this.pictureURL = ""
      this.publishDate = ""
      this.saveId = null
    },
    getPost (newsId) {
      if (!newsId) return this.clearPost()
      axios.get(`/admin/news/${this.newsId}`).then(response => {
        const data = response.data
        this.th = data.th
        this.en = data.en
        this.author = data.author
        this.pictureId = data.pictureId
        this.pictureURL = data.pictureURL
        this.publishDate = data.publishDate
        this.saveId = data.id
      }).catch(error => {
        if (error.response && error.response.data)
          console.error("get news", error.response.data.error)
        else console.error("get news", error.message)
        this.clearPost()
      })
    },
    savePost () {
      if (this.isLoadinig) return ''
      this.isLoadinig = true
      const sendData = {
        th: this.th,
        en: this.en,
        author: this.author,
        pictureId: this.pictureId,
        publishDate: this.publishDate
      }
      const article_th = []
      const article_en = []
      for (const i in sendData.th.article) {
        const article = sendData.th.article[i]
        article_th.push({
          type: article.type,
          data: article.data
        })
      }
      for (const i in sendData.en.article) {
        const article = sendData.en.article[i]
        article_en.push({
          type: article.type,
          data: article.data
        })
      }
      sendData.th.article = article_th
      sendData.en.article = article_en

      axios({
        url: `/admin/news${this.saveId ? '/' + this.saveId : ''}`,
        method: this.saveId ? 'put' : 'post',
        data: sendData
      }).then(response => {
        this.clearPost()
        this.newPostClose()
        // alert('News ID: ' + response.data.id)
      }).catch(error => {
        if (error.response && error.response.data)
          console.error("save news", error.response.data.error)
        else console.error("save news", error.message)
      }).finally(() => {
        this.isLoadinig = false
      })
    }
  }
};
</script>
<style scoped>
.control-tab {
  display: flex;
  position: relative;
}
.close-btn {
  position: absolute;
  right: 0;
  top: 0;
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
</style>