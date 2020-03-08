<template>
  <div class="isdesktop">
    <div class="toolbar-panel-bg">
      <h1 class="page-headtext">ผลแบบสอบถาม</h1>
      <div class="post-toolbar">
        <div class="toolbar-button toolbar-button-white" @click="loadSurveyList();">
          <span>รีเฟรช</span>
          <i class="fas fa-sync toolbar-btn-icon"></i>
        </div>
      </div>
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
      <div v-if="current_tab == 'full'">
        <div class="no-result" v-if="surveyFull.length <= 0 && serverDown == false">
          <div class="no-inner-box">
            <div v-if="isLoading == true">
              <h3>กำลังโหลด</h3>
              <h4>โปรดรอสักครู่</h4>
            </div>
            <div v-if="isLoading == false">
              <h3>ยังไม่มีผลตอบรับแบบสอบถาม</h3>
            </div>
          </div>
        </div>
        <div class="no-result" v-if="serverDown == true">
          <div class="no-inner-box">
            <h3>พบปัญหาในการเชื่อมต่อกับ server</h3>
            <h4>โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</h4>
            <h4>หากยังพบปัญหาโปรดติดต่อเจ้าหน้าที่ดูแลระบบ</h4>
          </div>
        </div>
        <div v-if="surveyFull.length > 0">
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
                @click="prevPage('full', page.now);"
              >
                <i class="fas fa-arrow-left"></i>
              </button>
              <div class="pagination-current">{{page.now}} จาก {{page.all}} หน้า</div>
              <button
                class="pagination-btn next-btn"
                v-if="this.page.now != this.page.all"
                @click="nextPage('full', page.now);"
              >
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="current_tab == 'mini'">
        <div class="no-result" v-if="surveyMini.length <= 0 && serverDown == false">
          <div class="no-inner-box">
            <div v-if="isLoading == true">
              <h3>กำลังโหลด</h3>
              <h4>โปรดรอสักครู่</h4>
            </div>
            <div v-if="isLoading == false">
              <h3>ยังไม่มีผลตอบรับแบบสอบถาม</h3>
            </div>
          </div>
        </div>
        <div class="no-result" v-if="serverDown == true">
          <div class="no-inner-box">
            <h3>พบปัญหาในการเชื่อมต่อกับ server</h3>
            <h4>โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</h4>
            <h4>หากยังพบปัญหาโปรดติดต่อเจ้าหน้าที่ดูแลระบบ</h4>
          </div>
        </div>
        <div v-if="surveyMini.length > 0">
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
                @click="prevPage('mini', page.now);"
              >
                <i class="fas fa-arrow-left"></i>
              </button>
              <div class="pagination-current">{{page.now}} จาก {{page.all}} หน้า</div>
              <button
                class="pagination-btn next-btn"
                v-if="this.page.now != this.page.all"
                @click="nextPage('mini', page.now);"
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
  name: "Survey",
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
      isLoading: false,
      uploadIsOpen: false,
      limit: 5,
      surveyFull: [],
      surveyMini: [],
      serverDown: false
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
      this.isLoading = true;
      if (target == "full") {
        axios("admin/survey/full?limit=" + this.limit + "&page=" + page)
          .then(response => {
            if (response.status != 500 || response.status != 404) {
              this.surveyFull = response.data.survey.data;
              this.page.now = response.data.page.now;
              this.page.all = response.data.page.all;
            } else {
              this.surveyFull = this.surveyFull;
            }
          })
          .catch(error => {
            if (error.response && error.response.data) {
              console.error("get survey list", error.response.data.error);
              this.serverDown = true;
            } else {
              console.error("get survey list", error.message);
              this.serverDown = true;
            }
          })
          .finally(() => {
            this.isLoading = false;
          });
      } else if (target == "mini") {
        axios("admin/survey/mini?limit=" + this.limit + "&page=" + page)
          .then(response => {
            if (response.status != 500 || response.status != 404) {
              this.surveyMini = response.data.survey.data;
              this.page.now = response.data.page.now;
              this.page.all = response.data.page.all;
            } else {
              this.surveyMini = this.surveyMini;
            }
          })
          .catch(error => {
            if (error.response && error.response.data) {
              console.error("get survey list", error.response.data.error);
              this.serverDown = true;
            } else {
              console.error("get survey list", error.message);
              this.serverDown = true;
            }
          })
          .finally(() => {
            this.isLoading = false;
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
</style>
