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
        v-if="current_tab === 'image'"
        @click="switchTab('image')"
      >แบบเต็ม</button>
      <button
        class="tab-item-inactive"
        v-if="current_tab != 'image'"
        @click="switchTab('image')"
      >แบบเต็ม</button>
      <button class="tab-item-active" v-if="current_tab === 'pdf'" @click="switchTab('pdf')">แบบย่อ</button>
      <button class="tab-item-inactive" v-if="current_tab != 'pdf'" @click="switchTab('pdf')">แบบย่อ</button>
    </div>
    <div class="tab-view">
      <div v-if="current_tab === 'image'">
        <div>
          <div class="doc-show-area">
            <div class="doc-table-header">
              <h5 class="doc-table-filename">ชื่อ</h5>
              <h5 class="doc-table-farmname">ชื่อฟาร์ม</h5>
              <h5 class="doc-table-date">ส่งวันที่</h5>
            </div>
            <div class="doc-item" v-for="(data, i) in farmData" :key="i">
              <i class="far fa-file-excel doc-item-icon"></i>
              <h5 class="doc-item-filename">{{data.name}}</h5>
              <h5 class="doc-item-farmname">{{data.farmname}}</h5>
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
        <div class="doc-show-area">
          <div class="doc-table-header">
            <h5 class="doc-table-filename">ชื่อไฟล์</h5>
            <h5 class="doc-table-date">อัปโหลดวันที่</h5>
          </div>
          <div class="doc-item" v-for="(data, i) in documentList" :key="i">
            <i class="far fa-file-pdf doc-item-icon"></i>
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
        all: 1
      },
      documentList: [],
      imageList: [],
      filename: "",
      file: null,
      isUploading: false,
      uploadIsOpen: false,
      farmData: [
        {
          name: "นางวรรณภา ใจงาม",
          farmname: "บ้านผึ้งราชบุรี",
          date: "12-02-2019"
        },
        {
          name: "นายจงรัก ภักดี",
          farmname: "บ้านผึ้งราชบุรี สาขา 2",
          date: "13-02-2019"
        }
      ]
    };
  },
  created() {
    this.loadFileList(this.current_tab, 1);
    this.$emit(`update:layout`, layout_default);
  },
  methods: {
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
          });
      }
    },
    uploadFile(target) {
      if (this.isUploading) return "";
      if (target !== "pdf" && target !== "picture") return "";
      this.isUploading = true;
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
            alert("อัปโหลดรูปภาพสำเร็จ");
            this.loadFileList("image", 1);
          } else {
            this.documentList.push(response.data);
            this.$refs.pdf_input.value = "";
            alert("อัปโหลดไฟล์ PDF สำเร็จ");
            this.loadFileList("pdf", 1);
          }
        })
        .catch(error => {
          if (error.response && error.response.data) {
            console.error("upload file", error.response.data.error);
            if (error.response.data.error === "Picture already exists") {
              alert("เกิดข้อผิดพลาด: อัปโหลดรูปภาพซ้ำ");
            } else if (error.response.data.error === "No Picture") {
              alert("เกิดข้อผิดพลาด: ไม่มีรูปภาพ หรือ รูปแบบรูปภาพไม่รองรับ");
            } else if (error.response.data.error === "PDF already exists") {
              alert("เกิดข้อผิดพลาด: อัปโหลดไฟล์ PDF ซ้ำ");
            } else if (error.response.data.error === "No PDF") {
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
