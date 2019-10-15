<template>
  <div>
    <div>
      <input v-model="content.title" placeholder="Title"/>
    </div>
    <div>
      <textarea v-model="content.description" placeholder="description"></textarea>
    </div>
    <div v-for="(obj, i) in content.article" :key="'article_' + i">
      <hr>
      <div>
        <select v-model="obj.type" @change="obj.data = null; obj.url = (obj.type === 'picture' ? null : undefined);">
          <option value="text">Text</option>
          <option value="picture">Picure</option>
        </select>
      </div>
      <div v-if="obj.type === 'text'">
        <textarea v-model="obj.data"></textarea>
      </div>
      <div v-else-if="obj.type === 'picture'">
        <img v-if="obj.data" :src="obj.url" :alt="obj.data" height="50px">
        <p v-else>เลือกรูปภาพ</p>
        <select-picture v-model="obj.data" :url.sync="obj.url"/>
      </div>
      <div v-else>
        Select Type
      </div>
      <div>
        <button @click="upArticle(i)" v-if="i > 0"><i class="fas fa-arrow-up"></i></button>
        <button @click="deleteAricle(i)"><i class="fas fa-trash"></i></button>
        <button @click="downArticle(i)" v-if="i < (content.article.length - 1)"><i class="fas fa-arrow-down"></i></button>
      </div>
    </div>
    <hr>
    <div>
      <button @click="newArticle"><i class="fas fa-plus"></i></button>
    </div>
  </div>
</template>

<script>
import selectpicture from '@/components/selectpicture.vue'

export default {
  name: 'post-content',
  components: {
    'select-picture': selectpicture
  },
  props: ['content'],
  model: {
    prop: 'content',
    event: 'updated'
  },
  watch: {
    content: {
      handler: function (val) {
        this.$emit('updated', val)
      },
      deep: true
    }
  },
  methods: {
    newArticle () {
      this.content.article.push({
        type: 'text',
        data: null
      })
    },
    deleteAricle (index) {
      this.content.article.splice(index, 1)
    },
    upArticle (index) {
      if (index > 0) {
        const thisArticle = this.content.article.splice(index, 1)
        this.content.article.splice(index - 1, 0, thisArticle[0])
      }
    },
    downArticle (index) {
      if (index < (this.content.article.length - 1)) {
        const thisArticle = this.content.article.splice(index, 1)
        this.content.article.splice(index + 1, 0, thisArticle[0])
      }
    }
  }
}
</script>

<style>

</style>