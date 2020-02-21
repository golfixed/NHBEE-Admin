<template>
  <div style="margin-top: 10px;">
    <div class="thai-post-box">
      <h4 v-if="lang == 'th'">หัวข้อบทความ</h4>
      <h4 v-if="lang == 'en'">News title</h4>
      <input
        v-if="lang == 'th'"
        v-model="content.title"
        placeholder="ตัวอย่าง: ผึ้งหลวงเป็นผึ้งของไทย"
      />

      <input
        v-if="lang == 'en'"
        v-model="content.title"
        placeholder="Example: How bumble bee can fly."
      />
      <h4 v-if="lang == 'th'">คำบรรยาย</h4>
      <h4 v-if="lang == 'en'">Description</h4>
      <textarea v-if="lang == 'th'" v-model="content.description" placeholder="คำบรรยาย"></textarea>
      <textarea v-if="lang == 'en'" v-model="content.description" placeholder="description"></textarea>
    </div>
    <div v-for="(obj, i) in content.article" :key="'article_' + i">
      <hr />
      <div>
        <select
          v-model="obj.type"
          @change="obj.data = null; obj.url = (obj.type === 'picture' ? null : undefined);"
        >
          <option value="text">Text</option>
          <option value="picture">Picure</option>
        </select>
      </div>
      <div v-if="obj.type === 'text'">
        <textarea v-model="obj.data"></textarea>
      </div>
      <div v-else-if="obj.type === 'picture'">
        <img v-if="obj.data" :src="obj.url" :alt="obj.data" height="50px" />
        <p v-else>เลือกรูปภาพ</p>
        <select-picture v-model="obj.data" :url.sync="obj.url" />
      </div>
      <div v-else>Select Type</div>
      <div>
        <button @click="upArticle(i)" v-if="i > 0">
          <i class="fas fa-arrow-up"></i>
        </button>
        <button @click="deleteAricle(i)">
          <i class="fas fa-trash"></i>
        </button>
        <button @click="downArticle(i)" v-if="i < (content.article.length - 1)">
          <i class="fas fa-arrow-down"></i>
        </button>
      </div>
    </div>
    <hr />
    <div>
      <button @click="newArticle">
        <i class="fas fa-plus"></i>
      </button>
    </div>
  </div>
</template>

<script>
import selectpicture from "@/components/selectpicture.vue";

export default {
  name: "post-content",
  components: {
    "select-picture": selectpicture
  },
  props: ["content", "lang"],
  model: {
    prop: "content",
    event: "updated"
  },
  watch: {
    content: {
      handler: function(val) {
        this.$emit("updated", val);
      },
      deep: true
    }
  },
  methods: {
    newArticle() {
      this.content.article.push({
        type: "text",
        data: null
      });
    },
    deleteAricle(index) {
      this.content.article.splice(index, 1);
    },
    upArticle(index) {
      if (index > 0) {
        const thisArticle = this.content.article.splice(index, 1);
        this.content.article.splice(index - 1, 0, thisArticle[0]);
      }
    },
    downArticle(index) {
      if (index < this.content.article.length - 1) {
        const thisArticle = this.content.article.splice(index, 1);
        this.content.article.splice(index + 1, 0, thisArticle[0]);
      }
    }
  }
};
</script>

<style scoped>
.thai-post-box > textarea {
  background-color: rgb(241, 241, 241);
  border: 0px;
  width: 100%;
  height: 100px;
  font-size: 14px;
  margin: 5px 0px 20px;
  padding: 10px;
  max-width: calc(100% - 20px);
}
.thai-post-box > textarea {
  padding-left: 10px;
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
.thai-post-box > textarea::placeholder,
.thai-post-box > textarea::-webkit-input-placeholder,
.thai-post-box > input::placeholder,
.thai-post-box > input::-webkit-input-placeholder {
  padding-left: 0px;
}
</style>