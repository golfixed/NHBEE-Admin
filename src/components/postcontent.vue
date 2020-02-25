<template>
  <div style="margin-top: 10px;">
    <div class="thai-post-box">
      <h4 v-if="lang == 'th'">หัวข้อบทความ</h4>
      <h4 v-if="lang == 'en'">Title</h4>
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
    <h4 v-if="lang == 'th'">เนื้อหา</h4>
    <h4 v-if="lang == 'en'">Content</h4>
    <div class="content-block">
      <div class="content-card" v-for="(obj, i) in content.article" :key="'article_' + i">
        <div>
          <select
            v-model="obj.type"
            @change="obj.data = null; obj.url = (obj.type === 'picture' ? null : undefined);"
          >
            <option value="text">ข้อความ</option>
            <option value="picture">รูปภาพ</option>
          </select>
        </div>
        <div>
          <div v-if="obj.type === 'text'">
            <textarea class="content-textarea" v-model="obj.data"></textarea>
          </div>
          <div v-else-if="obj.type === 'picture'">
            <img v-if="obj.data" :src="obj.url" :alt="obj.data" height="50px" />
            <p v-else>เลือกรูปภาพ</p>
            <select-picture v-model="obj.data" :url.sync="obj.url" />
          </div>
          <div v-else>Select Type</div>
        </div>
        <div class="card-controller">
          <button class="btn-content btn-content-mover" @click="upArticle(i)" v-if="i > 0">
            <i class="fas fa-arrow-up"></i>
          </button>
          <button class="btn-content btn-content-trash" @click="deleteAricle(i)">
            <i class="fas fa-trash"></i>
          </button>
          <button
            class="btn-content btn-content-mover"
            @click="downArticle(i)"
            v-if="i < (content.article.length - 1)"
          >
            <i class="fas fa-arrow-down"></i>
          </button>
        </div>
      </div>
      <div class="new-section-box">
        <button class="btn-content btn-content-newsec" @click="newArticle">
          <span>เพิ่มส่วนใหม่</span>
          <i class="fas fa-plus"></i>
        </button>
      </div>
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
.content-textarea {
  max-width: 420px;
  width: 420px;
  height: 100px;
}
.card-controller {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.content-card {
  border: solid;
  border-width: 0 0 1px 0;
  border-color: #e2e2e2;
  position: relative;
  margin: 5px 0;
  padding: 5px 0;
  display: grid;
  grid-template-columns: 100px auto 50px;
}
.content-block {
  padding: 10px;
  margin-top: 5px;
  background-color: #f1f1f1;
  margin-bottom: 20px;
}
.new-section-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.content-section {
  border: 1px solid #f1f1f1;
  margin-top: 0;
}
.btn-content > span {
  margin-right: 10px;
  user-select: none;
}
.btn-content {
  background: #f1f1f1;
  border: 0;
  border-radius: 5px;
  width: fit-content;
  height: 25px;
  padding: 0 20px;
  cursor: pointer;
}
.btn-content-mover:hover {
  background-color: #e2e2e2;
}
.btn-content-trash:hover {
  background-color: rgb(255, 116, 116);
  color: #fff;
}
.btn-content-newsec:hover {
  background: #e2e2e2;
}
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