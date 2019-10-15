<template>
  <div style="padding: 20px;">
    <div class="control-tab">
      <h3 class="window-headtext">{{ saveId ? 'แก้ไขผลงานวิจัย' : 'ผลงานวิจัยใหม่' }}</h3>
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
      <input v-model="th.title" placeholder="Title"/>
    </div>
    <div v-if="current_tab === 'en'" class="thai-post-box">
      <input v-model="en.title" placeholder="Title"/>
    </div>
    <div>
      <p v-if="pdfId" v-text="pdfFilename"></p>
      <p v-else>เลือกไฟล์ PDF</p>
      <select-pdf v-model="pdfId" :filename.sync="pdfFilename"/>
      <button @click="savePost" :disabled="isLoadinig">Save</button>
    </div>
  </div>
</template>
<script>
import axios from '@/axios.js'
import selectpdf from '@/components/selectpdf.vue'

export default {
  name: "research-editor",
  components: {
    'select-pdf': selectpdf
  },
  data() {
    return {
      current_tab: "th",
      th: {
        title: ""
      },
      en: {
        title: ""
      },
      pdfId: null,
      pdfFilename: "",
      saveId: null,
      isLoadinig: false
    };
  },
  props: {
    newPostClose: Function,
    researchId: Number
  },
  created () {
    this.getPost(this.researchId)
  },
  watch: {
    researchId (value) {
      this.getPost(value)
    }
  },
  methods: {
    switchTab: function(target) {
      this.current_tab = target;
    },
    clearPost () {
      this.th = {
        title: ""
      }
      this.en = {
        title: ""
      }
      this.pdfId = null
      this.pdfFilename = ""
      this.saveId = null
    },
    getPost (researchId) {
      if (!researchId) return this.clearPost()
      axios.get(`/admin/research/${this.researchId}`).then(response => {
        const data = response.data
        this.th = data.th
        this.en = data.en
        this.pdfId = data.pdfId
        this.pdfFilename = data.pdfFilename
        this.saveId = data.id
      }).catch(error => {
        if (error.response && error.response.data)
          console.error("get research", error.response.data.error)
        else console.error("get research", error.message)
        this.clearPost()
      })
    },
    savePost () {
      if (this.isLoadinig) return ''
      this.isLoadinig = true
      const sendData = {
        th: this.th,
        en: this.en,
        pdfId: this.pdfId
      }

      axios({
        url: `/admin/research${this.saveId ? '/' + this.saveId : ''}`,
        method: this.saveId ? 'put' : 'post',
        data: sendData
      }).then(response => {
        this.clearPost()
        this.newPostClose()
        // alert('Research ID: ' + response.data.id)
      }).catch(error => {
        if (error.response && error.response.data)
          console.error("save research", error.response.data.error)
        else console.error("save research", error.message)
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