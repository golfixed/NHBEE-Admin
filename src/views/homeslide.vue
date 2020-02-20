<template>
  <div class="isdesktop">
    <div
      style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:20px;"
    >
      <h1 class="tab-headtext">Homeslide</h1>
      <div class="post-toolbar">
        <div class="toolbar-button" @click="loadFileList();">
          <span>รีเฟรชข้อมูล</span>
          <i class="fas fa-sync toolbar-btn-icon"></i>
        </div>
      </div>
    </div>
    <div class="tab-view">
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
              <h5>2. อัปโหลด</h5>
              <button
                class="lib-toolbar-button"
                :disabled="!file || isUploading"
                @click="uploadFile()"
              >
                <span>อัปโหลด</span>
                <i class="fas fa-arrow-up" style="margin-left: 10px;"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="upload-text" style="background-color: #fff;padding-left: 20px;">
          <i class="far fa-images" style="margin-right: 10px;"></i>
          <h5>รูปภาพในระบบตอนนี้</h5>
        </div>
        <div class="no-result" v-if="imageList.length <= 0">
          <div class="inner-box">
            <div>
              <h3>ยังไม่มีรูปภาพในระบบตอนนี้</h3>
              <h4>เริ่มต้นอัปโหลดรูปภาพใหม่ที่เครื่องมืออัปโหลดด้านบน</h4>
            </div>
          </div>
        </div>
        <div class="image-show-area" v-if="imageList.length > 0">
          <div class="image-item" v-for="(data, i) in imageList" :key="i">
            <img class="image-item-img" :src="data.url" />
            <h5 class="image-item-filename">{{data.id}}</h5>
            <button class="image-delete-btn" @click="deleteImage(i)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <div class="image-pagination">
            <button
              class="pagination-btn prev-btn"
              v-if="this.page.now > 1"
              @click="prevPage(page.now);"
            >
              <i class="fas fa-arrow-left"></i>
            </button>
            <div class="pagination-current">{{page.now}} จาก {{page.all}} หน้า</div>
            <button
              class="pagination-btn next-btn"
              v-if="this.page.now < this.page.all"
              @click="nextPage(page.now);"
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
  name: "homeslide",
  data() {
    return {
      page: {
        now: 1,
        all: 0
      },
      imageList: [],
      filename: "",
      file: null,
      isUploading: false,
      uploadIsOpen: false
    };
  },
  created() {
    this.loadFileList(1);
    this.$emit(`update:layout`, layout_default);
  },
  methods: {
    refreshList: function() {
      this.loadFileList();
    },
    nextPage: function(page) {
      if (this.page.now <= this.page.all) {
        this.page.now = this.page.now + 1;
        this.loadFileList(this.page.now);
      } else {
        this.page.now = this.page.now;
        this.loadFileList(this.page.now);
      }
    },
    prevPage: function(page) {
      if (this.page.now <= this.page.all && this.page.now != 0) {
        this.page.now = this.page.now - 1;
        this.loadFileList(this.page.now);
      } else {
        this.page.now = this.page.now;
        this.loadFileList(this.page.now);
      }
    },
    loadFileList(page) {
      axios(`/admin/carousel?page=${page}&limit=10`)
        .then(response => {
          this.page = response.data.page;
          this.imageList = response.data.carousel.data;
        })
        .catch(error => {
          if (error.response && error.response.data)
            console.error("get file list", error.response.data.error);
          else console.error("get file list", error.message);
        });
    },
    uploadFile() {
      if (this.isUploading) return "";
      this.isUploading = true;
      const formData = new FormData();
      formData.append("carousel", this.file);
      axios
        .post(`/admin/carousel`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          console.log("file id", response.data.id);
          this.filename = "";
          this.file = null;
          this.imageList.push(response.data);
          this.$refs.picture_input.value = "";
          alert("อัปโหลดรูปภาพสำเร็จ");
          this.loadFileList(1);
        })
        .catch(error => {
          if (error.response && error.response.data) {
            console.error("upload file", error.response.data.error);
            if (error.response.data.error === "Carousel already exists") {
              alert("เกิดข้อผิดพลาด: อัปโหลดรูปภาพซ้ำ");
            } else if (error.response.data.error === "No Carousel") {
              alert("เกิดข้อผิดพลาด: ไม่มีรูปภาพ หรือ รูปแบบรูปภาพไม่รองรับ");
            } else if (error.response.data.error === "Upload unsuccessful") {
              alert("เกิดข้อผิดพลาด: อัปโหลดไม่สำเร็จ");
            } else if (error.response.data.error === "Only JPEG or PNG") {
              alert("เกิดข้อผิดพลาด: รูปแบบรูปภาพไม่รองรับ");
            }
          } else console.error("upload file", error.message);
        })
        .finally(() => {
          this.isUploading = false;
        });
    },
    deleteImage(index) {
      const image = this.imageList[index];
      if (confirm(`ยืนยันว่าจะลบรูป ${image.id}?`)) {
        axios
          .delete(`/admin/carousel/${image.id}`)
          .then(response => {
            this.imageList.splice(index, 1);
            this.loadFileList(1);
          })
          .catch(error => {
            if (error.response && error.response.data)
              console.error("delete", error.response.data.error);
            else console.error("delete", error.message);
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
.no-result > div.inner-box > div {
  text-align: center;
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
.doc-table-filename {
  width: 50%;
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
