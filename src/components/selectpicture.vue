<template>
  <div>
    <button @click="isOpenStorage = true">คลัง</button>
    <div v-if="isOpenStorage">
      <div>
        <input v-model="search" placeholder="id or name" @keypress.enter="getPicture(1)"/>
      </div>
      <div v-for="(picture, i) in pictureList" :key="'picture_' + i">
        <img :src="picture.pictureURL" :alt="picture.filename" height="50px"/>
        <span :class="selectedIndex === i ? 'redText' : ''">{{ picture.filename }}</span>
        <button @click="selectedIndex = i">Select</button>
      </div>
      <div>
        <button @click="getPicture(page.now - 1)" v-if="page.now > 1"><i class="fas fa-arrow-left"></i></button>
        <button @click="getPicture(page.now + 1)" v-if="page.now < page.all"><i class="fas fa-arrow-right"></i></button>
      </div>
      <div>
        <button @click="savePicture" :disabled="!(selectedIndex >= 0 && selectedIndex < pictureList.length)">Save</button>
        <button @click="clearClose">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios.js'

export default {
  name: 'select-picture',
  props: ['pictureId', 'url'],
  model: {
    prop: 'pictureId',
    event: 'selected'
  },
  data () {
    return {
      isOpenStorage: false,
      selectedIndex: null,
      search: '',
      pictureName: '',
      pictureURL: '',
      page: {
        now: 1,
        all: 0
      },
      limit: 3,
      pictureList: []
    }
  },
  methods: {
    getPicture (page = 1) {
      axios.get(`/admin/picture?page=${page}&limit=${this.limit}${this.search ? `&q=${this.search}` : ''}`).then(response => {
        this.page = response.data.page
        this.pictureList = response.data.file.data
      }).catch(error => {
        if (error.response && error.response.data)
          console.error("get file list", error.response.data.error)
        else console.error("get file list", error.message)
      })
    },
    savePicture () {
      this.isOpenStorage = false
      const picture = this.pictureList[this.selectedIndex]
      this.$emit('update:url', picture.pictureURL)
      this.$emit('selected', picture.id)
      this.selectedIndex = null
      this.search = ''
      this.pictureList = []
    },
    clearClose () {
      this.isOpenStorage = false
      this.selectedIndex = null
      this.search = ''
      this.pictureName = ''
      this.pictureURL = ''
      this.page = {
        now: 1,
        all: 0
      }
      this.pictureList = []
    }
  }
}
</script>

<style scoped>
.redText {
  color: red;
}
</style>