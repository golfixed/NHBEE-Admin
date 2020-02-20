<template>
  <div class="isdesktop">
    <div
      style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px;"
    >
      <h1 class="tab-headtext">ผลแบบสอบถาม</h1>
    </div>
    <div class="tab-panel">
      <button
        class="tab-item-active"
        v-if="current_tab === 'full'"
        @click="switchTab('full')"
      >แบบเต็ม</button>
      <button
        class="tab-item-inactive"
        v-if="current_tab != 'full'"
        @click="switchTab('full')"
      >แบบเต็ม</button>
      <button
        class="tab-item-active"
        v-if="current_tab === 'mini'"
        @click="switchTab('mini')"
      >แบบย่อ</button>
      <button
        class="tab-item-inactive"
        v-if="current_tab != 'mini'"
        @click="switchTab('mini')"
      >แบบย่อ</button>
    </div>
    <div class="tab-view">
      <div v-if="current_tab === 'full'">
        <div class="no-survey-div" v-if="haveResult == false">
          <h3>ยังไม่มีผลตอบรับจากแบบสอบถาม</h3>
        </div>
        <div v-if="haveResult == true">
          <div class="doc-show-area">
            <div class="doc-table-header">
              <h5 class="doc-table-filename">ชื่อ</h5>
              <h5 class="doc-table-farmname">ชื่อฟาร์ม</h5>
              <h5 class="doc-table-date">ส่งวันที่</h5>
            </div>
            <div class="doc-item" v-for="(data, i) in surveyFull" :key="i">
              <i class="far fa-file-excel doc-item-icon"></i>
              <h5 class="doc-item-filename">{{data.name}}</h5>
              <h5 class="doc-item-farmname">{{data.farmname}}</h5>
              <h5 class="doc-item-date">{{data.timestamp}}</h5>
              <button class="doc-delete-btn" @click="deletePdf(i)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <div class="survey-pagination" style="margin-top: 20px;">
              <button
                class="pagination-btn prev-btn"
                v-if="this.page.now != 1"
                @click="prevPage('pdf', page.now);"
              >
                <i class="fas fa-arrow-left"></i>
              </button>
              <div class="pagination-current">{{page.now}} จาก {{page.all}} หน้า</div>
              <button
                class="pagination-btn next-btn"
                v-if="this.page.now != this.page.all"
                @click="nextPage('pdf', page.now);"
              >
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="current_tab === 'mini'">
        <div class="no-survey-div" v-if="haveResult == false">
          <h3>ยังไม่มีผลตอบรับจากแบบสอบถาม</h3>
        </div>
        <div v-if="haveResult == true">
          <div class="doc-show-area">
            <div class="doc-table-header">
              <h5 class="doc-table-filename">ชื่อ</h5>
              <h5 class="doc-table-farmname">ประเทศ</h5>
              <h5 class="doc-table-date">ส่งวันที่</h5>
            </div>
            <div class="doc-item" v-for="(data, i) in surveyMini" :key="i">
              <i class="far fa-file-excel doc-item-icon"></i>
              <h5 class="doc-item-filename">{{data.name}}</h5>
              <h5 class="doc-item-farmname">{{data.country}}</h5>
              <h5 class="doc-item-date">{{data.timestamp}}</h5>
              <button class="doc-delete-btn" @click="deletePdf(i)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <div class="survey-pagination" style="margin-top: 20px;">
              <button
                class="pagination-btn prev-btn"
                v-if="this.page.now != 1"
                @click="prevPage('pdf', page.now);"
              >
                <i class="fas fa-arrow-left"></i>
              </button>
              <div class="pagination-current">{{page.now}} จาก {{page.all}} หน้า</div>
              <button
                class="pagination-btn next-btn"
                v-if="this.page.now != this.page.all"
                @click="nextPage('pdf', page.now);"
              >
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import layout_default from "@/layouts/main.vue";
import axios from "@/axios.js";
export default {
  name: "library",
  data() {
    return {
      current_tab: "full",
      page: {
        now: 1,
        all: 1
      },
      documentList: [],
      imageList: [],
      filename: "",
      file: null,
      isUploading: false,
      uploadIsOpen: false,
      limit: 10,
      surveyFull: [],
      surveyMini: [],
      haveResult: false
    };
  },
  created() {
    this.loadSurveyList(this.current_tab, 1);
    this.$emit(`update:layout`, layout_default);
  },
  methods: {
    refreshList: function() {
      this.loadSurveyList(this.current_tab);
    },
    nextPage: function(target, page) {
      if (this.page.now <= this.page.all) {
        this.page.now = this.page.now + 1;
        this.loadSurveyList(target, this.page.now);
      } else {
        this.page.now = this.page.now;
        this.loadSurveyList(target, this.page.now);
      }
    },
    prevPage: function(target, page) {
      if (this.page.now <= this.page.all && this.page.now != 0) {
        this.page.now = this.page.now - 1;
        this.loadSurveyList(target, this.page.now);
      } else {
        this.page.now = this.page.now;
        this.loadSurveyList(target, this.page.now);
      }
    },
    switchTab: function(target) {
      this.current_tab = target;
      this.loadSurveyList(target);
    },
    loadSurveyList(target, page) {
      if (target == "full") {
        axios("admin/survey/full?limit=" + this.limit + "&page=" + page)
          .then(response => {
            this.surveyFull = response.data.survey.data;
            this.haveResult = true;
          })
          .catch(error => {
            if (error.response && error.response.data)
              console.error("get survey list", error.response.data.error);
            else console.error("get survey list", error.message);
          });
      } else if (target == "mini") {
        axios("admin/survey/mini?limit=" + this.limit + "&page=" + page)
          .then(response => {
            this.surveyMini = response.data.survey.data;
            this.haveResult = true;
          })
          .catch(error => {
            if (error.response && error.response.data)
              console.error("get survey list", error.response.data.error);
            else console.error("get survey list", error.message);
          });
      }
    },
    fileChange(e) {
      const file = e.target.files[0];
      this.filename = file.name;
      this.file = file;
    }
  }
};
</script>

