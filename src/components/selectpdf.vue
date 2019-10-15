<template>
  <div>
    <button @click="isOpenStorage = true">คลัง</button>
    <div v-if="isOpenStorage">
      <div>
        <input v-model="search" placeholder="id or name" @keypress.enter="getPdf(1)"/>
      </div>
      <div v-for="(pdf, i) in pdfList" :key="'pdf_' + i">
        <span :class="selectedIndex === i ? 'redText' : ''">{{ pdf.filename }} ({{ pdf.date }})</span>
        <button @click="selectedIndex = i">Select</button>
      </div>
      <div>
        <button @click="getPdf(page.now - 1)" v-if="page.now > 1"><i class="fas fa-arrow-left"></i></button>
        <button @click="getPdf(page.now + 1)" v-if="page.now < page.all"><i class="fas fa-arrow-right"></i></button>
      </div>
      <div>
        <button @click="savePdf" :disabled="!(selectedIndex >= 0 && selectedIndex < pdfList.length)">Select</button>
        <button @click="clearClose">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios.js'

export default {
  name: 'select-pdf',
  props: ['pdfId', 'filename'],
  model: {
    prop: 'pdfId',
    event: 'selected'
  },
  data () {
    return {
      isOpenStorage: false,
      selectedIndex: null,
      search: '',
      pdfName: '',
      page: {
        now: 1,
        all: 0
      },
      limit: 3,
      pdfList: []
    }
  },
  methods: {
    getPdf (page = 1) {
      axios.get(`/admin/pdf?page=${page}&limit=${this.limit}${this.search ? `&q=${this.search}` : ''}`).then(response => {
        this.page = response.data.page
        this.pdfList = response.data.file.data
      }).catch(error => {
        if (error.response && error.response.data)
          console.error("get file list", error.response.data.error)
        else console.error("get file list", error.message)
      })
    },
    savePdf () {
      this.isOpenStorage = false
      const pdf = this.pdfList[this.selectedIndex]
      this.$emit('update:filename', pdf.filename)
      this.$emit('selected', pdf.id)
      this.selectedIndex = null
      this.search = ''
      this.pdfList = []
    },
    clearClose () {
      this.isOpenStorage = false
      this.selectedIndex = null
      this.search = ''
      this.pdfName = ''
      this.page = {
        now: 1,
        all: 0
      }
      this.pdfList = []
    }
  }
}
</script>

<style scoped>
.redText {
  color: red;
}
</style>