<template>
  <div class="isdesktop">
    <div
      style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px;"
    >
      <h1 class="tab-headtext">คลังรูปภาพ และ เอกสารPDF</h1>
      <div class="top-toolbar">
        <div class="toolbar-button" @click="loadSurveyList();">
          <span>รีเฟรชข้อมูล</span>
          <i class="fas fa-sync toolbar-btn-icon"></i>
        </div>
        <!-- <div class="toolbar-button" @click="loadSurveyList();" v-if="current_tab == 'image'">
          <span>อัปโหลดรูปภาพใหม่</span>
          <i class="fas fa-arrow-up toolbar-btn-icon"></i>
        </div>
        <div class="toolbar-button" @click="loadSurveyList();" v-if="current_tab == 'pdf'">
          <span>อัปโหลดเอกสาร PDF ใหม่</span>
          <i class="fas fa-arrow-up toolbar-btn-icon"></i>
        </div>-->
      </div>
    </div>
    <div class="tab-panel">
      <button
        class="tab-item-active"
        v-if="current_tab === 'image'"
        @click="switchTab('image')"
      >รูปภาพ</button>
      <button
        class="tab-item-inactive"
        v-if="current_tab != 'image'"
        @click="switchTab('image')"
      >รูปภาพ</button>
      <button
        class="tab-item-active"
        v-if="current_tab === 'pdf'"
        @click="switchTab('pdf')"
      >เอกสาร PDF</button>
      <button
        class="tab-item-inactive"
        v-if="current_tab != 'pdf'"
        @click="switchTab('pdf')"
      >เอกสาร PDF</button>
    </div>
    <div class="tab-view">
      <div v-if="current_tab === 'image'">
        <div>
          <div
            class="upload-text"
            style="padding-top:20px;background-color: #fff;padding-left: 20px;"
          >
            <i class="fas fa-arrow-up" style="margin-right: 10px;"></i>
            <h5>อัปโหลดรูปภาพใหม่</h5>
          </div>
          <div class="lib-toolbar">
            <div class="upload-panel">
              <div>
                <h5>1. เลือกไฟล์</h5>
                <input
                  ref="picture_input"
                  type="file"
                  @change="fileChange"
                  accept="image/jpeg, image/png"
                  :disabled="isUploading"
                />
              </div>
              <div>
                <h5>2. ตั้งชื่อไฟล์</h5>
                <input
                  class="upload-name-file"
                  type="text"
                  v-model="filename"
                  :disabled="isUploading"
                />
              </div>
              <div>
                <h5>3. อัปโหลด</h5>
                <button
                  class="lib-toolbar-button"
                  :disabled="!file || isUploading"
                  @click="uploadFile('picture')"
                >
                  <span>อัปโหลด</span>
                  <i class="fas fa-arrow-up" style="margin-left: 10px;"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="upload-text" style="background-color: #fff;padding-left: 20px;">
            <i class="far fa-images" style="margin-right: 10px;"></i>
            <h5>รูปภาพในคลัง</h5>
          </div>
          <div class="no-result" v-if="imageList.length <= 0">
            <div class="inner-box">
              <div v-if="isLoading == true">
                <h3>กำลังโหลด</h3>
                <h4>โปรดรอสักครู่</h4>
              </div>
              <div v-if="isLoading == false">
                <h3>ยังไม่มีรูปภาพในระบบตอนนี้</h3>
                <h4>
                  <i class="fas fa-arrow-up toolbar-btn-icon" style="margin:0 5px 0 0;"></i>เริ่มต้นอัปโหลดรูปภาพใหม่ที่เครื่องมืออัปโหลดด้านบน
                </h4>
              </div>
            </div>
          </div>
          <div class="image-show-area" v-if="imageList.length > 0">
            <div class="image-item" v-for="(data, i) in imageList" :key="i">
              <img class="image-item-img" :src="data.pictureURL" />
              <h5 class="image-item-filename">{{data.filename}}</h5>
              <button class="image-delete-btn" @click="deleteImage(i)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <div class="image-pagination" v-if="imageList">
              <button
                class="pagination-btn prev-btn"
                v-if="this.page.now != 1"
                @click="prevPage('image', page.now);"
              >
                <i class="fas fa-arrow-left"></i>
              </button>
              <div class="pagination-current">{{page.now}} จาก {{page.all}} หน้า</div>
              <button
                class="pagination-btn next-btn"
                v-if="this.page.now != this.page.all"
                @click="nextPage('image', page.now);"
              >
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="current_tab === 'pdf'">
        <div
          class="upload-text"
          style="padding-top:20px;background-color: #fff;padding-left: 20px;"
        >
          <i class="fas fa-arrow-up" style="margin-right: 10px;"></i>
          <h5>อัปโหลดเอกสารใหม่</h5>
        </div>
        <div class="lib-toolbar">
          <div class="upload-panel">
            <div>
              <h5>1. เลือกไฟล์</h5>
              <input
                ref="pdf_input"
                type="file"
                @change="fileChange"
                accept="application/pdf"
                :disabled="isUploading"
              />
            </div>
            <div>
              <h5>2. ตั้งชื่อไฟล์</h5>
              <input
                class="upload-name-file"
                type="text"
                v-model="filename"
                :disabled="isUploading"
              />
            </div>
            <div>
              <h5>3. อัปโหลด</h5>
              <button
                class="lib-toolbar-button"
                :disabled="!file || isUploading"
                @click="uploadFile('pdf')"
              >
                <span>อัปโหลด</span>
                <i class="fas fa-arrow-up" style="margin-left: 10px;"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="upload-text" style="background-color: #fff;padding-left: 20px;">
          <i class="fas fa-file-pdf" style="margin-right: 10px;"></i>
          <h5>เอกสารในคลัง</h5>
        </div>
        <div class="no-result" v-if="documentList.length <= 0">
          <div class="inner-box">
            <div v-if="isLoading == true">
              <h3>กำลังโหลด</h3>
              <h4>โปรดรอสักครู่</h4>
            </div>
            <div v-if="isLoading == false">
              <h3>ยังไม่มีเอกสาร PDF ในระบบตอนนี้</h3>
              <h4>
                <i class="fas fa-arrow-up toolbar-btn-icon" style="margin:0 5px 0 0;"></i>เริ่มต้นอัปโหลดเอกสารใหม่ที่เครื่องมืออัปโหลดด้านบน
              </h4>
            </div>
          </div>
        </div>
        <div class="doc-show-area" v-if="documentList.length > 0">
          <div class="doc-table-header">
            <h5 class="doc-table-id">ID</h5>
            <h5 class="doc-table-filename">ชื่อไฟล์</h5>
            <h5 class="doc-table-date">อัปโหลดวันที่</h5>
          </div>
          <div class="doc-item" v-for="(data, i) in documentList" :key="i">
            <i class="far fa-file-pdf doc-item-icon"></i>
            <h5 class="doc-item-id">{{data.id}}</h5>
            <h5 class="doc-item-filename">{{data.filename}}</h5>
            <h5 class="doc-item-date">{{data.date}}</h5>
            <button class="doc-delete-btn" @click="deletePdf(i)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <div class="image-pagination" style="margin-top: 20px;">
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
    <div class="popup-window-mask" v-if="isPopup == true"></div>
    <div class="popup-window-container" v-if="isPopup == true">
      <div class="popup-window-box" v-if="isUploading == true">
        <div class="popup-display-area">
          <h3>กำลังอัปโหลด</h3>
        </div>
      </div>
      <div class="popup-window-box" v-if="isUploadComplete == true">
        <div class="popup-display-area">
          <h3 v-if="current_tab == 'image'">อัปโหลดรูปภาพสำเร็จ</h3>
          <h3 v-if="current_tab == 'pdf'">อัปโหลดไฟล์ PDF สำเร็จ</h3>
        </div>
        <div class="popup-button-area">
          <div class="popup-button" @click="dismissComplete();">
            <span>
              ตกลง
              <i class="fas fa-check"></i>
            </span>
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
      current_tab: "image",
      page: {
        now: 1,
        all: 0
      },
      documentList: [],
      imageList: [],
      filename: "",
      file: null,
      isUploading: false,
      uploadIsOpen: false,
      isLoading: false,
      isPopup: false,
      isUploadComplete: false
    };
  },
  created() {
    this.loadFileList(this.current_tab, 1);
    this.$emit(`update:layout`, layout_default);
  },
  methods: {
    dismissComplete() {
      this.isUploadComplete = false;
      this.isPopup = false;
    },
    refreshList: function() {
      this.loadFileList(this.current_tab);
    },
    nextPage: function(target, page) {
      if (this.page.now <= this.page.all) {
        this.page.now = this.page.now + 1;
        this.loadFileList(target, this.page.now);
      } else {
        this.page.now = this.page.now;
        this.loadFileList(target, this.page.now);
      }
    },
    prevPage: function(target, page) {
      if (this.page.now <= this.page.all && this.page.now != 0) {
        this.page.now = this.page.now - 1;
        this.loadFileList(target, this.page.now);
      } else {
        this.page.now = this.page.now;
        this.loadFileList(target, this.page.now);
      }
    },
    switchTab: function(target) {
      this.current_tab = target;
      this.loadFileList(target);
    },
    loadFileList(target, page) {
      this.isLoading = true;
      if (target === "pdf" || target === "image") {
        axios(
          `/admin/${
            target === "image" ? "picture" : "pdf"
          }?page=${page} &limit=10`
        )
          .then(response => {
            this.page = response.data.page;
            if (target === "pdf") this.documentList = response.data.file.data;
            else this.imageList = response.data.file.data;
          })
          .catch(error => {
            if (error.response && error.response.data)
              console.error("get file list", error.response.data.error);
            else console.error("get file list", error.message);
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    uploadFile(target) {
      if (this.isUploading) return "";
      if (target !== "pdf" && target !== "picture") return "";
      this.isUploading = true;
      this.isPopup = true;
      const formData = new FormData();
      formData.append(target, this.file);
      formData.append("name", this.filename);
      axios
        .post(`/admin/${target}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          console.log("file id", response.data.id);
          this.filename = "";
          this.file = null;
          if (target === "picture") {
            this.imageList.push(response.data);
            this.$refs.picture_input.value = "";
            this.loadFileList("image", 1);
            this.isUploadComplete = true;
            if (this.isUploadComplete == false) this.isPopup = false;
            else this.isPopup = true;
          } else {
            this.documentList.push(response.data);
            this.$refs.pdf_input.value = "";
            this.loadFileList("pdf", 1);
            this.isUploadComplete = true;
            if (this.isUploadComplete == false) this.isPopup = false;
            else this.isPopup = true;
          }
        })
        .catch(error => {
          if (error.response && error.response.data) {
            console.error("upload file", error.response.data.error);
            if (error.response.data.error === "Picture already exists") {
              this.isPopup = false;
              this.isUploadComplete = false;
              alert("เกิดข้อผิดพลาด: อัปโหลดรูปภาพซ้ำ");
            } else if (error.response.data.error === "No Picture") {
              this.isPopup = false;
              this.isUploadComplete = false;
              alert("เกิดข้อผิดพลาด: ไม่มีรูปภาพ หรือ รูปแบบรูปภาพไม่รองรับ");
            } else if (error.response.data.error === "PDF already exists") {
              this.isPopup = false;
              this.isUploadComplete = false;
              alert("เกิดข้อผิดพลาด: อัปโหลดไฟล์ PDF ซ้ำ");
            } else if (error.response.data.error === "No PDF") {
              this.isPopup = false;
              this.isUploadComplete = false;
              alert("เกิดข้อผิดพลาด: ไม่มีไฟล์ PDF หรือ รูปแบบไฟล์ไม่รองรับ");
            }
          } else console.error("upload file", error.message);
        })
        .finally(() => {
          this.isUploading = false;
        });
    },
    deleteImage(index) {
      const image = this.imageList[index];
      if (confirm(`ยืนยันว่าจะลบรูป ${image.filename}?`)) {
        axios
          .delete(`/admin/picture/${image.id}`)
          .then(response => {
            this.imageList.splice(index, 1);
            this.loadFileList("image", 1);
          })
          .catch(error => {
            if (error.response && error.response.data)
              console.error("delete image", error.response.data.error);
            else console.error("delete image", error.message);
          });
      }
    },
    deletePdf(index) {
      const pdf = this.documentList[index];
      if (confirm(`ยืนยันว่าจะลบเอกสาร ${pdf.filename}?`)) {
        axios
          .delete(`/admin/pdf/${pdf.id}`)
          .then(response => {
            this.documentList.splice(index, 1);
            this.loadFileList("pdf", 1);
          })
          .catch(error => {
            if (error.response && error.response.data)
              console.error("delete pdf", error.response.data.error);
            else console.error("delete pdf", error.message);
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
.popup-button-area {
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup-display-area {
  width: 100%;
  height: calc(100% - 30px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.popup-button {
  height: 30px;
  background-color: #f0f0f0;
  font-size: 15px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  transition: all 0.1s;
  user-select: none;
  cursor: pointer;
}
.popup-button:hover {
  background-color: #4ead4e;
  color: #fff;
}
.popup-window-mask {
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
.popup-window-box {
  width: 300px;
  height: 150px;
  padding: 30px;
  position: absolute;
  background-color: #fff;
  border-radius: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
  display: block;
  text-align: center;
  -webkit-box-shadow: 0px 0px 71px 0px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0px 71px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 71px 0px rgba(0, 0, 0, 0.3);
}
.top-toolbar {
  display: flex;
}
.no-result {
  color: #aaaaaa;
  background-color: #fff;
}
.no-result > div.inner-box {
  text-align: center;
  cursor: default;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
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
.image-pagination {
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
.doc-table-id {
  width: 60px;
}
.doc-table-filename {
  width: 50%;
  padding-left: 30px;
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
.doc-item-id {
  width: 30px;
  padding-left: 30px;
}
.doc-item-filename {
  width: 50%;
  padding-left: 30px;
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
.top-toolbar > div.toolbar-button:last-child {
  margin-right: 0;
}
.toolbar-button {
  width: fit-content;
  height: 30px;
  background-color: #fff;
  /* border-radius: 5px;
  border: 1px solid grey; */
  font-size: 15px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  transition: all 0.1s;
  margin-right: 10px;
}

.toolbar-button:hover {
  background-color: rgb(220, 220, 220);
  transition: all 0.1s;
  cursor: pointer;
}
.toolbar-btn-icon {
  margin-left: 10px;
}
</style>