<style scoped>
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
.survey-pagination {
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
.tab-panel {
  width: 100%;
}
.tab-item-active {
  background-color: #fff !important;
  font-weight: bold;
  border: 0;
  border-width: 3px 0 0 0;
}
.tab-item-inactive {
  border-width: 0;
}
.tab-item-inactive,
.tab-item-active {
  width: fit-content;
  background-color: transparent;
  height: 40px;
  border-radius: 0;
  font-size: 15px;
  outline: none;
  padding: 0 40px;
}
.doc-table-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-items: center;
  color: grey;
  padding: 10px 20px;
  padding-top: 0;
}
.doc-table-filename {
  width: 40%;
}
.doc-table-farmname {
  width: 34%;
}
.doc-table-date {
  margin-left: 30px;
}
.image-show-area {
  background-color: #fff;
  border: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, 100px);
  grid-gap: 20px;
  padding: 20px;
}
.image-item {
  position: relative;
  transition: all 0.1s;
  height: 100px;
  overflow: hidden;
}
.image-item:hover {
  transform: scale(1.1);
  transition: all 0.1s;
  cursor: pointer;
  -webkit-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  -moz-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
}
.image-item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
}
.image-item-filename {
  position: absolute;
  bottom: 0;
  background-color: #ffffffbd;
  width: 100%;
  padding: 5px 0 5px 10px;
}
.image-delete-btn {
  border-radius: 10000px;
  width: 35px;
  height: 35px;
  background-color: #fff;
  position: absolute;
  right: 0;
  bottom: 0;
  display: none;
  font-size: 16px;
  -webkit-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  -moz-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  border: 0;
}
.image-delete-btn:hover {
  color: red;
  outline: none;
}
.image-item:hover > .image-delete-btn {
  display: block;
  margin: 0 10px 10px 0;
}
.doc-show-area {
  background-color: #fff;
  border: 0;
  display: block;
  padding: 20px;
}
.doc-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: relative;
  align-items: center;
  font-size: 20px;
  padding: 5px 20px;
  transition: all 0.1s;
}
.doc-item:hover {
  transition: all 0.1s;
  cursor: pointer;
  -webkit-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  -moz-box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.22);
  border-radius: 5px;
}
.doc-item-icon {
  position: absolute;
  left: 0;
  margin-left: 20px;
}
.doc-item-filename {
  width: 37%;
  padding-left: 30px;
}
.doc-item-farmname {
  width: 37%;
}
.doc-item-date {
  width: fit-content;
}
.doc-delete-btn {
  position: absolute;
  right: 0;
  display: none;
  transition: all 0.1s;
  outline: none;
}
.doc-delete-btn:hover {
  color: red;
  transition: all 0.1s;
  transform: scale(1.1);
}
.doc-item:hover > .doc-delete-btn {
  display: block;
  margin-right: 20px;
  border: 0;
  font-size: 17px;
}
.lib-toolbar {
  display: block;
  padding: 0 20px 20px 20px;
  background-color: #fff;
  position: relative;
}
.lib-toolbar-button {
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  height: 30px;
  background-color: #eaeaea;
  border-radius: 0;
  border: 0;
  font-size: 15px;
  padding: 0 20px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
}
.lib-toolbar-button:hover {
  background-color: rgb(35, 124, 0);
  color: #fff;
  transition: all 0.1s;
  cursor: pointer;
}
.lib-toolbar-btn-icon {
  margin-left: 10px;
}
.upload-text {
  display: flex;
  align-items: center;
}
.upload-text > h5 {
  font-size: 20px;
}
.upload-panel {
  display: block;
  position: relative;
  border: 1px solid #f0f0f0;
  border-width: 0 0 1px 0;
  padding: 20px;
}
.upload-panel > div {
  display: flex;
  align-items: center;
  height: 40px;
}
.upload-panel > div > h5 {
  min-width: 100px;
}
.upload-name-file {
  height: 30px;
  width: 200px;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  border: 0;
  font-size: 15px;
  background-color: #eaeaea;
  padding-left: 10px;
  outline: none;
}
</style>
